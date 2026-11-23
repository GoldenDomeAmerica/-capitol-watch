import { IDAHO_BILL_RESEARCH } from "@/lib/bill-research/idaho";
import type { BillResearch } from "@/lib/bill-research/types";

const ALL: BillResearch[] = [...IDAHO_BILL_RESEARCH];

const byStateAndSlug = new Map<string, BillResearch>(ALL.map((bill) => [`${bill.state}:${bill.slug}`, bill]));

/** Research for one bill, or null when that state and slug are not filled in yet. */
export function billResearchFor(stateSlug: string, slug: string): BillResearch | null {
  return byStateAndSlug.get(`${stateSlug}:${slug}`) ?? null;
}

export function researchedBillCount(stateSlug?: string): number {
  if (!stateSlug) return ALL.length;
  return ALL.filter((bill) => bill.state === stateSlug).length;
}
