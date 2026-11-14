import type { Metadata } from "next";
import { BillCardView, BillSearch } from "@/components/bills";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { logError } from "@/lib/errors";
import { searchBills } from "@/lib/queries";
import { topicBySlug } from "@/lib/topics";

export const metadata: Metadata = {
  title: "Georgia bills",
  description: "Search Georgia General Assembly bills with plain-English summaries, sponsors, and official links.",
};

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const topic = params.topic?.trim() || "";
  const topicInfo = topic ? topicBySlug(topic) : null;
  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Georgia bills</h1>
        <BillSearch q={q} />
        <StatusBanner>Connect the database to search bills.</StatusBanner>
      </div>
    );
  }
  let bills;
  let failed = false;
  try {
    bills = await searchBills({ q, topic: topicInfo?.slug });
  } catch (error) {
    await logError(error, "/georgia/bills");
    failed = true;
  }
  if (failed || !bills) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Georgia bills</h1>
        <StatusBanner>Search is unavailable until the database responds.</StatusBanner>
      </div>
    );
  }
  return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">{topicInfo ? topicInfo.name : "Georgia bills"}</h1>
        <p className="text-sm text-muted">
          {topicInfo ? topicInfo.description : "Search by bill number, title, or a word from the summary."}
        </p>
        <BillSearch q={q} topic={topicInfo?.slug} />
        {bills.length === 0 ? (
          <StatusBanner>
            {q ? `No bills matched “${q}”.` : "No bills are loaded for this view."}
          </StatusBanner>
        ) : (
          <div className="grid gap-3">
            {bills.map((bill) => (
              <BillCardView key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    );
}
