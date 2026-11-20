import { BillDetailPage, billMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return billMetadata("new-york", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BillDetailPage stateSlug="new-york" slug={slug} />;
}
