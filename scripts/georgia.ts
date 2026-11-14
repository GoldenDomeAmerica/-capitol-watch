import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq, inArray, notInArray, sql, type SQL } from "drizzle-orm";
import { TOPICS } from "../src/lib/topics";
import { plainSummary } from "../src/lib/summary";
import {
  billSponsors,
  billTopics,
  bills,
  legislators,
  states,
  topics,
  votes,
} from "../src/db/schema";
import { openScriptDb } from "./script-db";

const BILLS_REPO = "https://raw.githubusercontent.com/Votega/ga-legislation/main/";
const MEMBERS_URL =
  "https://raw.githubusercontent.com/Votega/ga-legislators/main/data/all.json";
const ZIPS_URL =
  "https://raw.githubusercontent.com/Votega/votega.org/main/assets/data/ga-zip-districts.json";
const VOTES_REPO = "https://raw.githubusercontent.com/Votega/ga-legislators/main/";

const PER_TOPIC = 8;

type UpstreamSponsor = {
  name?: string;
  primary?: boolean;
  legisGaGovId?: number | null;
};

type UpstreamBill = {
  identifier: string;
  legislationId?: number;
  session?: string;
  billType?: string | null;
  chamber?: "lower" | "upper" | null;
  title: string;
  abstract?: string | null;
  status?: string | null;
  statusDate?: string | null;
  subjects?: string[];
  sponsors?: UpstreamSponsor[];
  billUrl?: string | null;
  textUrl?: string | null;
  passageVotes?: unknown[] | null;
  governorAction?: unknown;
};

type Member = {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  party?: string | null;
  chamber?: string | null;
  district?: number | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  officialWebsiteUrl?: string | null;
  committees?: string[] | null;
  legisGaGovId?: number | null;
  leadershipRole?: string | null;
  status?: string | null;
  statusNote?: string | null;
  residence?: string | null;
  dateVacated?: string | null;
};

type ZipPayload = {
  zips: Record<
    string,
    {
      city?: string;
      counties?: { name?: string; share?: number }[];
      stateHouse?: { district: number; share: number }[];
      stateSenate?: { district: number; share: number }[];
    }
  >;
};

type VoteFile = {
  metadata?: { session?: string };
  votes: Record<
    string,
    {
      bill?: string | null;
      billUrl?: string | null;
      session?: string | null;
      motionText?: string | null;
      chamber?: string | null;
      rollNumber?: number | null;
      date?: string | null;
      yea?: number | null;
      nay?: number | null;
      result?: string | null;
    }
  >;
  memberVotes: Record<string, { voteId: string; vote: string }[]>;
};

type OverrideFile = {
  forceInclude: string[];
  bills: Record<string, { featured?: boolean; summary?: string; watchNote?: string }>;
};

export type Snapshot = {
  generatedAt: string;
  sources: { name: string; url: string; license: string }[];
  bills: {
    id: string;
    session: string;
    sessionName: string;
    slug: string;
    identifier: string;
    chamber: string;
    title: string;
    summary: string;
    officialSummary: string | null;
    watchNote: string | null;
    status: string | null;
    lastAction: string | null;
    lastActionDate: string | null;
    sourceUrl: string;
    textUrl: string | null;
    billType: string | null;
    governorAction: unknown;
    passageVotes: unknown;
    featured: boolean;
    legislationId: number | null;
    topics: string[];
    sponsors: { name: string; primary: boolean; legisGaGovId: string | null }[];
  }[];
  legislators: {
    id: string;
    upstreamId: string;
    slug: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    party: string | null;
    chamber: string;
    district: number;
    residence: string | null;
    counties: string[];
    email: string | null;
    phone: string | null;
    address: string | null;
    imageUrl: string | null;
    profileUrl: string;
    committees: string[];
    leadershipRole: string | null;
    status: string | null;
    statusNote: string | null;
    isCurrent: boolean;
  }[];
  votes: {
    id: string;
    billId: string;
    legislatorId: string;
    externalVoteId: string;
    chamber: string | null;
    position: string;
    motion: string | null;
    result: string | null;
    yea: number | null;
    nay: number | null;
    voteDate: string | null;
    rollNumber: number | null;
    sourceUrl: string | null;
    session: string | null;
    billIdentifier: string | null;
  }[];
};

