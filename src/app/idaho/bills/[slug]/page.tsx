import { BillDetailPage, billMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return billMetadata("idaho", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BillDetailPage stateSlug="idaho" slug={slug} />;
}
