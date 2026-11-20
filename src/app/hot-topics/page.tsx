import type { Metadata } from "next";
import { HotTopicsPage } from "@/components/hot-topics";
import { stateListLabel } from "@/lib/states";

export const metadata: Metadata = {
  title: "Hot Topics",
  description: `Weekly topics drawn from public posts on X for ${stateListLabel()}.`,
};

export default function Page() {
  return <HotTopicsPage />;
}
