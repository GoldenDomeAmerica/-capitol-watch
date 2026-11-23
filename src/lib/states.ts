export type StateSlug = "georgia" | "pennsylvania" | "arizona" | "idaho" | "new-york" | "texas";

export type CreditStyle = "compiled" | "public-as-is" | "legislature";

export type StateSection = {
  id: "ga" | "pa" | "az" | "id" | "ny" | "tx";
  slug: StateSlug;
  name: string;
  legislatureName: string;
  /** How the public footer names this state's official records. */
  creditStyle: CreditStyle;
  /** File, feed, or API the importer reads, named on the contact page and footer. */
  sourceDetail: string;
  compiler?: { label: string; href: string; note: string };
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
  /**
   * When the section becomes public. Null means it is already live.
   * An ISO timestamp with a numeric offset, compared at request time.
   */
  launchesAt: string | null;
};

// Launched sections are this list. Pages do not read the states table to decide what to show.
export const STATES: StateSection[] = [
  {
    id: "ga",
    slug: "georgia",
    name: "Georgia",
    legislatureName: "Georgia General Assembly",
    creditStyle: "compiled",
    sourceDetail: "official web service",
    compiler: { label: "VoteGA.org", href: "https://votega.org", note: "(CC BY-SA 4.0)" },
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
    blurb: "Bills, legislators, and scorecard links for the General Assembly.",
    sessionNote:
      "The 2025–2026 regular session has adjourned. Georgia's next regular session opens on the second Monday in January (January 11, 2027).",
    launchesAt: null,
  },
  {
    id: "pa",
    slug: "pennsylvania",
    name: "Pennsylvania",
    legislatureName: "Pennsylvania General Assembly",
    creditStyle: "public-as-is",
    sourceDetail: "Bill History file and member records",
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
    launchesAt: null,
  },
  {
    id: "az",
    slug: "arizona",
    name: "Arizona",
    legislatureName: "Arizona State Legislature",
    creditStyle: "legislature",
    sourceDetail: "bill-status API and member roster",
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
    launchesAt: null,
  },
  {
    id: "id",
    slug: "idaho",
    name: "Idaho",
    legislatureName: "Idaho Legislature",
    creditStyle: "legislature",
    sourceDetail: "2026 legislation index, bill pages, and member directory",
    fullTime: false,
    scorecards: false,
    vetoes: false,
    sharedDistrict: true,
    officialSite: "https://legislature.idaho.gov/",
    billLinkLabel: "Official bill page at legislature.idaho.gov",
    textLinkLabel: "Official bill text",
    summaryNote:
      "Rewritten in plain language from the official description on the legislature's bill page. If that description does not say what the bill would do, the page says a summary is not available yet. This is not legal advice.",
    censusState: "Idaho",
    addressPlaceholder: "123 Main St, Boise, ID",
    searchPlaceholder: "Search bills, such as sales tax or H0489",
    blurb: "A shortlist from the 2026 regular session, plus the House and Senate roster.",
    sessionNote:
      "This file covers the 2026 regular session of the 68th Idaho Legislature, which convened January 12, 2026. House and Senate share a district number. House seats are labeled Seat A and Seat B.",
    launchesAt: "2026-11-21T07:00:00-05:00",
  },
  {
    id: "ny",
    slug: "new-york",
    name: "New York",
    legislatureName: "New York State Legislature",
    creditStyle: "legislature",
    sourceDetail: "Assembly bill pages and member directory",
    fullTime: false,
    scorecards: false,
    vetoes: false,
    sharedDistrict: false,
    officialSite: "https://nyassembly.gov/",
    billLinkLabel: "Official bill page at nyassembly.gov",
    textLinkLabel: "Official bill text",
    summaryNote:
      "Taken from the official summary on the New York State Assembly bill page. This is not legal advice.",
    censusState: "New York",
    addressPlaceholder: "123 Main St, Albany, NY",
    searchPlaceholder: "Search bills, such as rent or A100",
    blurb: "Assembly bills from the 2025–2026 session, and the Assembly and Senate roster.",
    sessionNote:
      "This file covers the 2025–2026 legislative session, which New York names by the opening year, 2025. The tracked bills are ones an Assembly member prime-sponsored.",
    // Held by owner request until bill research is ready; set a real date to launch.
    launchesAt: "2099-01-01T07:00:00-05:00",
  },
  {
    id: "tx",
    slug: "texas",
    name: "Texas",
    legislatureName: "Texas Legislature",
    creditStyle: "public-as-is",
    sourceDetail: "filed-bill reports and member directories",
    fullTime: false,
    scorecards: false,
    vetoes: false,
    sharedDistrict: false,
    officialSite: "https://capitol.texas.gov/",
    billLinkLabel: "Official bill history at capitol.texas.gov",
    textLinkLabel: "Official text",
    summaryNote:
      "Taken from the official caption on the Texas Legislature Online filed-bill report. This is not legal advice.",
    censusState: "Texas",
    addressPlaceholder: "123 Main St, Austin, TX",
    searchPlaceholder: "Search bills, such as schools or HB 101",
    blurb: "Bills filed for the 90th regular session, and the current House and Senate roster.",
    sessionNote:
      "This file covers bills filed for the 90th Legislature regular session. The regular session convenes in January 2027. The roster is the sitting directory published for the 89th Legislature.",
    // Held by owner request until bill research is ready; set a real date to launch.
    launchesAt: "2099-01-01T07:00:00-05:00",
  },
];

export function stateBySlug(slug: string): StateSection | null {
  return STATES.find((state) => state.slug === slug) ?? null;
}

export function stateById(id: string): StateSection | null {
  return STATES.find((state) => state.id === id) ?? null;
}

export function stateListLabel(states: { name: string }[]): string {
  const names = states.map((state) => state.name);
  if (names.length < 2) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}
