import type { Metadata } from "next";
import Link from "next/link";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { countyNames, districtsForAddress, districtsForZip, type DistrictHit } from "@/lib/find-legislators";
import { logError } from "@/lib/errors";
import { searchLegislators, type LegislatorCard } from "@/lib/queries";
import { chamberLabel, partyShort } from "@/lib/site";

export const metadata: Metadata = {
  title: "Georgia legislators",
  description: "Find Georgia state senators and representatives by name, district, county, ZIP, or street address.",
};

export default async function LegislatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; district?: string; chamber?: string; county?: string; zip?: string; address?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const county = params.county?.trim() || "";
  const zip = (params.zip || "").replace(/\D/g, "").slice(0, 5);
  const address = params.address?.trim() || "";
  const district = Number(params.district);
  const chamber = params.chamber === "house" || params.chamber === "senate" ? params.chamber : "";
  const counties = await countyNames();

  let note: string | null = null;
  let hits: DistrictHit[] = [];
  if (zip.length === 5) {
    const found = await districtsForZip(zip);
    if (!found) note = "That ZIP is not in the Georgia district file.";
    else {
      hits = found.districts;
      note = `${found.city || "This ZIP"} is in ${found.counties.join(", ") || "Georgia"}. Districts below are the ones that cover a meaningful share of the ZIP. A ZIP can cross district lines.`;
    }
  } else if (address) {
    const found = await districtsForAddress(address);
    note = found.error || (found.matchedAddress ? `Matched ${found.matchedAddress}${found.county ? `, ${found.county} County` : ""}.` : null);
    hits = found.districts;
  }

  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Find your legislators</h1>
        <Finder defaults={{ q, district: params.district, chamber, county, zip: params.zip, address }} counties={counties} />
        <StatusBanner>Connect the database to show the roster.</StatusBanner>
      </div>
    );
  }

  let people;
  let failed = false;
  try {
    people = await searchLegislators({
      q: hits.length ? undefined : q,
      county: hits.length ? undefined : county,
      district: hits.length ? undefined : Number.isFinite(district) ? district : undefined,
      chamber: hits.length ? undefined : chamber || undefined,
      districts: hits.map((hit) => ({ chamber: hit.chamber, district: hit.district })),
    });
  } catch (error) {
    await logError(error, "/georgia/legislators");
    failed = true;
  }
  if (failed || !people) return <StatusBanner>The roster could not be loaded.</StatusBanner>;
  return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Find your legislators</h1>
        <p className="text-sm text-muted">
          Search by name, district, or county. A ZIP uses a public district crosswalk. A street address uses the U.S. Census geocoder.
        </p>
        <Finder defaults={{ q, district: params.district, chamber, county, zip: params.zip, address }} counties={counties} />
        {note ? <StatusBanner>{note}</StatusBanner> : null}
        <Roster people={people} />
      </div>
    );
}

function Finder({
  defaults,
  counties,
}: {
  defaults: { q?: string; district?: string; chamber?: string; county?: string; zip?: string; address?: string };
  counties: string[];
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-line bg-paper p-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">
        Name or city
        <input name="q" defaultValue={defaults.q} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        District number
        <input name="district" inputMode="numeric" defaultValue={defaults.district} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        Chamber
        <select name="chamber" defaultValue={defaults.chamber || ""} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal">
          <option value="">Either</option>
          <option value="house">House</option>
          <option value="senate">Senate</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        County
        <input name="county" list="ga-counties" defaultValue={defaults.county} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
        <datalist id="ga-counties">
          {counties.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <label className="text-sm font-semibold">
        ZIP code
        <input name="zip" inputMode="numeric" defaultValue={defaults.zip} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        Street address
        <input name="address" defaultValue={defaults.address} placeholder="123 Main St, Atlanta, GA" className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <button type="submit" className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white sm:col-span-2">
        Search
      </button>
    </form>
  );
}

function Roster({ people }: { people: LegislatorCard[] }) {
  if (people.length === 0) return <StatusBanner>No legislators matched.</StatusBanner>;
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
      {people.map((person) => (
        <li key={person.id}>
          <Link href={`/georgia/legislators/${person.slug}`} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-cream">
            <span>
              <span className="block font-semibold text-navy">{person.name}</span>
              <span className="text-sm text-muted">
                {partyShort(person.party) ? `${partyShort(person.party)} · ` : ""}
                {chamberLabel(person.chamber)} {person.district}
                {person.residence ? ` · ${person.residence}` : ""}
                {person.counties.length ? ` · ${person.counties.slice(0, 3).join(", ")}` : ""}
              </span>
            </span>
            {!person.isCurrent ? <span className="text-xs text-muted">{person.status || "Former"}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
