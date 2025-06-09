CREATE TYPE "public"."leader_transfer_status" AS ENUM('pending', 'accepted', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TABLE "team_leader_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"status" "leader_transfer_status" DEFAULT 'pending' NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_interactions" DROP CONSTRAINT "user_interactions_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "user_interactions" DROP CONSTRAINT "user_interactions_cohort_id_cohorts_id_fk";
--> statement-breakpoint
ALTER TABLE "user_interactions" DROP CONSTRAINT "user_interactions_related_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "team_join_requests" ADD COLUMN "profile_links" jsonb;--> statement-breakpoint
ALTER TABLE "team_memberships" ADD COLUMN "left_reason" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "disband_reason" text;--> statement-breakpoint
ALTER TABLE "team_leader_transfers" ADD CONSTRAINT "team_leader_transfers_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_leader_transfers" ADD CONSTRAINT "team_leader_transfers_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_leader_transfers" ADD CONSTRAINT "team_leader_transfers_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_cohort_id_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohorts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_related_user_id_users_id_fk" FOREIGN KEY ("related_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interactions" DROP COLUMN "event_ref_id";