import { BillsIndexPage, billsIndexMetadata } from "@/components/state-pages";

export const metadata = billsIndexMetadata("pennsylvania");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string }>;
}) {
  const params = await searchParams;
  return <BillsIndexPage stateSlug="pennsylvania" q={params.q?.trim() || ""} topic={params.topic?.trim() || ""} />;
}