const cacheDir = path.join(process.cwd(), "data", "cache");

async function downloadJson<T>(url: string, cacheName: string): Promise<T> {
  await mkdir(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, cacheName);
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "AmericanCapitolWatch/1.0 (Georgia bill tracker)",
        accept: "application/json",
      },
      signal: AbortSignal.timeout(120000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const text = await response.text();
    await writeFile(cachePath, text);
    return JSON.parse(text) as T;
  } catch (error) {
    try {
      const cached = await readFile(cachePath, "utf8");
      console.warn(`Using cached ${cacheName} after fetch failed:`, error);
      return JSON.parse(cached) as T;
    } catch {
      throw error;
    }
  }
}

function billKey(session: string, identifier: string): string {
  return `${session}|${identifier}`;
}

function isMeasure(bill: UpstreamBill): boolean {
  if (bill.billType === "resolution") return false;
  if (bill.billType === "bill") return true;
  return /^(HB|SB)\b/i.test(bill.identifier);
}

function textOf(bill: UpstreamBill): string {
  return `${bill.title} ${bill.abstract ?? ""}`;
}

function localCaption(bill: UpstreamBill): boolean {
  return /^[^;]{0,80}\b(County|City of|City);/i.test(bill.title);
}

function localHomestead(bill: UpstreamBill): boolean {
  const title = bill.title.toLowerCase();
  const subjects = bill.subjects ?? [];
  if (subjects.includes("Local / Municipal") && /homestead|ad valorem/.test(title)) return true;
  if (/homestead exemption/.test(title) && /(county|city of|city;)/.test(title)) return true;
  return false;
}

const TOPIC_TESTS: Record<string, (bill: UpstreamBill) => boolean> = {
  taxes: (bill) => {
    if (localHomestead(bill)) return false;
    // Subject tags are a convenience layer and sometimes disagree with the caption.
    // Require the official title or summary to actually talk about taxes.
    return /\b(income tax|sales tax|tax credit|tax rate|rate of (?:the )?tax|homestead exemption|ad valorem|taxation)\b/i.test(
      textOf(bill),
    );
  },
  guns: (bill) => {
    const text = textOf(bill);
    if (/\bair guns?\b/i.test(text) && !/firearm/i.test(text)) return false;
    return /\bfirearms?|weapons?|second amendment|ammunition|silencer|suppressor\b/i.test(text);
  },
  schools: (bill) => {
    if ((bill.subjects ?? []).includes("Local / Municipal")) return false;
    return (
      (bill.subjects ?? []).includes("EDUCATION") ||
      /\b(public school|scholarship|charter school|curriculum|pre-kindergarten|athletic)\b/i.test(
        textOf(bill),
      )
    );
  },
  elections: (bill) =>
    (bill.subjects ?? []).includes("ELECTIONS") ||
    /\b(elections?|voters?|ballots?|absentee|ranked-choice|campaign finance)\b/i.test(textOf(bill)),
  "property-rights": (bill) => {
    if (localHomestead(bill)) return false;
    const subjects = bill.subjects ?? [];
    return (
      (subjects.includes("PROPERTY") && !subjects.includes("Local / Municipal")) ||
      /\b(eminent domain|property owners?|property value|just compensation|private property|nuisance)\b/i.test(
        textOf(bill),
      )
    );
  },
};

