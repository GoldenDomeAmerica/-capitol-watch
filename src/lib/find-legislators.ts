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

let cached: ZipFile | null = null;

export async function zipFile(): Promise<ZipFile | null> {
  if (cached) return cached;
  try {
    const file = path.join(process.cwd(), "data", "georgia", "zips.json");
    const raw = await readFile(file, "utf8");
    cached = JSON.parse(raw) as ZipFile;
    return cached;
  } catch {
    return null;
  }
}

export type DistrictHit = {
  chamber: "house" | "senate";
  district: number;
  share: number | null;
  note: string;
};

function topDistricts(rows: DistrictShare[], minimum = 0.15): DistrictShare[] {
  const sorted = [...rows].sort((a, b) => b.share - a.share);
  if (!sorted.length) return [];
  const kept = sorted.filter((row, index) => index === 0 || row.share >= minimum);
  return kept.slice(0, 3);
}

export async function districtsForZip(zip: string): Promise<{
  city: string | null;
  counties: string[];
  districts: DistrictHit[];
} | null> {
  const data = await zipFile();
  const record = data?.zips[zip];
  if (!record) return null;
  const districts: DistrictHit[] = [
    ...topDistricts(record.house).map((row) => ({
      chamber: "house" as const,
      district: row.district,
      share: row.share,
      note: "ZIP area",
    })),
    ...topDistricts(record.senate).map((row) => ({
      chamber: "senate" as const,
      district: row.district,
      share: row.share,
      note: "ZIP area",
    })),
  ];
  return { city: record.city, counties: record.counties, districts };
}

export async function countyNames(): Promise<string[]> {
  const data = await zipFile();
  return data?.counties ?? [];
}

type CensusMatch = {
  geographies?: Record<string, { BASENAME?: string; NAME?: string }[]>;
};

export async function districtsForAddress(address: string): Promise<{
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
    if (state?.BASENAME && state.BASENAME !== "Georgia") {
      return {
        matchedAddress: match.matchedAddress ?? null,
        county: null,
        districts: [],
        error: "That address is outside Georgia. This launch tracks Georgia only.",
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
