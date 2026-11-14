import { timingSafeEqual } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  pageviews,
  signups,
  sponsorClicks,
  sponsorWeeks,
  submissions,
  zeroResultSearches,
} from "@/db/schema";

export function adminGuard(request: Request): NextResponse | null {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "Admin API is not configured." },
      { status: 503 },
    );
  }
  const header = request.headers.get("authorization") ?? "";
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const presented = header.slice(prefix.length);
  const left = Buffer.from(presented);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function pendingSubmissions() {
  const db = getDb();
  if (!db) return [];
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "pending"))
    .orderBy(desc(submissions.createdAt))
    .limit(200);
}

export async function reviewSubmission(
  id: number,
  decision: "approve" | "reject",
  note: string | null,
) {
  const db = getDb();
  if (!db) return null;
  const status = decision === "approve" ? "approved" : "rejected";
  const [row] = await db
    .update(submissions)
    .set({ status, reviewNote: note, reviewedAt: new Date() })
    .where(and(eq(submissions.id, id), eq(submissions.status, "pending")))
    .returning();
  return row ?? null;
}

export async function adminStats() {
  const db = getDb();
  if (!db) {
    return {
      configured: false,
      signups: { total: 0, last30Days: 0 },
      pageviews: { total: 0, thisMonth: 0 },
      sponsorClicks: { total: 0, bySponsor: [] as { slug: string; name: string; clicks: number }[] },
      topPages: [] as { path: string; views: number }[],
    };
  }
  const [signupTotal] = await db.select({ value: sql<number>`count(*)::int` }).from(signups);
  const [signupRecent] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(signups)
    .where(sql`${signups.createdAt} >= now() - interval '30 days'`);
  const [viewsTotal] = await db
    .select({ value: sql<number>`coalesce(sum(${pageviews.count}), 0)::int` })
    .from(pageviews);
  const [viewsMonth] = await db
    .select({ value: sql<number>`coalesce(sum(${pageviews.count}), 0)::int` })
    .from(pageviews)
    .where(sql`${pageviews.day} >= date_trunc('month', current_date)::date`);
  const [clickTotal] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(sponsorClicks);
  const bySponsor = await db
    .select({
      slug: sponsorWeeks.slug,
      name: sponsorWeeks.name,
      clicks: sql<number>`count(${sponsorClicks.id})::int`,
    })
    .from(sponsorWeeks)
    .leftJoin(sponsorClicks, eq(sponsorClicks.sponsorId, sponsorWeeks.id))
    .groupBy(sponsorWeeks.id)
    .orderBy(desc(sql`count(${sponsorClicks.id})`));
  const topPages = await db
    .select({
      path: pageviews.path,
      views: sql<number>`sum(${pageviews.count})::int`,
    })
    .from(pageviews)
    .groupBy(pageviews.path)
    .orderBy(desc(sql`sum(${pageviews.count})`))
    .limit(15);
  return {
    configured: true,
    signups: { total: signupTotal?.value ?? 0, last30Days: signupRecent?.value ?? 0 },
    pageviews: { total: viewsTotal?.value ?? 0, thisMonth: viewsMonth?.value ?? 0 },
    sponsorClicks: { total: clickTotal?.value ?? 0, bySponsor },
    topPages,
  };
}

export async function recentSearches() {
  const db = getDb();
  if (!db) return [];
  return db
    .select()
    .from(zeroResultSearches)
    .orderBy(desc(zeroResultSearches.createdAt))
    .limit(100);
}

export async function listSponsors() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(sponsorWeeks).orderBy(desc(sponsorWeeks.startsOn));
}
