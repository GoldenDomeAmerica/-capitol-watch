import { readFile } from "node:fs/promises";
import path from "node:path";

type DistrictShare = { district: number; share: number };

type ZipRecord = {
  city: string;
  counties: string[];
  house: DistrictShare[];
  senate: DistrictShare[];
};

type ZipFile = {
  counties: string[];
  zips: Record<string, ZipRecord>;
};

const cached = new Map<string, ZipFile | null>();

export async function zipFile(stateSlug: string): Promise<ZipFile | null> {
  if (cached.has(stateSlug)) return cached.get(stateSlug) ?? null;
  try {
    const file = path.join(process.cwd(), "data", stateSlug, "zips.json");
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as ZipFile;
    cached.set(stateSlug, parsed);
    return parsed;
  } catch {
    cached.set(stateSlug, null);
    return null;
  }
}

export type DistrictHit = {
  chamber: "house" | "senate";
  district: number;
  share: number | null;
  note: string;
};

function topDistricts(rows: DistrictShare[], minimum: number, cap: number): DistrictShare[] {
  const sorted = [...rows].sort((a, b) => b.share - a.share);
  if (!sorted.length) return [];
  const kept = sorted.filter((row, index) => index === 0 || row.share >= minimum);
  return kept.slice(0, cap);
}

export async function districtsForZip(
  stateSlug: string,
  zip: string,
): Promise<{
  city: string | null;
  counties: string[];
  districts: DistrictHit[];
} | null> {
  const data = await zipFile(stateSlug);
  const record = data?.zips[zip];
  if (!record) return null;
  const splitAware = stateSlug === "pennsylvania";
  const minimum = splitAware ? 0.02 : 0.15;
  const cap = splitAware ? 8 : 3;
  const districts: DistrictHit[] = [
    ...topDistricts(record.house, minimum, cap).map((row) => ({
      chamber: "house" as const,
      district: row.district,
      share: row.share,
      note: "ZIP area",
    })),
    ...topDistricts(record.senate, minimum, cap).map((row) => ({
      chamber: "senate" as const,
      district: row.district,
      share: row.share,
      note: "ZIP area",
    })),
  ];
  return { city: record.city, counties: record.counties, districts };
}

export async function countyNames(stateSlug: string): Promise<string[]> {
  const data = await zipFile(stateSlug);
  return data?.counties ?? [];
}

type CensusMatch = {
  geographies?: Record<string, { BASENAME?: string; NAME?: string }[]>;
};

export async function districtsForAddress(
  address: string,
  censusState: string,
): Promise<{
  matchedAddress: string | null;
  county: string | null;
  districts: DistrictHit[];
  error: string | null;
}> {
  const url = new URL(
    "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress",
  );
  url.searchParams.set("address", address);
  url.searchParams.set("benchmark", "Public_AR_Current");
  url.searchParams.set("vintage", "Current_Current");
  url.searchParams.set("format", "json");
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "AmericanCapitolWatch/1.0" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        matchedAddress: null,
        county: null,
        districts: [],
        error: "The Census address lookup did not respond. Try a ZIP code instead.",
      };
    }
    const payload = (await response.json()) as {
      result?: { addressMatches?: { matchedAddress?: string; geographies?: CensusMatch["geographies"] }[] };
    };
    const match = payload.result?.addressMatches?.[0];
    if (!match) {
      return {
        matchedAddress: null,
        county: null,
        districts: [],
        error: "No match for that address. Try a street, city, and ZIP.",
      };
    }
    const geos = match.geographies ?? {};
    const state = Object.entries(geos).find(([name]) => name === "States")?.[1]?.[0];
    if (state?.BASENAME && state.BASENAME !== censusState) {
      return {
        matchedAddress: match.matchedAddress ?? null,
        county: null,
        districts: [],
        error: `That address is outside ${censusState}.`,
      };
    }
    const county =
      Object.entries(geos).find(([name]) => name === "Counties")?.[1]?.[0]?.BASENAME ?? null;
    const lower = Object.entries(geos).find(([name]) =>
      name.includes("State Legislative Districts - Lower"),
    )?.[1]?.[0]?.BASENAME;
    const upper = Object.entries(geos).find(([name]) =>
      name.includes("State Legislative Districts - Upper"),
    )?.[1]?.[0]?.BASENAME;
    const districts: DistrictHit[] = [];
    const house = Number(lower);
    const senate = Number(upper);
    if (Number.isFinite(house)) {
      districts.push({ chamber: "house", district: house, share: null, note: "address point" });
    }
    if (Number.isFinite(senate)) {
      districts.push({ chamber: "senate", district: senate, share: null, note: "address point" });
    }
    return { matchedAddress: match.matchedAddress ?? null, county, districts, error: null };
  } catch {
    return {
      matchedAddress: null,
      county: null,
      districts: [],
      error: "The Census address lookup is unavailable right now. Search by name, district, county, or ZIP.",
    };
  }
}
