import { STATES, type StateSection, type StateSlug } from "@/lib/states";

/**
 * Request-time clock for launch gating.
 * ACW_NOW is a local override (ISO timestamp) so a developer can render a
 * state before its public launch. It is ignored when NODE_ENV is production,
 * which is how `next build` and Vercel run.
 */
export function clock(): Date {
  if (process.env.NODE_ENV !== "production") {
    const raw = process.env.ACW_NOW?.trim();
    if (raw) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  return new Date();
}

export function isStateLive(state: Pick<StateSection, "launchesAt">, now = clock()): boolean {
  if (!state.launchesAt) return true;
  const at = Date.parse(state.launchesAt);
  if (!Number.isFinite(at)) return false;
  return now.getTime() >= at;
}

export function liveStates(now = clock()): StateSection[] {
  return STATES.filter((state) => isStateLive(state, now));
}

export function liveStateBySlug(slug: string, now = clock()): StateSection | null {
  const state = STATES.find((item) => item.slug === slug) ?? null;
  if (!state || !isStateLive(state, now)) return null;
  return state;
}

/** True when the path is a configured state section that has not launched. */
export function blockedPublicPath(pathname: string, now = clock()): boolean {
  const slug = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean)[0]?.toLowerCase();
  if (!slug) return false;
  const state = STATES.find((item) => item.slug === slug);
  if (!state) return false;
  return !isStateLive(state, now);
}

export function isLiveSlug(slug: string, now = clock()): slug is StateSlug {
  return liveStates(now).some((state) => state.slug === slug);
}
