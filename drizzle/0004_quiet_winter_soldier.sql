CREATE TABLE IF NOT EXISTS "example-project-1_discussion_thread_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discussion_thread_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"user_id" varchar(50) NOT NULL,
	CONSTRAINT "example-project-1_discussion_thread_replies_id_unique" UNIQUE("id")
);

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
ALTER TABLE "example-project-1_discussion_threads" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "example-project-1_section" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "example-project-1_topic" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "example-project-1_discussion_threads" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "example-project-1_section" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "example-project-1_topic" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
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
