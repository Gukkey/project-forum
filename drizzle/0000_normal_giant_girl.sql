CREATE TABLE IF NOT EXISTS "example-project-1_discussion_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(1024) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"section_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"user_id" varchar(50) NOT NULL,
	CONSTRAINT "example-project-1_discussion_threads_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "example-project-1_section_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"section_id" uuid NOT NULL,
	CONSTRAINT "example-project-1_topic_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"role" varchar(10),
	"email" varchar(50) NOT NULL,
	"image_url" text,
	CONSTRAINT "example-project-1_users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_discussion_threads" ADD CONSTRAINT "example-project-1_discussion_threads_section_id_example-project-1_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."example-project-1_section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_discussion_threads" ADD CONSTRAINT "example-project-1_discussion_threads_topic_id_example-project-1_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."example-project-1_topic"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_discussion_threads" ADD CONSTRAINT "example-project-1_discussion_threads_user_id_example-project-1_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."example-project-1_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_topic" ADD CONSTRAINT "example-project-1_topic_section_id_example-project-1_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."example-project-1_section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "discussion_thread_idx" ON "example-project-1_discussion_threads" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "section_idx" ON "example-project-1_section" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topics_idx" ON "example-project-1_topic" USING btree ("name");