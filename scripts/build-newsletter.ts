import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { render } from "react-email";
import { Resend } from "resend";
import WeeklyIssue, { type WeeklyStateSection } from "../emails/weekly-issue";
import { getDb } from "../src/db";
import { signups } from "../src/db/schema";
import { isPlaceholderFrom, isUnset } from "../src/lib/email-address";
import { getEmailSponsor, getKeyBills, getRecentBills } from "../src/lib/queries";
import { ensureAudienceSetup, syncSignupStates, topicName } from "../src/lib/resend-audience";
import { formatDate, siteUrl } from "../src/lib/site";
import { STATES } from "../src/lib/states";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  const sponsor = await getEmailSponsor().catch(() => null);
  const origin = siteUrl();
  const issueDate = formatDate(new Date().toISOString());
  const sections: WeeklyStateSection[] = [];
  for (const state of STATES) {
    const bills = state.fullTime ? await getRecentBills(state.id, 5) : await getKeyBills(state.id, 5);
    sections.push({
      slug: state.slug,
      name: state.name,
      note: state.fullTime
        ? "Recent activity. This legislature meets full time."
        : "The latest tracked bills in this state.",
      bills: bills.map((bill) => ({
        identifier: bill.identifier,
        title: bill.title,
        summary: firstSentence(bill.summary),
        url: `${origin}/${state.slug}/bills/${bill.slug}`,
      })),
    });
  }

  const outDir = path.join(process.cwd(), "newsletter-out");
  await mkdir(outDir, { recursive: true });
  for (const section of sections) {
    const html = await render(
      WeeklyIssue({
        issueDate,
        sections: [section],
        siteUrl: `${origin}/${section.slug}/bills`,
        sponsorName: sponsor?.name ?? null,
        paidForBy: sponsor?.paidForBy ?? null,
        postalAddress: process.env.NEWSLETTER_POSTAL_ADDRESS || null,
      }),
    );
    const file = path.join(outDir, `american-capitol-watch-${section.slug}.html`);
    await writeFile(file, html);
    console.log(`Wrote ${file} with ${section.bills.length} bills.`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.NEWSLETTER_FROM;
  if (isUnset(apiKey) || isUnset(segmentId) || isPlaceholderFrom(from)) {
    console.log(
      "Skipped Resend drafts. Set RESEND_API_KEY, RESEND_AUDIENCE_ID (the American Capitol Watch segment), and a real NEWSLETTER_FROM after the domain is verified. The HTML files are the drafts.",
    );
    shutdown(0);
  }

  const resend = new Resend(apiKey);
  const setup = await ensureAudienceSetup(resend);
  if (!setup.ok) {
    console.error(`Could not prepare Resend state topics: ${setup.reason}`);
    shutdown(1);
  }
  const db = getDb();
  if (db) {
    const rows = await db
      .select({ email: signups.email, states: signups.states })
      .from(signups);
    const synced = await syncSignupStates(resend, segmentId!, setup.topics, rows);
    console.log(`Tagged ${synced.updated} subscribers in Resend. ${synced.failed} could not be tagged. No email was sent.`);
  }

  for (const section of sections) {
    const html = await render(
      WeeklyIssue({
        issueDate,
        sections: [section],
        siteUrl: `${origin}/${section.slug}/bills`,
        sponsorName: sponsor?.name ?? null,
        paidForBy: sponsor?.paidForBy ?? null,
        postalAddress: process.env.NEWSLETTER_POSTAL_ADDRESS || null,
      }),
    );
    const created = await resend.broadcasts.create({
      name: `American Capitol Watch ${issueDate} ${section.name}`,
      from: from!,
      subject: `American Capitol Watch — ${section.name} — ${issueDate}`,
      html,
      segmentId: segmentId!,
      topicId: setup.topics[section.slug as keyof typeof setup.topics],
    });
    if (created.error) {
      console.error(`Resend did not create the ${section.name} draft: ${created.error.message}`);
      shutdown(1);
    }
    console.log(`Created draft broadcast ${created.data?.id} for ${topicName(section.name)}. It was not sent.`);
  }
  shutdown(0);
}

function shutdown(code: number): never {
  process.exit(code);
}

function firstSentence(summary: string): string {
  const match = summary.match(/^.{20,220}?[.]/);
  return (match ? match[0] : summary).slice(0, 240);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
