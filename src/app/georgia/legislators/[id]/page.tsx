import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { logError } from "@/lib/errors";
import { getLegislator } from "@/lib/queries";
import { chamberLabel, formatDate, partyShort } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!databaseConfigured()) return { title: "Legislator" };
  try {
    const row = await getLegislator(id);
    if (!row) return { title: "Legislator not found" };
    const person = row.person;
    return {
      title: person.name,
      description: `${person.name}, ${chamberLabel(person.chamber)} District ${person.district}, and the tracked bills and recorded votes on file.`,
    };
  } catch {
    return { title: "Legislator" };
  }
}

export default async function LegislatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!databaseConfigured()) return <StatusBanner>Connect the database to open legislator pages.</StatusBanner>;
  let row;
  let failed = false;
  try {
    row = await getLegislator(id);
  } catch (error) {
    await logError(error, `/georgia/legislators/${id}`);
    failed = true;
  }
  if (failed) return <StatusBanner>This legislator page could not be loaded.</StatusBanner>;
  if (!row) notFound();
  const { person, sponsored, recorded } = row;
  return (
      <article className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-crimson">
          {chamberLabel(person.chamber)} District {person.district}
          {person.party ? ` · ${person.party}` : ""}
          {!person.isCurrent ? ` · ${person.status || "Not current"}` : ""}
        </p>
        <div className="flex items-start gap-4">
          {person.imageUrl ? (
            // Official portrait hosted by the General Assembly.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.imageUrl}
              alt=""
              width={96}
              height={120}
              className="h-28 w-24 rounded-md border border-line object-cover object-top"
            />
          ) : (
            <div className="flex h-28 w-24 items-center justify-center rounded-md bg-navy font-serif text-2xl text-white">
              {partyShort(person.party) || "GA"}
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl text-navy">{person.name}</h1>
            {person.leadershipRole ? <p className="text-sm">{person.leadershipRole}</p> : null}
            <p className="mt-1 text-sm text-muted">
              {person.residence ? `${person.residence}` : "Residence not listed"}
              {person.counties.length ? ` · Counties in the district file: ${person.counties.join(", ")}` : ""}
            </p>
          </div>
        </div>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {person.email ? (
            <div>
              <dt className="font-semibold text-muted">Email</dt>
              <dd>
                <a className="underline" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              </dd>
            </div>
          ) : null}
          {person.phone ? (
            <div>
              <dt className="font-semibold text-muted">Phone</dt>
              <dd>{person.phone}</dd>
            </div>
          ) : null}
          {person.address ? (
            <div className="sm:col-span-2">
              <dt className="font-semibold text-muted">Capitol office</dt>
              <dd>{person.address}</dd>
            </div>
          ) : null}
        </dl>
        <p className="text-sm">
          <a className="font-semibold text-crimson underline" href={person.profileUrl}>
            Official member page
          </a>
        </p>
        {person.committees?.length ? (
          <p className="text-sm">
            <span className="font-semibold">Committees: </span>
            {person.committees.join(", ")}
          </p>
        ) : null}
        <section>
          <h2 className="font-serif text-2xl text-navy">Sponsored bills we track</h2>
          {sponsored.length === 0 ? (
            <p className="mt-2 text-sm text-muted">None of the bills in this tracker list this member as a sponsor.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {sponsored.map((bill) => (
                <li key={bill.slug}>
                  <Link className="font-semibold text-navy underline" href={`/georgia/bills/${bill.slug}`}>
                    {bill.identifier}
                  </Link>{" "}
                  {bill.title}
                  {bill.isPrimary ? " · primary sponsor" : ""}
                  {bill.status ? ` · ${bill.status}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="font-serif text-2xl text-navy">Recorded votes on tracked bills</h2>
          {recorded.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No floor vote on a tracked bill is in the roll-call file for this member.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm">
              {recorded.map((vote) => (
                <li key={vote.id} className="rounded-md border border-line bg-paper px-3 py-2">
                  <span className="font-semibold">{vote.position}</span>
                  {" · "}
                  {vote.billSlug ? (
                    <Link className="underline" href={`/georgia/bills/${vote.billSlug}`}>
                      {vote.billIdentifier}
                    </Link>
                  ) : (
                    vote.billIdentifier
                  )}{" "}
                  {vote.billTitle ? `· ${vote.billTitle}` : ""}
                  <span className="block text-muted">
                    {vote.motion || "Vote"} · {vote.result || "result not listed"} · {formatDate(vote.voteDate)}
                    {vote.yea != null ? ` · ${vote.yea}–${vote.nay ?? "?"}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    );
}
