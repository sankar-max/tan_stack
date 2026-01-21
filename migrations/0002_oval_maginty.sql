ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "posts_updated_idx" ON "posts" USING btree ("updated_at");