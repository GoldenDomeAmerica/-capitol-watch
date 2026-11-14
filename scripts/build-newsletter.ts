import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { render } from "react-email";
import { Resend } from "resend";
import WeeklyGoldDome from "../emails/weekly-gold-dome";
import { isPlaceholderFrom, isUnset } from "../src/lib/email-address";
import { getEmailSponsor, newsletterBills } from "../src/lib/queries";
import { formatDate, siteUrl } from "../src/lib/site";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  const bills = await newsletterBills(5);
  const sponsor = await getEmailSponsor().catch(() => null);
  const origin = siteUrl();
  const issueDate = formatDate(new Date().toISOString());
  const element = WeeklyGoldDome({
    issueDate,
    siteUrl: `${origin}/georgia/bills`,
    sponsorName: sponsor?.name ?? null,
    paidForBy: sponsor?.paidForBy ?? null,
    postalAddress: process.env.NEWSLETTER_POSTAL_ADDRESS || null,
    bills: bills.map((bill) => ({
      identifier: bill.identifier,
      title: bill.title,
      summary: firstSentence(bill.summary),
      url: `${origin}/georgia/bills/${bill.slug}`,
    })),
  });
  const html = await render(element);
  const outDir = path.join(process.cwd(), "newsletter-out");
  await mkdir(outDir, { recursive: true });
  const file = path.join(outDir, "this-week-at-the-gold-dome.html");
  await writeFile(file, html);
  console.log(`Wrote ${file} with ${bills.length} bills.`);

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.NEWSLETTER_FROM;
  if (isUnset(apiKey) || isUnset(segmentId) || isPlaceholderFrom(from)) {
    console.log(
      "Skipped Resend broadcast. Set RESEND_API_KEY, RESEND_AUDIENCE_ID (a segment id), and a real NEWSLETTER_FROM after the domain is verified. The HTML file is the draft.",
    );
    shutdown(0);
  }
  if (bills.length === 0) {
    console.log("Skipped broadcast because the database has no bills to include.");
    shutdown(0);
  }
  const resend = new Resend(apiKey);
  const created = await resend.broadcasts.create({
    name: `This week at the Gold Dome ${issueDate}`,
    from: from!,
    subject: `This week at the Gold Dome — ${issueDate}`,
    html,
    segmentId: segmentId!,
  });
  if (created.error) {
    console.error(`Resend did not create a draft: ${created.error.message}`);
    shutdown(1);
  }
  console.log(`Created draft broadcast ${created.data?.id}. It was not sent.`);
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