function score(bill: UpstreamBill): number {
  const status = bill.status ?? "";
  let value = 0;
  if (/signed/i.test(status)) value += 80;
  else if (/veto/i.test(status)) value += 70;
  else if (/passed|adopted/i.test(status)) value += 50;
  else if (/lost/i.test(status)) value += 35;
  else if (/reported/i.test(status)) value += 20;
  if (bill.passageVotes?.length) value += 8;
  const time = Date.parse(bill.statusDate ?? "") || 0;
  return value + time / 1e12;
}

function topicsFor(bill: UpstreamBill): string[] {
  return Object.entries(TOPIC_TESTS)
    .filter(([, test]) => test(bill))
    .map(([id]) => id);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function billSlug(session: string, identifier: string): string {
  const base = slugify(identifier);
  return session === "2025_26" ? base : `${session.toLowerCase().replace(/_/g, "-")}-${base}`;
}

function dateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.slice(0, 10).match(/^\d{4}-\d{2}-\d{2}$/);
  return match ? match[0] : null;
}

function chamberOf(value: string | null | undefined): "house" | "senate" | null {
  if (!value) return null;
  if (/house|lower/i.test(value)) return "house";
  if (/senate|upper/i.test(value)) return "senate";
  return null;
}

function memberIsCurrent(member: Member): boolean {
  if (member.dateVacated) return false;
  if (/resign|vacat|deceased|expelled/i.test(member.status ?? "")) return false;
  return true;
}

function profileUrl(member: Member, chamber: "house" | "senate"): string {
  if (member.officialWebsiteUrl) return member.officialWebsiteUrl;
  const side = chamber === "house" ? "house" : "senate";
  return `https://www.legis.ga.gov/members/${side}/${member.legisGaGovId}`;
}

