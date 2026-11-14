import { BillDetailPage, billMetadata } from "@/components/state-pages";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return billMetadata("georgia", id);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BillDetailPage stateSlug="georgia" slug={id} />;
}
