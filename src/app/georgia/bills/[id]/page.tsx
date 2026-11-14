import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import type { GovernorAction, PassageVote } from "@/db/schema";
import { logError } from "@/lib/errors";
import { getBill } from "@/lib/queries";
import { chamberLabel, formatDate, partyShort } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!databaseConfigured()) return { title: "Bill" };
  try {
    const bill = await getBill(id);
    if (!bill) return { title: "Bill not found" };
    return {
      title: `${bill.identifier}: ${bill.title}`,
      description: bill.summary.slice(0, 180),
    };
  } catch {
    return { title: "Bill" };
  }
}

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!databaseConfigured()) {
    return <StatusBanner>Connect the database to open bill pages.</StatusBanner>;
  }
  let bill;
  let failed = false;
  try {
    bill = await getBill(id);
  } catch (error) {
    await logError(error, `/georgia/bills/${id}`);
    failed = true;
  }
  if (failed) return <StatusBanner>This bill could not be loaded.</StatusBanner>;
  if (!bill) notFound();
  return (
      <article className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-crimson">
          {bill.identifier} · {chamberLabel(bill.chamber)} · {bill.sessionName}
        </p>
        <h1 className="font-serif text-3xl leading-tight text-navy sm:text-4xl">{bill.title}</h1>
        <section className="rounded-lg border border-line bg-paper p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Plain-English summary</h2>
          <p className="mt-2 text-base leading-relaxed">{bill.summary}</p>
          <p className="mt-2 text-xs text-muted">Rewritten from the official caption and summary. This is not legal advice.</p>
        </section>
        {bill.officialSummary ? (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Official summary</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">{bill.officialSummary}</p>
          </section>
        ) : null}
        {bill.watchNote ? (
          <aside className="border-l-4 border-crimson bg-paper px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-crimson">Watch note · opinion</h2>
            <p className="mt-1 text-sm leading-relaxed">{bill.watchNote}</p>
          </aside>
        ) : null}
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-muted">Status / last action</dt>
            <dd>
              {bill.lastAction || bill.status || "Not listed"} · {formatDate(bill.lastActionDate)}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Chamber</dt>
            <dd>{chamberLabel(bill.chamber)}</dd>
          </div>
          <GovernorLine action={bill.governorAction} />
        </dl>
        <section>
          <h2 className="font-serif text-2xl text-navy">Sponsors</h2>
          {bill.sponsors.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No sponsors were listed in the source file.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {bill.sponsors.map((sponsor) => (
                <li key={sponsor.name}>
                  {sponsor.slug ? (
                    <Link className="font-semibold text-navy underline" href={`/georgia/legislators/${sponsor.slug}`}>
                      {sponsor.name}
                    </Link>
                  ) : (
                    <span className="font-semibold">{sponsor.name}</span>
                  )}
                  {sponsor.isPrimary ? " · primary sponsor" : ""}
                  {sponsor.party ? ` · ${partyShort(sponsor.party)}` : ""}
                  {sponsor.district ? ` · ${chamberLabel(sponsor.chamber)} ${sponsor.district}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
        <Passage votes={bill.passageVotes} />
        <div className="flex flex-wrap gap-2">
          {bill.topics.map((topic) => (
            <Link key={topic.slug} href={`/georgia/topics/${topic.slug}`} className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-navy">
              {topic.name}
            </Link>
          ))}
        </div>
        <p className="text-sm">
          <a className="font-semibold text-crimson underline" href={bill.sourceUrl}>
            Official bill page at legis.ga.gov
          </a>
          {bill.textUrl ? (
            <>
              {" · "}
              <a className="font-semibold text-navy underline" href={bill.textUrl}>
                Official text
              </a>
            </>
          ) : null}
        </p>
      </article>
    );
}

function GovernorLine({ action }: { action: GovernorAction | null }) {
  if (!action?.status && !action?.actNumber) return null;
  const bits = [action.status, action.decisionDate ? formatDate(action.decisionDate) : null, action.actNumber ? `Act ${action.actNumber}` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <div>
      <dt className="font-semibold text-muted">Governor</dt>
      <dd>{bits}</dd>
    </div>
  );
}

function Passage({ votes }: { votes: PassageVote[] | null }) {
  if (!votes?.length) return null;
  return (
    <section>
      <h2 className="font-serif text-2xl text-navy">Recorded floor tallies</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {votes.map((vote, index) => (
          <li key={`${vote.date}-${vote.chamber}-${index}`} className="rounded-md border border-line bg-paper px-3 py-2">
            {chamberLabel(vote.chamber)} · {vote.motionText || "Vote"} · {vote.result || "result not listed"} ·{" "}
            {vote.yea ?? "?"} yea, {vote.nay ?? "?"} nay
            {vote.date ? ` · ${formatDate(vote.date)}` : ""}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">Tallies are the floor totals from the legislative record. How each member voted is on the legislator pages when a roll call was published.</p>
    </section>
  );
}
