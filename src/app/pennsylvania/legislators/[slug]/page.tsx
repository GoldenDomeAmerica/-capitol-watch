import { LegislatorDetailPage, legislatorMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return legislatorMetadata("pennsylvania", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegislatorDetailPage stateSlug="pennsylvania" slug={slug} />;
}