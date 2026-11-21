import Link from "next/link";
import type { GovernorAction } from "@/db/schema";
import { displayBillSummary, displayBillTitle, PLAIN_SUMMARY_UNAVAILABLE } from "@/lib/plain-summaries";
import type { BillCard } from "@/lib/queries";
import { chamberLabel, formatDate } from "@/lib/site";

export function hobbsVetoBadge(stateSlug: string, action: GovernorAction | null | undefined): string | null {
  if (stateSlug !== "arizona") return null;
  if (!action?.status || !/veto/i.test(action.status)) return null;
  return "Vetoed by Gov. Hobbs";
}

export function BillCardView({ bill, stateSlug }: { bill: BillCard; stateSlug: string }) {
  const veto = hobbsVetoBadge(stateSlug, bill.governorAction);
  const summary = displayBillSummary(stateSlug, bill.slug, bill.summary);
  const title = displayBillTitle(stateSlug, bill.slug, bill.title);
  return (
    <article className="rounded-lg border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="text-crimson">{bill.identifier}</span>
        <span>{chamberLabel(bill.chamber)}</span>
        <span>{bill.status || "Status not listed"}</span>
        {veto ? <span className="rounded-full bg-crimson px-2 py-0.5 text-white">{veto}</span> : null}
      </div>
      <h3 className="mt-1 font-serif text-xl leading-snug text-navy">
        <Link href={`/${stateSlug}/bills/${bill.slug}`} className="hover:text-crimson">
          {title}
        </Link>
      </h3>
      <p
        className={
          summary === PLAIN_SUMMARY_UNAVAILABLE
            ? "mt-2 text-sm leading-relaxed text-muted"
            : "mt-2 text-sm leading-relaxed"
        }
      >
        {summary}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {bill.topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${stateSlug}/topics/${topic.slug}`}
            className="rounded-full bg-cream px-2 py-0.5 text-xs font-semibold text-navy"
          >
            {topic.name}
          </Link>
        ))}
        <span className="text-xs text-muted">{formatDate(bill.lastActionDate)}</span>
      </div>
    </article>
  );
}

export function BillSearch({
  stateSlug,
  q,
  topic,
  placeholder,
}: {
  stateSlug: string;
  q?: string;
  topic?: string;
  placeholder?: string;
}) {
  return (
    <form action={`/${stateSlug}/bills`} className="flex flex-col gap-2 sm:flex-row">
      {topic ? <input type="hidden" name="topic" value={topic} /> : null}
      <label className="sr-only" htmlFor="bill-q">
        Search bills
      </label>
      <input
        id="bill-q"
        name="q"
        defaultValue={q}
        placeholder={placeholder ?? "Search bills, such as income tax or HB 111"}
        className="min-h-11 flex-1 rounded-md border border-line bg-white px-3 text-base"
      />
      <button type="submit" className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white">
        Search
      </button>
    </form>
  );
}
