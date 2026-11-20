CREATE TABLE IF NOT EXISTS "hot_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"state_slug" text NOT NULL,
	"week_start" date NOT NULL,
	"rank" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"link" text,
	"source_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hot_topics_rank_check" CHECK ("hot_topics"."rank" between 1 and 2)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "hot_topics_state_week_rank_idx" ON "hot_topics" USING btree ("state_slug","week_start","rank");
