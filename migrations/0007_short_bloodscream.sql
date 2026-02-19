ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "company" text;