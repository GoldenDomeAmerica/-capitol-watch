DROP INDEX "bills_slug_idx";--> statement-breakpoint
DROP INDEX "legislators_slug_idx";--> statement-breakpoint
ALTER TABLE "bills" ADD COLUMN "memo_url" text;--> statement-breakpoint
ALTER TABLE "bills" ADD COLUMN "actions" jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX "bills_state_slug_idx" ON "bills" USING btree ("state_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "legislators_state_slug_idx" ON "legislators" USING btree ("state_id","slug");