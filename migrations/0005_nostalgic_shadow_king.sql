ALTER TABLE "comments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "comments_updated_idx" ON "comments" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "comments_id_idx" ON "comments" USING btree ("id");