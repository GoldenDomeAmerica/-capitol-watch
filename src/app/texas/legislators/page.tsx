import { LegislatorsPage, legislatorsMetadata } from "@/components/state-pages";

export const metadata = legislatorsMetadata("texas");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; district?: string; chamber?: string; county?: string; zip?: string; address?: string }>;
}) {
  const params = await searchParams;
  return <LegislatorsPage stateSlug="texas" params={params} />;
}
