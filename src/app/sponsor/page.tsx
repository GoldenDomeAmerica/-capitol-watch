import type { Metadata } from "next";
import { SponsorForm } from "@/components/forms";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { logError } from "@/lib/errors";
import { publicStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Sponsor a week",
  description: "Sponsor American Capitol Watch. A week starts at $50 for an email slot and the site bar. Political sponsors must include a Paid for by line.",
};

export default async function SponsorPage() {
  let stats = { signups: 0, pageviewsThisMonth: 0 };
  let failed = false;
  if (databaseConfigured()) {
    try {
      stats = await publicStats();
    } catch (error) {
      await logError(error, "/sponsor");
      failed = true;
    }
  }
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Sponsor a week</h1>
        <p className="text-sm leading-relaxed">
          One week is an email slot in the American Capitol Watch newsletter plus the small bar at the top of the site. The offer starts at <strong>$50 a week</strong>.
        </p>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line bg-paper p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Subscribers</dt>
            <dd className="font-serif text-3xl text-navy">{databaseConfigured() && !failed ? stats.signups.toLocaleString("en-US") : "—"}</dd>
          </div>
          <div className="rounded-lg border border-line bg-paper p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Pageviews this month</dt>
            <dd className="font-serif text-3xl text-navy">
              {databaseConfigured() && !failed ? stats.pageviewsThisMonth.toLocaleString("en-US") : "—"}
            </dd>
          </div>
        </dl>
        {!databaseConfigured() ? <StatusBanner>Stats appear after the database is connected.</StatusBanner> : null}
        {failed ? <StatusBanner>Stats could not be read just now.</StatusBanner> : null}
        <p className="text-sm leading-relaxed">
          Political sponsors must include a “Paid for by” line. That line is stored with the sponsorship and shown in the site bar and in the email. We do not invent a disclaimer for you.
        </p>
        <p className="text-sm text-muted">Clicks on the bar go through /go/your-name so they can be counted.</p>
      </div>
      <div className="rounded-lg border border-line bg-paper p-4">
        <h2 className="font-serif text-2xl text-navy">Get in touch</h2>
        <div className="mt-3">
          <SponsorForm />
        </div>
      </div>
    </div>
  );
}
