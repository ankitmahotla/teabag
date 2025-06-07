ALTER TYPE "public"."team_join_request" ADD VALUE 'withdrawn';--> statement-breakpoint
CREATE TABLE "user_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"team_id" uuid,
	"cohort_id" uuid,
	"related_user_id" uuid,
	"event_ref_id" uuid,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team_notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "team_notes" CASCADE;--> statement-breakpoint
ALTER TABLE "cohorts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_join_requests" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_kick_history" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_memberships" ALTER COLUMN "joined_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "team_notice_board" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cohort_memberships" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cohort_memberships" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_related_user_id_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_join_requests" DROP COLUMN "profile_attachment_url";