CREATE TABLE "follows" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	CONSTRAINT "follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id")
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"post_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "post_likes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;