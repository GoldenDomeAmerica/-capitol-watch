/** Static per-bill research. Missing facts use the string "Not found". Do not guess. */

export const RESEARCH_CHECKED = "2026-11-22" as const;

export const RESEARCH_COMING_SOON = "Detailed research for this bill is coming soon.";

export type BillTimelineItem = {
  date: string;
  action: string;
};

export type BillVoteTally = {
  chamber: string;
  date: string;
  yes: number;
  no: number;
  absent: number;
  url: string;
};

export type BillResearchSponsor = {
  name: string;
  party: string;
  role: string;
  url: string;
};

export type ViewpointQuote = {
  quote: string;
  speaker: string;
  party: string;
  role: string;
  outlet: string;
  date: string;
  url: string;
  /** Defaults to CONSERVATIVE VIEW or LIBERAL VIEW. */
  label?: string;
};

export type BillNewsItem = {
  outlet: string;
  date: string;
  title: string;
  url: string;
};

export type BillSource = {
  label: string;
  url: string;
  checked: typeof RESEARCH_CHECKED;
};

export type SponsorStatement = {
  quote: string;
  speaker: string;
  party: string;
  role: string;
  url: string;
};

export type BillResearch = {
  state: string;
  slug: string;
  identifier: string;
  /** One or two paragraphs. Shown on the bill card. */
  shortSummary: string;
  statusLabel: string;
  whatItChanges: string;
  timeline: BillTimelineItem[];
  fiscalNote: string;
  votes: BillVoteTally[];
  sponsors: BillResearchSponsor[];
  conservativeView?: ViewpointQuote[];
  liberalView?: ViewpointQuote[];
  /** Shown under the boxes, or as the only box when bipartisan is true. */
  viewpointNote?: string;
  /** One neutral box instead of red and blue. */
  bipartisan?: boolean;
  sponsorStatement?: SponsorStatement;
  news: BillNewsItem[];
  sources: BillSource[];
};
