import { STATES, type StateSlug } from "@/lib/states";

/** Slugs a subscriber actually follows. An empty choice is Georgia, so older rows keep working. */
export function audienceStates(stored: string[] | null | undefined): StateSlug[] {
  const valid = (stored ?? []).filter((slug): slug is StateSlug =>
    STATES.some((state) => state.slug === slug),
  );
  return valid.length > 0 ? valid : ["georgia"];
}

/** The dropdown sends one slug. The column is an array so more than one can be stored later. */
export function parseStateChoice(value: unknown): { ok: true; states: StateSlug[] } | { ok: false; reason: string } {
  const slug = typeof value === "string" ? value.trim() : "";
  const state = STATES.find((item) => item.slug === slug);
  if (!state) return { ok: false, reason: "Choose a state." };
  return { ok: true, states: [state.slug] };
}