export async function buildSnapshot(): Promise<Snapshot> {
  const overrides = JSON.parse(
    await readFile(path.join(process.cwd(), "data", "georgia", "overrides.json"), "utf8"),
  ) as OverrideFile;
  const latest = await downloadJson<{
    sessions: { id: string; name: string; slug: string; files: { bills: string } }[];
  }>(`${BILLS_REPO}latest.json`, "bills-latest.json");

  const allBills: (UpstreamBill & { sessionName: string })[] = [];
  for (const session of latest.sessions) {
    const file = await downloadJson<{ metadata?: { session?: string; sessionName?: string }; bills: UpstreamBill[] }>(
      `${BILLS_REPO}${session.files.bills}`,
      `bills-${session.slug}.json`,
    );
    const sessionId = file.metadata?.session || session.id;
    const sessionName = file.metadata?.sessionName || session.name;
    for (const bill of file.bills) {
      allBills.push({ ...bill, session: bill.session || sessionId, sessionName });
    }
  }

  const byKey = new Map<string, UpstreamBill & { sessionName: string }>();
  for (const bill of allBills) {
    if (!bill.session || !bill.identifier) continue;
    byKey.set(billKey(bill.session, bill.identifier), bill);
  }

  const picked = new Map<string, UpstreamBill & { sessionName: string; topics: string[] }>();
  for (const topicId of Object.keys(TOPIC_TESTS)) {
    const matches = allBills.filter(
      (bill) =>
        bill.session &&
        isMeasure(bill) &&
        bill.billUrl &&
        !localCaption(bill) &&
        TOPIC_TESTS[topicId](bill),
    );
    matches.sort((a, b) => score(b) - score(a));
    for (const bill of matches.slice(0, PER_TOPIC)) {
      const key = billKey(bill.session!, bill.identifier);
      picked.set(key, { ...bill, topics: topicsFor(bill) });
    }
  }
  for (const key of overrides.forceInclude) {
    const bill = byKey.get(key);
    if (!bill?.billUrl || !isMeasure(bill)) {
      console.warn(`Force-include not found as a bill with an official URL: ${key}`);
      continue;
    }
    picked.set(key, { ...bill, topics: topicsFor(bill) });
  }
  if (picked.size < 30) {
    throw new Error(`Refusing to seed ${picked.size} bills. Expected at least 30 real bills.`);
  }

  const membersFile = await downloadJson<{ members: Member[] }>(MEMBERS_URL, "members.json");
  const zipFile = await downloadJson<ZipPayload>(ZIPS_URL, "zips.json");
  const countyByDistrict = new Map<string, Set<string>>();
  const slimZips: Record<
    string,
    {
      city: string;
      counties: string[];
      house: { district: number; share: number }[];
      senate: { district: number; share: number }[];
    }
  > = {};
  const countyNames = new Set<string>();
  for (const [zip, record] of Object.entries(zipFile.zips ?? {})) {
    const counties = (record.counties ?? [])
      .map((county) => county.name?.trim())
      .filter((name): name is string => Boolean(name));
    for (const name of counties) countyNames.add(name);
    const house = (record.stateHouse ?? []).filter((row) => row.share >= 0.05);
    const senate = (record.stateSenate ?? []).filter((row) => row.share >= 0.05);
    slimZips[zip] = { city: record.city ?? "", counties, house, senate };
    for (const row of record.stateHouse ?? []) {
      if (row.share < 0.15) continue;
      const key = `house:${row.district}`;
      const set = countyByDistrict.get(key) ?? new Set<string>();
      counties.forEach((name) => set.add(name));
      countyByDistrict.set(key, set);
    }
    for (const row of record.stateSenate ?? []) {
      if (row.share < 0.15) continue;
      const key = `senate:${row.district}`;
      const set = countyByDistrict.get(key) ?? new Set<string>();
      counties.forEach((name) => set.add(name));
      countyByDistrict.set(key, set);
    }
  }
  await mkdir(path.join(process.cwd(), "data", "georgia"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "data", "georgia", "zips.json"),
    JSON.stringify(
      {
        source: "VoteGA ZIP-to-district file, derived from public Census and USPS geography",
        sourceUrl: ZIPS_URL,
        license: "CC BY-SA 4.0",
        counties: [...countyNames].sort(),
        zips: slimZips,
      },
      null,
      0,
    ),
  );

  const chosenMembers = new Map<string, Member>();
  for (const member of membersFile.members) {
    if (!member.legisGaGovId || member.district == null) continue;
    const id = String(member.legisGaGovId);
    const previous = chosenMembers.get(id);
    if (!previous || (!memberIsCurrent(previous) && memberIsCurrent(member))) {
      chosenMembers.set(id, member);
    }
  }
  const usedSlugs = new Set<string>();
  const upstreamToLegis = new Map<string, string>();
  const legislatorRows: Snapshot["legislators"] = [];
  for (const member of chosenMembers.values()) {
    const chamber = chamberOf(member.chamber);
    if (!chamber || member.district == null || !member.legisGaGovId) continue;
    const id = String(member.legisGaGovId);
    upstreamToLegis.set(member.id, id);
    let slug = `${chamber}-${member.district}-${slugify(member.name)}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${id}`;
    usedSlugs.add(slug);
    const counties = [...(countyByDistrict.get(`${chamber}:${member.district}`) ?? [])].sort();
    legislatorRows.push({
      id,
      upstreamId: member.id,
      slug,
      name: member.name,
      firstName: member.firstName ?? null,
      lastName: member.lastName ?? null,
      party: member.party ?? null,
      chamber,
      district: member.district,
      residence: member.residence ?? null,
      counties,
      email: member.email ?? null,
      phone: member.phone ?? null,
      address: member.address ?? null,
      imageUrl: member.imageUrl ?? null,
      profileUrl: profileUrl(member, chamber),
      committees: member.committees ?? [],
      leadershipRole: member.leadershipRole ?? null,
      status: member.status ?? null,
      statusNote: member.statusNote ?? null,
      isCurrent: memberIsCurrent(member),
    });
  }

  const billRows: Snapshot["bills"] = [];
  const usedBillSlugs = new Set<string>();
  for (const [key, bill] of picked) {
    const session = bill.session!;
    let slug = billSlug(session, bill.identifier);
    if (usedBillSlugs.has(slug)) slug = `${slug}-${bill.legislationId ?? slugify(session)}`;
    usedBillSlugs.add(slug);
    if (!bill.billUrl?.startsWith("https://www.legis.ga.gov/")) {
      throw new Error(`${bill.identifier} is missing an official legis.ga.gov URL`);
    }
    const override = overrides.bills[key];
    const sponsors = (bill.sponsors ?? [])
      .filter((sponsor) => sponsor.name?.trim())
      .map((sponsor) => ({
        name: sponsor.name!.trim(),
        primary: Boolean(sponsor.primary),
        legisGaGovId: sponsor.legisGaGovId ? String(sponsor.legisGaGovId) : null,
      }));
    billRows.push({
      id: key,
      session,
      sessionName: bill.sessionName,
      slug,
      identifier: bill.identifier,
      chamber: bill.chamber === "upper" ? "senate" : "house",
      title: bill.title.trim(),
      summary: override?.summary?.trim() || plainSummary(bill.title, bill.abstract),
      officialSummary: bill.abstract?.trim() || null,
      watchNote: override?.watchNote?.trim() || null,
      status: bill.status ?? null,
      lastAction: bill.status ?? null,
      lastActionDate: dateOnly(bill.statusDate),
      sourceUrl: bill.billUrl,
      textUrl: bill.textUrl ?? null,
      billType: bill.billType ?? null,
      governorAction: bill.governorAction ?? null,
      passageVotes: bill.passageVotes ?? [],
      featured: Boolean(override?.featured),
      legislationId: bill.legislationId ?? null,
      topics: bill.topics,
      sponsors,
    });
  }

  const wanted = new Set(billRows.map((bill) => billKey(bill.session, bill.identifier)));
  const billIdByKey = new Map(billRows.map((bill) => [billKey(bill.session, bill.identifier), bill.id]));
  const sessionsNeeded = [...new Set(billRows.map((bill) => bill.session))];
  const voteRows: Snapshot["votes"] = [];
  for (const session of latest.sessions) {
    const sessionId = session.id;
    if (!sessionsNeeded.includes(sessionId) && !sessionsNeeded.some((id) => id.startsWith(sessionId))) {
      // session.id in latest.json is 2025_26 / 2026_ss, matching bill.session
    }
    if (!sessionsNeeded.includes(session.id)) continue;
    let voteFile: VoteFile;
    try {
      voteFile = await downloadJson<VoteFile>(
        `${VOTES_REPO}sessions/${session.slug}/votes.json`,
        `votes-${session.slug}.json`,
      );
    } catch (error) {
      console.warn(`No roll-call file for ${session.slug}:`, error);
      continue;
    }
    const relevant = new Map<string, VoteFile["votes"][string]>();
    for (const [voteId, vote] of Object.entries(voteFile.votes ?? {})) {
      const sessionCode = vote.session || voteFile.metadata?.session || session.id;
      if (!vote.bill || !wanted.has(billKey(sessionCode, vote.bill))) continue;
      relevant.set(voteId, { ...vote, session: sessionCode });
    }
    for (const [upstreamId, memberVoteList] of Object.entries(voteFile.memberVotes ?? {})) {
      const legislatorId = upstreamToLegis.get(upstreamId);
      if (!legislatorId) continue;
      for (const memberVote of memberVoteList) {
        const vote = relevant.get(memberVote.voteId);
        if (!vote?.bill || !vote.session) continue;
        const billId = billIdByKey.get(billKey(vote.session, vote.bill));
        if (!billId || !memberVote.vote) continue;
        voteRows.push({
          id: `${memberVote.voteId}:${legislatorId}`,
          billId,
          legislatorId,
          externalVoteId: memberVote.voteId,
          chamber: chamberOf(vote.chamber),
          position: memberVote.vote,
          motion: vote.motionText ?? null,
          result: vote.result ?? null,
          yea: vote.yea ?? null,
          nay: vote.nay ?? null,
          voteDate: dateOnly(vote.date),
          rollNumber: vote.rollNumber ?? null,
          sourceUrl: vote.billUrl ?? null,
          session: vote.session,
          billIdentifier: vote.bill,
        });
      }
    }
  }

  const snapshot: Snapshot = {
    generatedAt: new Date().toISOString(),
    sources: [
      {
        name: "Georgia General Assembly",
        url: "https://www.legis.ga.gov/",
        license: "Public legislative record",
      },
      {
        name: "VoteGA.org compilation",
        url: "https://github.com/Votega/ga-legislation",
        license: "CC BY-SA 4.0",
      },
      {
        name: "VoteGA.org legislator roster and roll calls",
        url: "https://github.com/Votega/ga-legislators",
        license: "CC BY-SA 4.0",
      },
    ],
    bills: billRows.sort((a, b) => a.identifier.localeCompare(b.identifier, undefined, { numeric: true })),
    legislators: legislatorRows.sort((a, b) => a.chamber.localeCompare(b.chamber) || a.district - b.district),
    votes: dedupeVotes(voteRows),
  };
  await writeFile(
    path.join(process.cwd(), "data", "georgia", "snapshot.json"),
    JSON.stringify(snapshot),
  );
  console.log(
    `Snapshot: ${snapshot.bills.length} bills, ${snapshot.legislators.length} legislators, ${snapshot.votes.length} member votes`,
  );
  return snapshot;
}

