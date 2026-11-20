import type { Metadata } from "next";
import { HotTopicsPage } from "@/components/hot-topics";
import { liveStates } from "@/lib/launch";
import { stateListLabel } from "@/lib/states";

export function generateMetadata(): Metadata {
  return {
    title: "Hot Topics",
    description: `Weekly topics drawn from public posts on X for ${stateListLabel(liveStates())}.`,
  };
}

export default function Page() {
  return <HotTopicsPage />;
}
