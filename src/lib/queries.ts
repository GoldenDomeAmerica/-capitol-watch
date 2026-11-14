import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  billSponsors,
  billTopics,
  bills,
  legislators,
  pageviews,
  signups,
  sponsorClicks,
  sponsorWeeks,
  topics,
  votes,
  zeroResultSearches,
  type BillAction,
  type GovernorAction,
  type PassageVote,
} from "@/db/schema";
import { logError } from "@/lib/errors";
import { todayIso } from "@/lib/site";

export type BillCard = {
  id: string;
  slug: string;
  identifier: string;
  title: string;
  summary: string;
  status: string | null;
  lastAction: string | null;
  lastActionDate: string | null;
  chamber: string;
  sessionName: string;
  featured: boolean;
  topics: { slug: string; name: string }[];
};

function topicRows(
  rows: { slug: string; name: string; billId: string }[],
): Map<string, { slug: string; name: string }[]> {
  const map = new Map<string, { slug: string; name: string }[]>();
  for (const row of rows) {
    const list = map.get(row.billId) ?? [];
    list.push({ slug: row.slug, name: row.name });
    map.set(row.billId, list);
  }
  return map;
}

async function attachTopics(
  rows: Omit<BillCard, "topics">[],
): Promise<BillCard[]> {
  const db = getDb();
  if (!db || rows.length === 0) return rows.map((row) => ({ ...row, topics: [] }));
  const ids = rows.map((row) => row.id);
  const joined = await db
    .select({
      billId: billTopics.billId,
      slug: topics.slug,
      name: topics.name,
    })
    .from(billTopics)
    .innerJoin(topics, eq(topics.id, billTopics.topicId))
    .where(inArray(billTopics.billId, ids));
  const map = topicRows(joined);
  return rows.map((row) => ({ ...row, topics: map.get(row.id) ?? [] }));
}

const billColumns = {
  id: bills.id,
  slug: bills.slug,
  identifier: bills.identifier,
  title: bills.title,
  summary: bills.summary,
  status: bills.status,
  lastAction: bills.lastAction,
  lastActionDate: bills.lastActionDate,
  chamber: bills.chamber,
  sessionName: bills.sessionName,
  featured: bills.featured,
};

export async function getKeyBills(stateId: string, limit = 6): Promise<BillCard[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select(billColumns)
    .from(bills)
    .where(eq(bills.stateId, stateId))
    .orderBy(desc(bills.featured), desc(bills.lastActionDate), bills.identifier)
    .limit(limit);
  return attachTopics(rows);
}

export async function getRecentBills(stateId: string, limit = 6): Promise<BillCard[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select(billColumns)
    .from(bills)
    .where(eq(bills.stateId, stateId))
    .orderBy(desc(bills.lastActionDate), bills.identifier)
    .limit(limit);
  return attachTopics(rows);
}

export async function getLatestActionDate(stateId: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select({ value: sql<string | null>`max(${bills.lastActionDate})` })
    .from(bills)
    .where(eq(bills.stateId, stateId));
  return row?.value ?? null;
}

