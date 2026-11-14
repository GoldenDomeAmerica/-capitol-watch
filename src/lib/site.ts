export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "American Capitol Watch";

export const SITE_DESCRIPTION =
  "Plain-English tracking of state-legislature bills. Georgia and Pennsylvania are the live sections: taxes, guns, schools, elections, property rights, energy, and abortion.";

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "No date on file";
  const iso = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function chamberLabel(chamber: string | null | undefined): string {
  if (chamber === "house" || chamber === "lower") return "House";
  if (chamber === "senate" || chamber === "upper") return "Senate";
  return chamber || "Unknown chamber";
}

export function partyShort(party: string | null | undefined): string {
  if (!party) return "";
  if (/republican/i.test(party)) return "R";
  if (/democrat/i.test(party)) return "D";
  return party.slice(0, 1).toUpperCase();
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isRecentAction(isoDate: string | null, withinDays = 14): boolean {
  if (!isoDate) return false;
  const then = Date.parse(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(then)) return false;
  const now = Date.parse(`${todayIso()}T00:00:00Z`);
  return now - then < withinDays * 24 * 60 * 60 * 1000;
}
