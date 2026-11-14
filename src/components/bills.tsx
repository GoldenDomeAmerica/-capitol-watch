import Link from "next/link";
import type { BillCard } from "@/lib/queries";
import { chamberLabel, formatDate } from "@/lib/site";

export function BillCardView({ bill }: { bill: BillCard }) {
  return (
    <article className="rounded-lg border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="text-crimson">{bill.identifier}</span>
        <span>{chamberLabel(bill.chamber)}</span>
        <span>{bill.status || "Status not listed"}</span>
      </div>
      <h3 className="mt-1 font-serif text-xl leading-snug text-navy">
        <Link href={`/georgia/bills/${bill.slug}`} className="hover:text-crimson">
          {bill.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed">{bill.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {bill.topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/georgia/topics/${topic.slug}`}
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
  q,
  topic,
}: {
  q?: string;
  topic?: string;
}) {
  return (
    <form action="/georgia/bills" className="flex flex-col gap-2 sm:flex-row">
      {topic ? <input type="hidden" name="topic" value={topic} /> : null}
      <label className="sr-only" htmlFor="bill-q">
        Search bills
      </label>
      <input
        id="bill-q"
        name="q"
        defaultValue={q}
        placeholder="Search bills, such as income tax or HB 111"
        className="min-h-11 flex-1 rounded-md border border-line bg-white px-3 text-base"
      />
      <button type="submit" className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white">
        Search
      </button>
    </form>
  );
}
