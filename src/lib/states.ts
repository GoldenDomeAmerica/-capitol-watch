export type StateSlug = "georgia" | "pennsylvania";

export type StateSection = {
  id: "ga" | "pa";
  slug: StateSlug;
  name: string;
  legislatureName: string;
  fullTime: boolean;
  scorecards: boolean;
  officialSite: string;
  billLinkLabel: string;
  textLinkLabel: string;
  summaryNote: string;
  censusState: string;
  addressPlaceholder: string;
  sessionNote: string;
};

export const STATES: StateSection[] = [
  {
    id: "ga",
    slug: "georgia",
    name: "Georgia",
    legislatureName: "Georgia General Assembly",
    fullTime: false,
    scorecards: true,
    officialSite: "https://www.legis.ga.gov/",
    billLinkLabel: "Official bill page at legis.ga.gov",
    textLinkLabel: "Official text",
    summaryNote: "Rewritten from the official caption and summary. This is not legal advice.",
    censusState: "Georgia",
    addressPlaceholder: "123 Main St, Atlanta, GA",
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
    officialSite: "https://www.palegis.us/",
    billLinkLabel: "Official bill page at palegis.us",
    textLinkLabel: "Printer's number PDF",
    summaryNote:
      "Taken from the official short title published by the Pennsylvania General Assembly. This is not legal advice.",
    censusState: "Pennsylvania",
    addressPlaceholder: "123 Main St, Harrisburg, PA",
    sessionNote:
      "Pennsylvania's General Assembly is a full-time legislature. Dates below are recent activity, not a short session window.",
  },
];

export function stateBySlug(slug: string): StateSection | null {
  return STATES.find((state) => state.slug === slug) ?? null;
}

export function stateById(id: string): StateSection | null {
  return STATES.find((state) => state.id === id) ?? null;
}
