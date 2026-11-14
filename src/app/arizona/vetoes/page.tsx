import { VetoesPage, vetoesMetadata } from "@/components/state-pages";

export const metadata = vetoesMetadata("arizona");

export default function Page() {
  return <VetoesPage stateSlug="arizona" />;
}
