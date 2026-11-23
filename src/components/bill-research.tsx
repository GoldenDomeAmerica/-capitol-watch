import { chamberLabel, formatDate } from "@/lib/site";
import { RESEARCH_COMING_SOON } from "@/lib/bill-research/types";
import type { BillResearch, ViewpointQuote } from "@/lib/bill-research/types";

function paragraphs(text: string) {
  return text.split(/\n\n+/).filter(Boolean);
}

function Citation({ quote }: { quote: ViewpointQuote }) {
  const party = quote.party === "party not stated" ? "party not stated" : quote.party;
  return (
    <p className="mt-2 text-sm text-viewpoint-citation">
      <span className="font-semibold uppercase tracking-wide">Citation: </span>
      {quote.speaker} ({party}), {quote.role},{" "}
      <a className="underline" href={quote.url}>
        {quote.outlet}
      </a>
      , {quote.date}
    </p>
  );
}

function QuoteBox({
  quote,
  tone,
}: {
  quote: ViewpointQuote;
  tone: "conservative" | "liberal";
}) {
  const label =
    quote.label ?? (tone === "conservative" ? "CONSERVATIVE VIEW · Opinion" : "LIBERAL VIEW · Opinion");
  const box =
    tone === "conservative"
      ? "border-viewpoint-conservative-border bg-viewpoint-conservative-bg"
      : "border-viewpoint-liberal-border bg-viewpoint-liberal-bg";
  const labelClass =
    tone === "conservative" ? "text-viewpoint-conservative-label" : "text-viewpoint-liberal-label";
  const quoteClass = tone === "conservative" ? "text-viewpoint-conservative-quote" : "text-viewpoint-liberal-quote";
  return (
    <blockquote className={`border-l-4 p-4 ${box}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}>{label}</p>
      <p className={`mt-2 text-base leading-relaxed ${quoteClass}`}>{quote.quote}</p>
      <Citation quote={quote} />
    </blockquote>
  );
}

function MissingSide({ side }: { side: "conservative" | "liberal" }) {
  return (
    <div className="border-l-4 border-viewpoint-neutral-border bg-viewpoint-neutral-bg p-4">
      <p className="text-sm leading-relaxed text-viewpoint-neutral-text">
        No {side} quote on the record was found.
      </p>
    </div>
  );
}

export function BillResearchSections({ research }: { research: BillResearch | null }) {
  if (!research) {
    return <p className="text-sm text-muted">{RESEARCH_COMING_SOON}</p>;
  }
  return (
    <div className="space-y-6">
      <p className="inline-flex rounded-full border border-line bg-paper px-3 py-1 text-sm font-semibold text-navy">
        {research.statusLabel}
      </p>
      <section>
        <h2 className="font-serif text-2xl text-navy">What it changes</h2>
        <div className="mt-2 max-w-2xl space-y-3 text-base leading-relaxed">
          {paragraphs(research.whatItChanges).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">Timeline</h2>
        {research.timeline.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Not found</p>
        ) : (
          <ol className="mt-2 space-y-2 text-sm">
            {research.timeline.map((item) => (
              <li key={`${item.date}-${item.action}`} className="rounded-md border border-line bg-paper px-3 py-2">
                <span className="text-muted">{formatDate(item.date)}</span>
                {" · "}
                {item.action}
              </li>
            ))}
          </ol>
        )}
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">Cost</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed">{research.fiscalNote || "Not found"}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">How they voted</h2>
        {research.votes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Not found</p>
        ) : (
          <ul className="mt-2 space-y-3 text-sm">
            {research.votes.map((vote) => (
              <li key={`${vote.chamber}-${vote.date}`} className="rounded-md border border-line bg-paper px-3 py-2">
                <p>
                  {chamberLabel(vote.chamber)} · {formatDate(vote.date)} · {vote.yes} yes, {vote.no} no, {vote.absent}{" "}
                  absent
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold text-navy">See how each member voted</summary>
                  <p className="mt-2">
                    <a className="font-semibold text-crimson underline" href={vote.url}>
                      Official roll call on the legislature&apos;s bill page
                    </a>
                  </p>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-navy">Viewpoints (opinion, not fact)</h2>
        {research.sponsorStatement ? (
          <aside className="rounded-lg border border-line bg-paper p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Sponsor&apos;s view (opinion)</h3>
            <p className="mt-2 text-base leading-relaxed">{research.sponsorStatement.quote}</p>
            <p className="mt-2 text-sm text-viewpoint-citation">
              <span className="font-semibold uppercase tracking-wide">Citation: </span>
              {research.sponsorStatement.speaker} ({research.sponsorStatement.party}), {research.sponsorStatement.role},{" "}
              <a className="underline" href={research.sponsorStatement.url}>
                Statement of Purpose
              </a>
            </p>
            <p className="mt-2 text-xs text-muted">
              The legislature says this statement of purpose is prepared by a proponent of the bill and is not an expression
              of legislative intent.
            </p>
          </aside>
        ) : null}
        {research.bipartisan ? (
          <div className="border-l-4 border-viewpoint-neutral-border bg-viewpoint-neutral-bg p-4">
            <p className="text-sm leading-relaxed text-viewpoint-neutral-text">{research.viewpointNote}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(research.conservativeView ?? []).map((quote) => (
              <QuoteBox key={quote.quote} quote={quote} tone="conservative" />
            ))}
            {(research.conservativeView ?? []).length === 0 ? <MissingSide side="conservative" /> : null}
            {(research.liberalView ?? []).map((quote) => (
              <QuoteBox key={quote.quote} quote={quote} tone="liberal" />
            ))}
            {(research.liberalView ?? []).length === 0 ? <MissingSide side="liberal" /> : null}
            {research.viewpointNote ? <p className="text-sm text-muted">{research.viewpointNote}</p> : null}
          </div>
        )}
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">In the news</h2>
        {research.news.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Not found</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {research.news.map((item) => (
              <li key={item.url}>
                <a className="font-semibold text-navy underline" href={item.url}>
                  {item.title === "Not found" ? item.outlet : item.title}
                </a>
                {" · "}
                <span className="text-muted">
                  {item.outlet}
                  {item.date === "Not found" ? "" : ` · ${item.date}`}
                  {item.title === "Not found" ? " · Headline: Not found" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">Sources</h2>
        <p className="mt-1 text-xs text-muted">checked Nov 22, 2026</p>
        <ul className="mt-2 space-y-1 text-sm">
          {research.sources.map((item) => (
            <li key={item.url + item.label}>
              <a className="text-navy underline" href={item.url}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
