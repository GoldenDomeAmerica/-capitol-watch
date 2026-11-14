CREATE TABLE "bill_sponsors" (
	"bill_id" text NOT NULL,
	"legislator_id" text,
	"name" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "bill_sponsors_bill_id_name_pk" PRIMARY KEY("bill_id","name")
);
--> statement-breakpoint
CREATE TABLE "bill_topics" (
	"bill_id" text NOT NULL,
	"topic_id" text NOT NULL,
	CONSTRAINT "bill_topics_bill_id_topic_id_pk" PRIMARY KEY("bill_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "bills" (
	"id" text PRIMARY KEY NOT NULL,
	"state_id" text NOT NULL,
	"session" text NOT NULL,
	"session_name" text NOT NULL,
	"slug" text NOT NULL,
	"identifier" text NOT NULL,
	"chamber" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"official_summary" text,
	"watch_note" text,
	"status" text,
	"last_action" text,
	"last_action_date" date,
	"source_url" text NOT NULL,
	"text_url" text,
	"bill_type" text,
	"governor_action" jsonb,
	"passage_votes" jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	"legislation_id" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "errors" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"path" text,
	"detail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislators" (
	"id" text PRIMARY KEY NOT NULL,
	"state_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"party" text,
	"chamber" text NOT NULL,
	"district" integer NOT NULL,
	"residence" text,
	"counties" text[] DEFAULT '{}'::text[] NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"image_url" text,
	"profile_url" text NOT NULL,
	"committees" text[],
	"leadership_role" text,
	"status" text,
	"status_note" text,
	"is_current" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pageviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"day" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	"source" text,
	"resend_contact_id" text,
	"resend_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "signups_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sponsor_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"sponsor_id" integer NOT NULL,
	"path" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_weeks" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text,
	"destination_url" text NOT NULL,
	"paid_for_by" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"weekly_rate_cents" integer DEFAULT 5000 NOT NULL,
	"email_slot" boolean DEFAULT true NOT NULL,
	"site_bar" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sponsor_weeks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"legislature_name" text NOT NULL,
	CONSTRAINT "states_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"organization" text,
	"body" text NOT NULL,
	"related_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"review_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" text PRIMARY KEY NOT NULL,
	"bill_id" text,
	"legislator_id" text,
	"external_vote_id" text NOT NULL,
	"chamber" text,
	"position" text NOT NULL,
	"motion" text,
	"result" text,
	"yea" integer,
	"nay" integer,
	"vote_date" date,
	"roll_number" integer,
	"source_url" text,
	"session" text,
	"bill_identifier" text
);
--> statement-breakpoint
CREATE TABLE "zero_result_searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"scope" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bill_sponsors" ADD CONSTRAINT "bill_sponsors_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_sponsors" ADD CONSTRAINT "bill_sponsors_legislator_id_legislators_id_fk" FOREIGN KEY ("legislator_id") REFERENCES "public"."legislators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_topics" ADD CONSTRAINT "bill_topics_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_topics" ADD CONSTRAINT "bill_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislators" ADD CONSTRAINT "legislators_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_clicks" ADD CONSTRAINT "sponsor_clicks_sponsor_id_sponsor_weeks_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsor_weeks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_legislator_id_legislators_id_fk" FOREIGN KEY ("legislator_id") REFERENCES "public"."legislators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bill_sponsors_legislator_idx" ON "bill_sponsors" USING btree ("legislator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bills_slug_idx" ON "bills" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "bills_state_session_idx" ON "bills" USING btree ("state_id","session");--> statement-breakpoint
CREATE INDEX "bills_featured_idx" ON "bills" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "bills_last_action_idx" ON "bills" USING btree ("last_action_date");--> statement-breakpoint
CREATE UNIQUE INDEX "legislators_slug_idx" ON "legislators" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "legislators_chamber_district_idx" ON "legislators" USING btree ("chamber","district");--> statement-breakpoint
CREATE INDEX "legislators_current_idx" ON "legislators" USING btree ("is_current");--> statement-breakpoint
CREATE UNIQUE INDEX "pageviews_path_day_idx" ON "pageviews" USING btree ("path","day");--> statement-breakpoint
CREATE INDEX "sponsor_clicks_sponsor_idx" ON "sponsor_clicks" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "votes_legislator_idx" ON "votes" USING btree ("legislator_id");--> statement-breakpoint
CREATE INDEX "votes_bill_idx" ON "votes" USING btree ("bill_id");