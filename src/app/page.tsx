import Link from "next/link";
import { BillCardView } from "@/components/bills";
import { SignupForm } from "@/components/signup-form";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { getKeyBills, getLatestActionDate, getRecentBills, type BillCard } from "@/lib/queries";
import { logError } from "@/lib/errors";
import { stateBySlug } from "@/lib/states";
import { TOPICS } from "@/lib/topics";
import { formatDate, isRecentAction } from "@/lib/site";

export default async function HomePage() {
  if (!databaseConfigured()) {
    return (
      <div className="space-y-6">
        <HomeIntro />
        <StateList />
        <StatusBanner>
          The database is not connected yet. Set DATABASE_URL, run the migration, and seed Georgia and Pennsylvania. The rest of
          the site stays up.
        </StatusBanner>
        <SignupForm />
      </div>
    );
  }

  let georgiaBills: BillCard[] | undefined;
  let pennsylvaniaBills: BillCard[] | undefined;
  let georgiaLatest: string | null = null;
  let pennsylvaniaLatest: string | null = null;
  let failed = false;
  try {
    [georgiaBills, pennsylvaniaBills, georgiaLatest, pennsylvaniaLatest] = await Promise.all([
      getKeyBills("ga", 4),
      getRecentBills("pa", 4),
      getLatestActionDate("ga"),
      getLatestActionDate("pa"),
    ]);
  } catch (error) {
    await logError(error, "/");
    failed = true;
  }
  if (failed || !georgiaBills || !pennsylvaniaBills) {
    return (
      <div className="space-y-6">
        <HomeIntro />
        <StateList />
        <StatusBanner>The bill list could not be loaded. The database may be unreachable. Try again shortly.</StatusBanner>
        <SignupForm />
      </div>
    );
  }

  const georgiaThisWeek = isRecentAction(georgiaLatest);
  return (
    <div className="space-y-8">
      <HomeIntro />
      <StateList />
      <section aria-labelledby="georgia-bills">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 id="georgia-bills" className="font-serif text-2xl text-navy">
            {georgiaThisWeek ? "This week at the Gold Dome" : "Key Georgia bills"}
          </h2>
          <Link href="/georgia/bills" className="text-sm font-semibold text-crimson">
            All Georgia bills
          </Link>
        </div>
        <p className="mb-3 text-sm text-muted">
          {georgiaLatest
            ? georgiaThisWeek
              ? `Latest recorded action: ${formatDate(georgiaLatest)}.`
              : `Latest recorded action in this file: ${formatDate(georgiaLatest)}. ${stateBySlug("georgia")?.sessionNote ?? ""}`
            : "Georgia bills are not loaded yet."}
        </p>
        {georgiaBills.length === 0 ? (
          <StatusBanner>No Georgia bills are loaded yet.</StatusBanner>
        ) : (
          <div className="grid gap-3">
            {georgiaBills.map((bill) => (
              <BillCardView key={bill.id} bill={bill} stateSlug="georgia" />
            ))}
          </div>
        )}
      </section>
      <section aria-labelledby="pennsylvania-bills">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 id="pennsylvania-bills" className="font-serif text-2xl text-navy">
            Recent Pennsylvania activity
          </h2>
          <Link href="/pennsylvania/bills" className="text-sm font-semibold text-crimson">
            All Pennsylvania bills
          </Link>
        </div>
        <p className="mb-3 text-sm text-muted">
          {pennsylvaniaLatest
            ? `Latest recorded action: ${formatDate(pennsylvaniaLatest)}. ${stateBySlug("pennsylvania")?.sessionNote ?? ""}`
            : stateBySlug("pennsylvania")?.sessionNote}
        </p>
        {pennsylvaniaBills.length === 0 ? (
          <StatusBanner>No Pennsylvania bills are loaded yet. The importer has not been seeded into this database.</StatusBanner>
        ) : (
          <div className="grid gap-3">
            {pennsylvaniaBills.map((bill) => (
              <BillCardView key={bill.id} bill={bill} stateSlug="pennsylvania" />
            ))}
          </div>
        )}
      </section>
      <section aria-labelledby="topics">
        <h2 id="topics" className="font-serif text-2xl text-navy">
          Topics
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <li key={topic.slug} className="rounded-lg border border-line bg-paper p-4">
              <span className="font-semibold text-navy">{topic.name}</span>
              <span className="mt-1 block text-sm text-muted">{topic.description}</span>
              <span className="mt-2 block text-sm font-semibold">
                <Link className="text-crimson hover:underline" href={`/georgia/topics/${topic.slug}`}>
                  Georgia
                </Link>
                {" · "}
                <Link className="text-crimson hover:underline" href={`/pennsylvania/topics/${topic.slug}`}>
                  Pennsylvania
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <SignupForm />
    </div>
  );
}

function HomeIntro() {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson">American Capitol Watch</p>
      <h1 className="font-serif text-4xl leading-tight text-navy sm:text-5xl">State legislatures, in plain English.</h1>
      <p className="max-w-2xl text-lg text-ink">
        What moved, who sponsored it, and where it stands. Built for voters who want the bill, not a press release. Georgia and
        Pennsylvania are the sections live now.
      </p>
    </section>
  );
}

function StateList() {
  return (
    <section aria-labelledby="states">
      <h2 id="states" className="font-serif text-2xl text-navy">
        States
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        <li>
          <Link href="/georgia/bills" className="block rounded-lg border border-line bg-paper p-4 hover:border-navy">
            <span className="font-semibold text-navy">Georgia</span>
            <span className="mt-1 block text-sm text-muted">
              The Gold Dome. Bills, legislators, and scorecard links for the General Assembly.
            </span>
          </Link>
        </li>
        <li>
          <Link href="/pennsylvania/bills" className="block rounded-lg border border-line bg-paper p-4 hover:border-navy">
            <span className="font-semibold text-navy">Pennsylvania</span>
            <span className="mt-1 block text-sm text-muted">
              A full-time legislature. Recent activity, the roster, and ZIP or address lookup.
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
