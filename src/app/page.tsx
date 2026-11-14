import Link from "next/link";
import { BillCardView } from "@/components/bills";
import { SignupForm } from "@/components/signup-form";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { getKeyBills, getLatestActionDate } from "@/lib/queries";
import { logError } from "@/lib/errors";
import { TOPICS } from "@/lib/topics";
import { formatDate, isRecentAction } from "@/lib/site";

export default async function HomePage() {
  if (!databaseConfigured()) {
    return (
      <div className="space-y-6">
        <HomeIntro latest={null} />
        <StatusBanner>
          The database is not connected yet. Set DATABASE_URL, run the migration, and seed Georgia. The rest of the site stays up.
        </StatusBanner>
        <SignupForm />
      </div>
    );
  }

  let bills;
  let latest: string | null = null;
  let failed = false;
  try {
    [bills, latest] = await Promise.all([getKeyBills(6), getLatestActionDate()]);
  } catch (error) {
    await logError(error, "/");
    failed = true;
  }
  if (failed || !bills) {
    return (
      <div className="space-y-6">
        <HomeIntro latest={null} />
        <StatusBanner>The bill list could not be loaded. The database may be unreachable. Try again shortly.</StatusBanner>
        <SignupForm />
      </div>
    );
  }
  const thisWeek = isRecentAction(latest);
  return (
      <div className="space-y-8">
        <HomeIntro latest={latest} thisWeek={thisWeek} />
        <section aria-labelledby="key-bills">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 id="key-bills" className="font-serif text-2xl text-navy">
              {thisWeek ? "This week at the Gold Dome" : "Key Georgia bills"}
            </h2>
            <Link href="/georgia/bills" className="text-sm font-semibold text-crimson">
              All bills
            </Link>
          </div>
          {bills.length === 0 ? (
            <StatusBanner>No bills are loaded yet. Run the Georgia importer against the database.</StatusBanner>
          ) : (
            <div className="grid gap-3">
              {bills.map((bill) => (
                <BillCardView key={bill.id} bill={bill} />
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
              <li key={topic.slug}>
                <Link href={`/georgia/topics/${topic.slug}`} className="block rounded-lg border border-line bg-paper p-4 hover:border-navy">
                  <span className="font-semibold text-navy">{topic.name}</span>
                  <span className="mt-1 block text-sm text-muted">{topic.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <SignupForm />
      </div>
    );
}

function HomeIntro({ latest, thisWeek = false }: { latest: string | null; thisWeek?: boolean }) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson">American Capitol Watch</p>
      <h1 className="font-serif text-4xl leading-tight text-navy sm:text-5xl">Georgia bills, in plain English.</h1>
      <p className="max-w-2xl text-lg text-ink">
        What moved at the Gold Dome, who sponsored it, and where it stands. Built for voters who want the bill, not a press release.
      </p>
      <p className="text-sm text-muted">
        {latest
          ? thisWeek
            ? `Latest recorded action: ${formatDate(latest)}.`
            : `Latest recorded action in this file: ${formatDate(latest)}. The 2025–2026 regular session has adjourned. Georgia's next regular session opens on the second Monday in January (January 11, 2027).`
          : "Other states will be added later. Georgia is the first section."}
      </p>
      <div className="flex flex-wrap gap-3 pt-1">
        <Link href="/georgia/bills" className="inline-flex min-h-11 items-center rounded-md bg-navy px-4 font-semibold text-white">
          Browse bills
        </Link>
        <Link href="/georgia/legislators" className="inline-flex min-h-11 items-center rounded-md border border-navy px-4 font-semibold text-navy">
          Find your legislators
        </Link>
      </div>
    </section>
  );
}
