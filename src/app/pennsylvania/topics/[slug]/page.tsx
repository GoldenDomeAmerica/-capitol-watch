import { TopicPage, topicMetadata, topicParams } from "@/components/state-pages";

export function generateStaticParams() {
  return topicParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return topicMetadata(slug);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const q = (await searchParams).q?.trim() || "";
  return <TopicPage stateSlug="pennsylvania" slug={slug} q={q} />;
}