async function insertChunks<T>(rows: T[], size: number, write: (chunk: T[]) => Promise<void>) {
  for (let index = 0; index < rows.length; index += size) {
    await write(rows.slice(index, index + size));
  }
}

export async function upsertSnapshot(snapshot: Snapshot) {
  for (const bill of snapshot.bills) {
    if (!bill.sourceUrl.startsWith("https://www.legis.ga.gov/")) {
      throw new Error(`Refusing bill without an official source URL: ${bill.identifier}`);
    }
    if (!bill.summary.trim()) throw new Error(`Missing summary for ${bill.identifier}`);
  }
  const { db, client } = openScriptDb();
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(states)
        .values({
          id: "ga",
          name: "Georgia",
          slug: "georgia",
          legislatureName: "Georgia General Assembly",
        })
        .onConflictDoUpdate({
          target: states.id,
          set: { name: "Georgia", legislatureName: "Georgia General Assembly" },
        });
      for (const topic of TOPICS) {
        await tx
          .insert(topics)
          .values(topic)
          .onConflictDoUpdate({
            target: topics.id,
            set: {
              name: topic.name,
              slug: topic.slug,
              description: topic.description,
              sortOrder: topic.sortOrder,
            },
          });
      }
      await insertChunks(snapshot.legislators, 80, async (chunk) => {
        await tx
          .insert(legislators)
          .values(
            chunk.map((member) => ({
              id: member.id,
              stateId: "ga",
              slug: member.slug,
              name: member.name,
              firstName: member.firstName,
              lastName: member.lastName,
              party: member.party,
              chamber: member.chamber,
              district: member.district,
              residence: member.residence,
              counties: member.counties,
              email: member.email,
              phone: member.phone,
              address: member.address,
              imageUrl: member.imageUrl,
              profileUrl: member.profileUrl,
              committees: member.committees,
              leadershipRole: member.leadershipRole,
              status: member.status,
              statusNote: member.statusNote,
              isCurrent: member.isCurrent,
            })),
          )
          .onConflictDoUpdate({
            target: legislators.id,
            set: {
              slug: sqlExcluded("slug"),
              name: sqlExcluded("name"),
              party: sqlExcluded("party"),
              chamber: sqlExcluded("chamber"),
              district: sqlExcluded("district"),
              residence: sqlExcluded("residence"),
              counties: sqlExcluded("counties"),
              email: sqlExcluded("email"),
              phone: sqlExcluded("phone"),
              address: sqlExcluded("address"),
              imageUrl: sqlExcluded("image_url"),
              profileUrl: sqlExcluded("profile_url"),
              committees: sqlExcluded("committees"),
              leadershipRole: sqlExcluded("leadership_role"),
              status: sqlExcluded("status"),
              statusNote: sqlExcluded("status_note"),
              isCurrent: sqlExcluded("is_current"),
            },
          });
      });

      for (const bill of snapshot.bills) {
        await tx
          .insert(bills)
          .values({
            id: bill.id,
            stateId: "ga",
            session: bill.session,
            sessionName: bill.sessionName,
            slug: bill.slug,
            identifier: bill.identifier,
            chamber: bill.chamber,
            title: bill.title,
            summary: bill.summary,
            officialSummary: bill.officialSummary,
            watchNote: bill.watchNote,
            status: bill.status,
            lastAction: bill.lastAction,
            lastActionDate: bill.lastActionDate,
            sourceUrl: bill.sourceUrl,
            textUrl: bill.textUrl,
            billType: bill.billType,
            governorAction: bill.governorAction as never,
            passageVotes: bill.passageVotes as never,
            featured: bill.featured,
            legislationId: bill.legislationId,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: bills.id,
            set: {
              slug: bill.slug,
              title: bill.title,
              summary: bill.summary,
              officialSummary: bill.officialSummary,
              watchNote: bill.watchNote,
              status: bill.status,
              lastAction: bill.lastAction,
              lastActionDate: bill.lastActionDate,
              sourceUrl: bill.sourceUrl,
              textUrl: bill.textUrl,
              governorAction: bill.governorAction as never,
              passageVotes: bill.passageVotes as never,
              featured: bill.featured,
              sessionName: bill.sessionName,
              updatedAt: new Date(),
            },
          });
      }

      const billIds = snapshot.bills.map((bill) => bill.id);
      if (billIds.length) {
        await tx.delete(bills).where(and(eq(bills.stateId, "ga"), notInArray(bills.id, billIds)));
        await tx.delete(billSponsors).where(inArray(billSponsors.billId, billIds));
        await tx.delete(billTopics).where(inArray(billTopics.billId, billIds));
        await tx.delete(votes).where(inArray(votes.billId, billIds));
      }
      const knownLegislators = new Set(snapshot.legislators.map((member) => member.id));
      const sponsorRows = snapshot.bills.flatMap((bill) => {
        const seen = new Set<string>();
        return bill.sponsors.flatMap((sponsor, index) => {
          const name = sponsor.name.trim();
          if (!name || seen.has(name)) return [];
          seen.add(name);
          return [
            {
              billId: bill.id,
              legislatorId:
                sponsor.legisGaGovId && knownLegislators.has(sponsor.legisGaGovId)
                  ? sponsor.legisGaGovId
                  : null,
              name,
              isPrimary: sponsor.primary,
              sortOrder: index,
            },
          ];
        });
      });
      await insertChunks(sponsorRows, 200, async (chunk) => {
        await tx.insert(billSponsors).values(chunk);
      });
      const topicRows = snapshot.bills.flatMap((bill) =>
        bill.topics.map((topicId) => ({ billId: bill.id, topicId })),
      );
      await insertChunks(topicRows, 200, async (chunk) => {
        await tx.insert(billTopics).values(chunk);
      });
      await insertChunks(snapshot.votes, 400, async (chunk) => {
        await tx.insert(votes).values(chunk);
      });
    });
  } finally {
    await client.end({ timeout: 5 });
  }
  console.log("Database updated.");
}

function dedupeVotes(rows: Snapshot["votes"]): Snapshot["votes"] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

function sqlExcluded(column: string): SQL {
  return sql.raw(`excluded.${column}`);
}
