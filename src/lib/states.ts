export type StateSlug = "georgia" | "pennsylvania" | "arizona";

export type StateSection = {
  id: "ga" | "pa" | "az";
  slug: StateSlug;
  name: string;
  legislatureName: string;
  fullTime: boolean;
  scorecards: boolean;
  vetoes: boolean;
  /** House and Senate share one district number. */
  sharedDistrict: boolean;
  officialSite: string;
  billLinkLabel: string;
  textLinkLabel: string;
  summaryNote: string;
  censusState: string;
  addressPlaceholder: string;
  searchPlaceholder?: string;
  blurb: string;
  sessionNote: string;
};

// Launched sections are this list. Pages do not read the states table to decide what to show.
export const STATES: StateSection[] = [
  {
    id: "ga",
    slug: "georgia",
    name: "Georgia",
    legislatureName: "Georgia General Assembly",
    fullTime: false,
    scorecards: true,
    vetoes: false,
    sharedDistrict: false,
    officialSite: "https://www.legis.ga.gov/",
    billLinkLabel: "Official bill page at legis.ga.gov",
    textLinkLabel: "Official text",
    summaryNote: "Rewritten from the official caption and summary. This is not legal advice.",
    censusState: "Georgia",
    addressPlaceholder: "123 Main St, Atlanta, GA",
    blurb: "The Gold Dome. Bills, legislators, and scorecard links for the General Assembly.",
    sessionNote:
      "The 2025–2026 regular session has adjourned. Georgia's next regular session opens on the second Monday in January (January 11, 2027).",
  },
  {
    id: "pa",
    slug: "pennsylvania",
    name: "Pennsylvania",
    legislatureName: "Pennsylvania General Assembly",
    fullTime: true,
    scorecards: false,
    vetoes: false,
    sharedDistrict: false,
    officialSite: "https://www.palegis.us/",
    billLinkLabel: "Official bill page at palegis.us",
    textLinkLabel: "Printer's number PDF",
    summaryNote:
      "Taken from the official short title published by the Pennsylvania General Assembly. This is not legal advice.",
    censusState: "Pennsylvania",
    addressPlaceholder: "123 Main St, Harrisburg, PA",
    searchPlaceholder: "Search bills, such as voter ID or HB 437",
    blurb: "A full-time legislature. Recent activity, the roster, and ZIP or address lookup.",
    sessionNote:
      "Pennsylvania's General Assembly is a full-time legislature. Dates below are recent activity, not a short session window.",
  },
  {
    id: "az",
    slug: "arizona",
    name: "Arizona",
    legislatureName: "Arizona State Legislature",
    fullTime: false,
    scorecards: false,
    vetoes: true,
    sharedDistrict: true,
    officialSite: "https://www.azleg.gov/",
    billLinkLabel: "Official bill page at apps.azleg.gov",
    textLinkLabel: "Official text",
    summaryNote:
      "Taken from the official fact-sheet overview when one was published, otherwise from the short title. A strike-everything amendment uses the legislature's Now title. This is not legal advice.",
    censusState: "Arizona",
    addressPlaceholder: "123 Main St, Phoenix, AZ",
    searchPlaceholder: "Search bills, such as voter ID or SB 1037",
    blurb: "Bills from the 2025 and 2026 sessions, vetoes by Gov. Hobbs, and the sitting roster.",
    sessionNote:
      "This file covers the 2025 first regular session and the 2026 second regular session. Arizona's next regular session opens January 11, 2027.",
  },
];

export function stateBySlug(slug: string): StateSection | null {
  return STATES.find((state) => state.slug === slug) ?? null;
}

export function stateById(id: string): StateSection | null {
  return STATES.find((state) => state.id === id) ?? null;
}

export function stateListLabel(): string {
  const names = STATES.map((state) => state.name);
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}
