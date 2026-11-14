import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BillCardView, BillSearch } from "@/components/bills";
import { StatusBanner } from "@/components/chrome";
import { databaseConfigured } from "@/db";
import { logError } from "@/lib/errors";
import { searchBills } from "@/lib/queries";
import { TOPICS, topicBySlug } from "@/lib/topics";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) return { title: "Topic" };
  return { title: `${topic.name} bills`, description: topic.description };
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();
  const q = (await searchParams).q?.trim() || "";
  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">{topic.name}</h1>
        <p className="text-sm text-muted">{topic.description}</p>
        <StatusBanner>Connect the database to load this topic.</StatusBanner>
      </div>
    );
  }
  let bills;
  let failed = false;
  try {
    bills = await searchBills({ q, topic: topic.slug });
  } catch (error) {
    await logError(error, `/georgia/topics/${slug}`);
    failed = true;
  }
  if (failed || !bills) return <StatusBanner>This topic could not be loaded.</StatusBanner>;
  return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">{topic.name}</h1>
        <p className="max-w-2xl text-sm text-muted">{topic.description}</p>
        <BillSearch q={q} topic={topic.slug} />
        {bills.length === 0 ? (
          <StatusBanner>{q ? `No ${topic.name.toLowerCase()} bills matched “${q}”.` : "No bills are tagged with this topic yet."}</StatusBanner>
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