export async function searchBills(options: {
  stateId: string;
  q?: string;
  topic?: string;
}): Promise<BillCard[]> {
  const db = getDb();
  if (!db) return [];
  const filters = [eq(bills.stateId, options.stateId)];
  const q = options.q?.trim() ?? "";
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, "")}%`;
    const match = or(ilike(bills.identifier, pattern), ilike(bills.title, pattern), ilike(bills.summary, pattern));
    if (match) filters.push(match);
  }
  if (options.topic) {
    filters.push(eq(topics.slug, options.topic));
  }
  const query = db
    .select(billColumns)
    .from(bills)
    .leftJoin(billTopics, eq(billTopics.billId, bills.id))
    .leftJoin(topics, eq(topics.id, billTopics.topicId))
    .where(filters.length ? and(...filters) : undefined)
    .groupBy(bills.id)
    .orderBy(desc(bills.featured), desc(bills.lastActionDate), bills.identifier)
    .limit(80);
  const rows = await query;
  const cards = await attachTopics(rows);
  if (q.length >= 2 && cards.length === 0) {
    await db.insert(zeroResultSearches).values({
      query: q.slice(0, 200),
      scope: options.topic ? `${options.stateId}:bills:${options.topic}` : `${options.stateId}:bills`,
    });
  }
  return cards;
}

export type BillDetail = BillCard & {
  officialSummary: string | null;
  watchNote: string | null;
  sourceUrl: string;
  textUrl: string | null;
  governorAction: GovernorAction | null;
  passageVotes: PassageVote[] | null;
  actions: BillAction[] | null;
  memoUrl: string | null;
  sponsors: {
    name: string;
    isPrimary: boolean;
    slug: string | null;
    party: string | null;
    chamber: string | null;
    district: number | null;
  }[];
};

export async function getBill(stateId: string, slug: string): Promise<BillDetail | null> {
  const db = getDb();
  if (!db) return null;
  const [bill] = await db
    .select()
    .from(bills)
    .where(and(eq(bills.stateId, stateId), eq(bills.slug, slug)))
    .limit(1);
  if (!bill) return null;
  const [card] = await attachTopics([
    {
      id: bill.id,
      slug: bill.slug,
      identifier: bill.identifier,
      title: bill.title,
      summary: bill.summary,
      status: bill.status,
      lastAction: bill.lastAction,
      lastActionDate: bill.lastActionDate,
      chamber: bill.chamber,
      sessionName: bill.sessionName,
      featured: bill.featured,
    },
  ]);
  const sponsors = await db
    .select({
      name: billSponsors.name,
      isPrimary: billSponsors.isPrimary,
      slug: legislators.slug,
      party: legislators.party,
      chamber: legislators.chamber,
      district: legislators.district,
    })
    .from(billSponsors)
    .leftJoin(legislators, eq(legislators.id, billSponsors.legislatorId))
    .where(eq(billSponsors.billId, bill.id))
    .orderBy(billSponsors.sortOrder);
  return {
    ...card,
    officialSummary: bill.officialSummary,
    watchNote: bill.watchNote,
    sourceUrl: bill.sourceUrl,
    textUrl: bill.textUrl,
    governorAction: bill.governorAction,
    passageVotes: bill.passageVotes,
    actions: bill.actions,
    memoUrl: bill.memoUrl,
    sponsors,
  };
}

export async function listBillPaths(): Promise<{ stateId: string; slug: string; updatedAt: Date }[]> {
  const db = getDb();
  if (!db) return [];
  return db.select({ stateId: bills.stateId, slug: bills.slug, updatedAt: bills.updatedAt }).from(bills);
}

export type LegislatorCard = {
  id: string;
  slug: string;
  name: string;
  party: string | null;
  chamber: string;
  district: number;
  residence: string | null;
  counties: string[];
  isCurrent: boolean;
  status: string | null;
};

export async function searchLegislators(options: {
  stateId: string;
  q?: string;
  district?: number;
  chamber?: string;
  county?: string;
  districts?: { chamber: "house" | "senate"; district: number }[];
  includeFormer?: boolean;
}): Promise<LegislatorCard[]> {
  const db = getDb();
  if (!db) return [];
  const filters = [eq(legislators.stateId, options.stateId)];
  if (!options.includeFormer) filters.push(eq(legislators.isCurrent, true));
  if (options.chamber === "house" || options.chamber === "senate") {
    filters.push(eq(legislators.chamber, options.chamber));
  }
  if (options.district && Number.isFinite(options.district)) {
    filters.push(eq(legislators.district, options.district));
  }
  const q = options.q?.trim() ?? "";
  if (q) {
    const pattern = `%${q.replace(/[%_]/g, "")}%`;
    const match = or(ilike(legislators.name, pattern), ilike(legislators.residence, pattern));
    if (match) filters.push(match);
  }
  if (options.county?.trim()) {
    const county = options.county
      .trim()
      .replace(/[%_]/g, "")
      .replace(/\s+county$/i, "");
    filters.push(
      sql`EXISTS (SELECT 1 FROM unnest(${legislators.counties}) AS c WHERE c ILIKE ${county})`,
    );
  }
  if (options.districts && options.districts.length > 0) {
    const parts = options.districts.map(
      (item) =>
        sql`(${legislators.chamber} = ${item.chamber} AND ${legislators.district} = ${item.district})`,
    );
    filters.push(sql`(${sql.join(parts, sql` OR `)})`);
  }
  const rows = await db
    .select({
      id: legislators.id,
      slug: legislators.slug,
      name: legislators.name,
      party: legislators.party,
      chamber: legislators.chamber,
      district: legislators.district,
      residence: legislators.residence,
      counties: legislators.counties,
      isCurrent: legislators.isCurrent,
      status: legislators.status,
    })
    .from(legislators)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(legislators.chamber, legislators.district, legislators.name)
    .limit(80);
  if (q.length >= 2 && rows.length === 0 && !options.districts) {
    await db.insert(zeroResultSearches).values({
      query: q.slice(0, 200),
      scope: `${options.stateId}:legislators`,
    });
  }
  return rows;
}

export async function getLegislator(stateId: string, slug: string) {
  const db = getDb();
  if (!db) return null;
  const [person] = await db
    .select()
    .from(legislators)
    .where(and(eq(legislators.stateId, stateId), eq(legislators.slug, slug)))
    .limit(1);
  if (!person) return null;
  const sponsored = await db
    .select({
      slug: bills.slug,
      identifier: bills.identifier,
      title: bills.title,
      status: bills.status,
      isPrimary: billSponsors.isPrimary,
      sessionName: bills.sessionName,
    })
    .from(billSponsors)
    .innerJoin(bills, eq(bills.id, billSponsors.billId))
    .where(eq(billSponsors.legislatorId, person.id))
    .orderBy(desc(bills.lastActionDate));
  const recorded = await db
    .select({
      id: votes.id,
      position: votes.position,
      motion: votes.motion,
      result: votes.result,
      voteDate: votes.voteDate,
      billIdentifier: votes.billIdentifier,
      billSlug: bills.slug,
      billTitle: bills.title,
      yea: votes.yea,
      nay: votes.nay,
    })
    .from(votes)
    .leftJoin(bills, eq(bills.id, votes.billId))
    .where(eq(votes.legislatorId, person.id))
    .orderBy(desc(votes.voteDate))
    .limit(40);
  return { person, sponsored, recorded };
}

export async function listLegislatorPaths(): Promise<{ stateId: string; slug: string }[]> {
  const db = getDb();
  if (!db) return [];
  return db.select({ stateId: legislators.stateId, slug: legislators.slug }).from(legislators);
}

export async function recordPageview(path: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  const clean = path.slice(0, 240) || "/";
  const day = todayIso();
  try {
    await db
      .insert(pageviews)
      .values({ path: clean, day, count: 1 })
      .onConflictDoUpdate({
        target: [pageviews.path, pageviews.day],
        set: { count: sql`${pageviews.count} + 1` },
      });
  } catch (error) {
    await logError(error, path);
  }
}

export async function getActiveSponsor() {
  const db = getDb();
  if (!db) return null;
  const today = todayIso();
  const [row] = await db
    .select()
    .from(sponsorWeeks)
    .where(
      and(
        eq(sponsorWeeks.active, true),
        eq(sponsorWeeks.siteBar, true),
        sql`${sponsorWeeks.startsOn} <= ${today}`,
        sql`${sponsorWeeks.endsOn} >= ${today}`,
      ),
    )
    .orderBy(desc(sponsorWeeks.startsOn))
    .limit(1);
  return row ?? null;
}

export async function getEmailSponsor() {
  const db = getDb();
  if (!db) return null;
  const today = todayIso();
  const [row] = await db
    .select()
    .from(sponsorWeeks)
    .where(
      and(
        eq(sponsorWeeks.active, true),
        eq(sponsorWeeks.emailSlot, true),
        sql`${sponsorWeeks.startsOn} <= ${today}`,
        sql`${sponsorWeeks.endsOn} >= ${today}`,
      ),
    )
    .orderBy(desc(sponsorWeeks.startsOn))
    .limit(1);
  return row ?? null;
}

export async function getSponsorBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(sponsorWeeks)
    .where(eq(sponsorWeeks.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function logSponsorClick(sponsorId: number, path: string | null) {
  const db = getDb();
  if (!db) return;
  await db.insert(sponsorClicks).values({ sponsorId, path });
}

export async function publicStats() {
  const db = getDb();
  if (!db) return { signups: 0, pageviewsThisMonth: 0 };
  const [signupRow] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(signups);
  const [viewRow] = await db
    .select({
      value: sql<number>`coalesce(sum(${pageviews.count}), 0)::int`,
    })
    .from(pageviews)
    .where(sql`${pageviews.day} >= date_trunc('month', current_date)::date`);
  return {
    signups: signupRow?.value ?? 0,
    pageviewsThisMonth: viewRow?.value ?? 0,
  };
}

export async function newsletterBills(limit = 5): Promise<BillCard[]> {
  return getKeyBills("ga", limit);
}
