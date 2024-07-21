CREATE TABLE IF NOT EXISTS "example-project-1_cron_job_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logs" text,
	"anime_added" boolean DEFAULT false,
	"got_error" boolean DEFAULT false,
	"nothing_happened" boolean DEFAULT true,
	CONSTRAINT "example-project-1_cron_job_logs_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_discussion_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(1024) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"section_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"user_id" varchar(50) NOT NULL,
	CONSTRAINT "example-project-1_discussion_threads_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_discussion_thread_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discussion_thread_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"user_id" varchar(50) NOT NULL,
	CONSTRAINT "example-project-1_discussion_thread_replies_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"privilege" smallint DEFAULT 10,
	CONSTRAINT "example-project-1_user_roles_id_unique" UNIQUE("id"),
	CONSTRAINT "example-project-1_user_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_section" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "example-project-1_section_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"section_id" uuid NOT NULL,
	CONSTRAINT "example-project-1_topic_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example-project-1_users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role_ids" uuid[],
	"email" text NOT NULL,
	"image_url" text,
	CONSTRAINT "example-project-1_users_id_unique" UNIQUE("id"),
	CONSTRAINT "example-project-1_users_name_unique" UNIQUE("name")
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
 ALTER TABLE "example-project-1_discussion_thread_replies" ADD CONSTRAINT "example-project-1_discussion_thread_replies_discussion_thread_id_example-project-1_discussion_threads_id_fk" FOREIGN KEY ("discussion_thread_id") REFERENCES "public"."example-project-1_discussion_threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_discussion_thread_replies" ADD CONSTRAINT "example-project-1_discussion_thread_replies_user_id_example-project-1_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."example-project-1_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example-project-1_topic" ADD CONSTRAINT "example-project-1_topic_section_id_example-project-1_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."example-project-1_section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

--> insert-statements

INSERT INTO "example-project-1_user_roles" (name, privilege)
VALUES ('admin', 1), ('mod', 5), ('member', 10);

--> trigger statements

CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


--> section-trigger

CREATE TRIGGER trigger_update_section
BEFORE UPDATE ON "example-project-1_section"
FOR EACH ROW 
EXECUTE FUNCTION update_timestamp();

--> topic-trigger

CREATE TRIGGER trigger_update_topic
BEFORE UPDATE ON "example-project-1_topic"
FOR EACH ROW 
EXECUTE FUNCTION update_timestamp();

--> disussion-threads-trigger

CREATE TRIGGER trigger_update_discussion_threads
BEFORE UPDATE ON "example-project-1_discussion_threads"
FOR EACH ROW 
EXECUTE FUNCTION update_timestamp();

--> replies-trigger

CREATE TRIGGER trigger_update_replies
BEFORE UPDATE ON "example-project-1_discussion_thread_replies"
FOR EACH ROW 
EXECUTE FUNCTION update_timestamp();

--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "discussion_thread_idx" ON "example-project-1_discussion_threads" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "section_idx" ON "example-project-1_section" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topics_idx" ON "example-project-1_topic" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_idx" ON "example-project-1_users" USING btree ("id");