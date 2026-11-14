import { LegislatorDetailPage, legislatorMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return legislatorMetadata("georgia", id);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LegislatorDetailPage stateSlug="georgia" slug={id} />;
}
