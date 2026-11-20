import { and, asc, desc, eq, notInArray } from "drizzle-orm";
import { getDb } from "@/db";
import { hotTopics } from "@/db/schema";
import { STATES } from "@/lib/states";
import { TOPICS } from "@/lib/topics";

export type HotTopicInput = {
  rank: number;
  title: string;
  summary: string;
  link: string | null;
  sourceNote: string | null;
};

export type HotTopicRecord = HotTopicInput & {
  id: number;
  state: string;
  weekStart: string;
  createdAt: string;
};

const STATE_SLUGS = new Set(STATES.map((state) => state.slug));
const TOPIC_SLUGS = new Set<string>(TOPICS.map((topic) => topic.slug));

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function topicOrBillPath(value: string): boolean {
  const match = value.match(/^\/([a-z]+)\/(topics|bills)\/([a-z0-9-]{1,80})$/);
  if (!match) return false;
  const [, state, kind, slug] = match;
  if (!STATE_SLUGS.has(state as (typeof STATES)[number]["slug"])) return false;
  if (kind === "topics") return TOPIC_SLUGS.has(slug);
  return true;
}

export function parseHotTopicReplace(payload: unknown): { ok: true; state: string; weekStart: string; topics: HotTopicInput[] } | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Send a JSON object." };
  const body = payload as { state?: unknown; weekStart?: unknown; topics?: unknown };
  const state = typeof body.state === "string" ? body.state.trim().toLowerCase() : "";
  if (!STATE_SLUGS.has(state as (typeof STATES)[number]["slug"])) {
    return { ok: false, error: "state must be a live state slug." };
  }
  const weekStart = typeof body.weekStart === "string" ? body.weekStart.trim() : "";
  if (!isIsoDate(weekStart)) return { ok: false, error: "weekStart must be a real YYYY-MM-DD date." };
  if (!Array.isArray(body.topics) || body.topics.length < 1 || body.topics.length > 2) {
    return { ok: false, error: "topics must be one or two items." };
  }
  const topics: HotTopicInput[] = [];
  const ranks = new Set<number>();
  for (const item of body.topics) {
    if (!item || typeof item !== "object") return { ok: false, error: "Each topic must be an object." };
    const row = item as { rank?: unknown; title?: unknown; summary?: unknown; link?: unknown; sourceNote?: unknown };
    if (typeof row.rank !== "number" || !Number.isInteger(row.rank) || (row.rank !== 1 && row.rank !== 2)) {
      return { ok: false, error: "Each rank must be 1 or 2." };
    }
    if (ranks.has(row.rank)) return { ok: false, error: "Ranks must be unique." };
    ranks.add(row.rank);
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const summary = typeof row.summary === "string" ? row.summary.trim() : "";
    if (title.length < 2 || title.length > 140) return { ok: false, error: "Each title must be 2–140 characters." };
    if (summary.length < 2 || summary.length > 400) return { ok: false, error: "Each summary must be 2–400 characters." };
    let link: string | null = null;
    if (row.link != null && row.link !== "") {
      if (typeof row.link !== "string") return { ok: false, error: "link must be a site path." };
      link = row.link.trim();
      if (!topicOrBillPath(link)) {
        return { ok: false, error: "link must be a topic or bill path on this site, such as /georgia/topics/taxes." };
      }
    }
    let sourceNote: string | null = null;
    if (row.sourceNote != null && row.sourceNote !== "") {
      if (typeof row.sourceNote !== "string") return { ok: false, error: "sourceNote must be text." };
      sourceNote = row.sourceNote.trim();
      if (sourceNote.length > 240) return { ok: false, error: "sourceNote must be 240 characters or fewer." };
    }
    topics.push({ rank: row.rank, title, summary, link, sourceNote });
  }
  topics.sort((a, b) => a.rank - b.rank);
  return { ok: true, state, weekStart, topics };
}

function toRecord(row: typeof hotTopics.$inferSelect): HotTopicRecord {
  return {
    id: row.id,
    state: row.stateSlug,
    weekStart: row.weekStart,
    rank: row.rank,
    title: row.title,
    summary: row.summary,
    link: row.link,
    sourceNote: row.sourceNote,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listHotTopics(filter: { state?: string; weekStart?: string }): Promise<HotTopicRecord[] | null> {
  const db = getDb();
  if (!db) return null;
  const conditions = [];
  if (filter.state) conditions.push(eq(hotTopics.stateSlug, filter.state));
  if (filter.weekStart) conditions.push(eq(hotTopics.weekStart, filter.weekStart));
  const selected = db.select().from(hotTopics);
  const filtered = conditions.length ? selected.where(and(...conditions)) : selected;
  const rows = await filtered.orderBy(desc(hotTopics.weekStart), asc(hotTopics.stateSlug), asc(hotTopics.rank)).limit(200);
  return rows.map(toRecord);
}

export async function replaceHotTopics(state: string, weekStart: string, topics: HotTopicInput[]): Promise<HotTopicRecord[] | null> {
  const db = getDb();
  if (!db) return null;
  const ranks = topics.map((topic) => topic.rank);
  for (const topic of topics) {
    await db
      .insert(hotTopics)
      .values({
        stateSlug: state,
        weekStart,
        rank: topic.rank,
        title: topic.title,
        summary: topic.summary,
        link: topic.link,
        sourceNote: topic.sourceNote,
      })
      .onConflictDoUpdate({
        target: [hotTopics.stateSlug, hotTopics.weekStart, hotTopics.rank],
        set: {
          title: topic.title,
          summary: topic.summary,
          link: topic.link,
          sourceNote: topic.sourceNote,
          createdAt: new Date(),
        },
      });
  }
  await db
    .delete(hotTopics)
    .where(and(eq(hotTopics.stateSlug, state), eq(hotTopics.weekStart, weekStart), notInArray(hotTopics.rank, ranks)));
  return listHotTopics({ state, weekStart });
}

export async function latestHotTopicsByState(): Promise<Map<string, { weekStart: string; topics: HotTopicRecord[] }>> {
  const rows = await listHotTopics({});
  const map = new Map<string, { weekStart: string; topics: HotTopicRecord[] }>();
  if (!rows) return map;
  for (const row of rows) {
    const current = map.get(row.state);
    if (current && current.weekStart !== row.weekStart) continue;
    const bucket = current ?? { weekStart: row.weekStart, topics: [] };
    bucket.topics.push(row);
    map.set(row.state, bucket);
  }
  for (const bucket of map.values()) bucket.topics.sort((a, b) => a.rank - b.rank);
  return map;
}
