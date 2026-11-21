import { LegislatorDetailPage, legislatorMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return legislatorMetadata("idaho", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegislatorDetailPage stateSlug="idaho" slug={slug} />;
}
