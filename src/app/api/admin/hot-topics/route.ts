import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin";
import { logError } from "@/lib/errors";
import { isIsoDate, listHotTopics, parseHotTopicReplace, replaceHotTopics } from "@/lib/hot-topics";
import { isLiveSlug } from "@/lib/launch";
import { getDb } from "@/db";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  const url = new URL(request.url);
  const state = url.searchParams.get("state")?.trim().toLowerCase() || "";
  const weekStart = url.searchParams.get("weekStart")?.trim() || "";
  if (state && !isLiveSlug(state)) {
    return NextResponse.json({ error: "state must be a live state slug." }, { status: 400 });
  }
  if (weekStart && !isIsoDate(weekStart)) {
    return NextResponse.json({ error: "weekStart must be a real YYYY-MM-DD date." }, { status: 400 });
  }
  if (!getDb()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const topics = await listHotTopics({ state: state || undefined, weekStart: weekStart || undefined });
    return NextResponse.json({ topics: topics ?? [] });
  } catch (error) {
    await logError(error, "/api/admin/hot-topics");
    return NextResponse.json({ error: "Could not list hot topics." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = parseHotTopicReplace(payload);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (!getDb()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const topics = await replaceHotTopics(parsed.state, parsed.weekStart, parsed.topics);
    return NextResponse.json({ state: parsed.state, weekStart: parsed.weekStart, topics: topics ?? [] });
  } catch (error) {
    await logError(error, "/api/admin/hot-topics");
    return NextResponse.json({ error: "Could not save hot topics." }, { status: 500 });
  }
}
