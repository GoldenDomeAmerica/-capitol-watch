import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export type PassageVote = {
  chamber?: string | null;
  date?: string | null;
  result?: string | null;
  motionText?: string | null;
  yea?: number | null;
  nay?: number | null;
  other?: number | null;
};

export type GovernorAction = {
  status?: string | null;
  sentDate?: string | null;
  decisionDate?: string | null;
  actNumber?: number | string | null;
};

export type BillAction = {
  date?: string | null;
  chamber?: string | null;
  text: string;
  vote?: string | null;
};

export const states = pgTable("states", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  legislatureName: text("legislature_name").notNull(),
});

export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bills = pgTable(
  "bills",
  {
    id: text("id").primaryKey(),
    stateId: text("state_id")
      .notNull()
      .references(() => states.id),
    session: text("session").notNull(),
    sessionName: text("session_name").notNull(),
    slug: text("slug").notNull(),
    identifier: text("identifier").notNull(),
    chamber: text("chamber").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    officialSummary: text("official_summary"),
    watchNote: text("watch_note"),
    status: text("status"),
    lastAction: text("last_action"),
    lastActionDate: date("last_action_date", { mode: "string" }),
    sourceUrl: text("source_url").notNull(),
    textUrl: text("text_url"),
    memoUrl: text("memo_url"),
    billType: text("bill_type"),
    governorAction: jsonb("governor_action").$type<GovernorAction | null>(),
    passageVotes: jsonb("passage_votes").$type<PassageVote[] | null>(),
    actions: jsonb("actions").$type<BillAction[] | null>(),
    featured: boolean("featured").notNull().default(false),
    legislationId: integer("legislation_id"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("bills_state_slug_idx").on(table.stateId, table.slug),
    index("bills_state_session_idx").on(table.stateId, table.session),
    index("bills_featured_idx").on(table.featured),
    index("bills_last_action_idx").on(table.lastActionDate),
  ],
);

export const billTopics = pgTable(
  "bill_topics",
  {
    billId: text("bill_id")
      .notNull()
      .references(() => bills.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id),
  },
  (table) => [primaryKey({ columns: [table.billId, table.topicId] })],
);

export const legislators = pgTable(
  "legislators",
  {
    id: text("id").primaryKey(),
    stateId: text("state_id")
      .notNull()
      .references(() => states.id),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    party: text("party"),
    chamber: text("chamber").notNull(),
    district: integer("district").notNull(),
    residence: text("residence"),
    counties: text("counties")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    imageUrl: text("image_url"),
    profileUrl: text("profile_url").notNull(),
    committees: text("committees").array(),
    leadershipRole: text("leadership_role"),
    status: text("status"),
    statusNote: text("status_note"),
    isCurrent: boolean("is_current").notNull().default(true),
  },
  (table) => [
    uniqueIndex("legislators_state_slug_idx").on(table.stateId, table.slug),
    index("legislators_chamber_district_idx").on(table.chamber, table.district),
    index("legislators_current_idx").on(table.isCurrent),
  ],
);

export const billSponsors = pgTable(
  "bill_sponsors",
  {
    billId: text("bill_id")
      .notNull()
      .references(() => bills.id, { onDelete: "cascade" }),
    legislatorId: text("legislator_id").references(() => legislators.id),
    name: text("name").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.billId, table.name] }),
    index("bill_sponsors_legislator_idx").on(table.legislatorId),
  ],
);

export const votes = pgTable(
  "votes",
  {
    id: text("id").primaryKey(),
    billId: text("bill_id").references(() => bills.id, { onDelete: "cascade" }),
    legislatorId: text("legislator_id").references(() => legislators.id, {
      onDelete: "cascade",
    }),
    externalVoteId: text("external_vote_id").notNull(),
    chamber: text("chamber"),
    position: text("position").notNull(),
    motion: text("motion"),
    result: text("result"),
    yea: integer("yea"),
    nay: integer("nay"),
    voteDate: date("vote_date", { mode: "string" }),
    rollNumber: integer("roll_number"),
    sourceUrl: text("source_url"),
    session: text("session"),
    billIdentifier: text("bill_identifier"),
  },
  (table) => [
    index("votes_legislator_idx").on(table.legislatorId),
    index("votes_bill_idx").on(table.billId),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    organization: text("organization"),
    body: text("body").notNull(),
    relatedUrl: text("related_url"),
    status: text("status").notNull().default("pending"),
    reviewNote: text("review_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [index("submissions_status_idx").on(table.status)],
);

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  consent: boolean("consent").notNull().default(false),
  source: text("source"),
  resendContactId: text("resend_contact_id"),
  resendStatus: text("resend_status"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const zeroResultSearches = pgTable("zero_result_searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  scope: text("scope"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pageviews = pgTable(
  "pageviews",
  {
    id: serial("id").primaryKey(),
    path: text("path").notNull(),
    day: date("day", { mode: "string" }).notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [uniqueIndex("pageviews_path_day_idx").on(table.path, table.day)],
);

export const sponsorWeeks = pgTable("sponsor_weeks", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  destinationUrl: text("destination_url").notNull(),
  paidForBy: text("paid_for_by").notNull(),
  startsOn: date("starts_on", { mode: "string" }).notNull(),
  endsOn: date("ends_on", { mode: "string" }).notNull(),
  weeklyRateCents: integer("weekly_rate_cents").notNull().default(5000),
  emailSlot: boolean("email_slot").notNull().default(true),
  siteBar: boolean("site_bar").notNull().default(true),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sponsorClicks = pgTable(
  "sponsor_clicks",
  {
    id: serial("id").primaryKey(),
    sponsorId: integer("sponsor_id")
      .notNull()
      .references(() => sponsorWeeks.id),
    path: text("path"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("sponsor_clicks_sponsor_idx").on(table.sponsorId)],
);

export const errors = pgTable("errors", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  path: text("path"),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
