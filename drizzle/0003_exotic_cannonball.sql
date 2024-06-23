CREATE TABLE IF NOT EXISTS "example-project-1_cron_job_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logs" text,
	"anime_added" boolean DEFAULT false,
	"got_error" boolean DEFAULT false,
	"nothing_happened" boolean DEFAULT true,
	CONSTRAINT "example-project-1_cron_job_logs_id_unique" UNIQUE("id")
);
