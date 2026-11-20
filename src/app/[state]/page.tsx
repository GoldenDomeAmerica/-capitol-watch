import { StateLandingPage, stateLandingMetadata } from "@/components/state-pages";
import { STATES } from "@/lib/states";

export function generateStaticParams() {
  return STATES.map((state) => ({ state: state.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  return stateLandingMetadata(state);
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  return <StateLandingPage slug={state} />;
}
