import { readFile } from "node:fs/promises";
import path from "node:path";
import { TOPICS } from "../src/lib/topics";
import { billSponsors, billTopics, bills, legislators, states, topics } from "../src/db/schema";
import { openScriptDb } from "./script-db";

type Sponsor = { name: string; primary: boolean; legislatorId: string | null };

type ScheduledSnapshot = {
  generatedAt: string;
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
    memoUrl: string | null;
    billType: string | null;
    governorAction: unknown;
    passageVotes: unknown;
    actions: unknown;
    featured: boolean;
    legislationId: number | null;
    topics: string[];
    sponsors: Sponsor[];
  }[];
  legislators: {
    id: string;
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
};

const SCHEDULED = {
  idaho: {
    id: "id",
    name: "Idaho",
    slug: "idaho",
    legislatureName: "Idaho Legislature",
    urlPrefix: "https://legislature.idaho.gov/",
    minBills: 40,
  },
  "new-york": {
    id: "ny",
    name: "New York",
    slug: "new-york",
    legislatureName: "New York State Legislature",
    urlPrefix: "https://nyassembly.gov/",
    minBills: 40,
  },
  texas: {
    id: "tx",
    name: "Texas",
    slug: "texas",
    legislatureName: "Texas Legislature",
    urlPrefix: "https://capitol.texas.gov/",
    minBills: 40,
  },
} as const;

type ScheduledSlug = keyof typeof SCHEDULED;

async function insertChunks<T>(rows: T[], size: number, write: (chunk: T[]) => Promise<void>) {
  for (let index = 0; index < rows.length; index += size) {
    await write(rows.slice(index, index + size));
  }
}

/**
 * Insert rows for one new state. Conflicts are ignored, so a second run does not
 * change Georgia, Pennsylvania, Arizona, or rows already stored for this state.
 */
export async function seedScheduledState(slug: ScheduledSlug) {
  const state = SCHEDULED[slug];
  const snapshotPath = path.join(process.cwd(), "data", slug, "snapshot.json");
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as ScheduledSnapshot;
  if (snapshot.bills.length < state.minBills) {
    throw new Error(`${state.name} snapshot has ${snapshot.bills.length} bills; refusing to seed fewer than ${state.minBills}.`);
  }
  for (const bill of snapshot.bills) {
    if (!bill.sourceUrl.startsWith(state.urlPrefix)) {
      throw new Error(`Refusing ${bill.identifier} without an official ${state.urlPrefix} URL.`);
    }
    if (!bill.summary.trim()) throw new Error(`Missing summary for ${bill.identifier}.`);
  }
  const { db, client } = openScriptDb();
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(states)
        .values({
          id: state.id,
          name: state.name,
          slug: state.slug,
          legislatureName: state.legislatureName,
        })
        .onConflictDoNothing();
      for (const topic of TOPICS) {
        await tx.insert(topics).values(topic).onConflictDoNothing();
      }
      await insertChunks(snapshot.legislators, 80, async (chunk) => {
        await tx
          .insert(legislators)
          .values(
            chunk.map((member) => ({
              id: member.id,
              stateId: state.id,
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
          .onConflictDoNothing();
      });
      for (const bill of snapshot.bills) {
        await tx
          .insert(bills)
          .values({
            id: bill.id,
            stateId: state.id,
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
            memoUrl: bill.memoUrl,
            billType: bill.billType,
            governorAction: bill.governorAction as never,
            passageVotes: bill.passageVotes as never,
            actions: bill.actions as never,
            featured: bill.featured,
            legislationId: bill.legislationId,
            updatedAt: new Date(),
          })
          .onConflictDoNothing();
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
              legislatorId: sponsor.legislatorId && knownLegislators.has(sponsor.legislatorId) ? sponsor.legislatorId : null,
              name,
              isPrimary: sponsor.primary,
              sortOrder: index,
            },
          ];
        });
      });
      await insertChunks(sponsorRows, 200, async (chunk) => {
        if (chunk.length) await tx.insert(billSponsors).values(chunk).onConflictDoNothing();
      });
      const topicRows = snapshot.bills.flatMap((bill) =>
        bill.topics.filter((topicId) => TOPICS.some((topic) => topic.id === topicId)).map((topicId) => ({ billId: bill.id, topicId })),
      );
      await insertChunks(topicRows, 200, async (chunk) => {
        if (chunk.length) await tx.insert(billTopics).values(chunk).onConflictDoNothing();
      });
    });
  } finally {
    await client.end({ timeout: 5 });
  }
  console.log(`${state.name} rows inserted where missing. Existing states were not updated.`);
}

async function main() {
  const requested = process.argv.slice(2);
  const slugs = (requested.length ? requested : Object.keys(SCHEDULED)) as ScheduledSlug[];
  for (const slug of slugs) {
    if (!(slug in SCHEDULED)) throw new Error(`Unknown scheduled state: ${slug}`);
    await seedScheduledState(slug);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
