import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  text,
  unique,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const userTeamRoleEnum = pgEnum("user_team_role", ["leader", "member"]);
export const teamJoinRequestEnum = pgEnum("team_join_request", [
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
]);
export const leaderTransferStatusEnum = pgEnum("leader_transfer_status", [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  role: userRoleEnum("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const cohorts = pgTable("cohorts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cohortMemberships = pgTable(
  "cohort_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.cohortId)],
);

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  cohortId: uuid("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "cascade" }),
  leaderId: uuid("leader_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  disbandedAt: timestamp("disbanded_at"),
  disbandReason: text("disband_reason"),
});

export const teamMemberships = pgTable(
  "team_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    leftReason: text("left_reason"),
  },
  (t) => [unique().on(t.teamId, t.userId)],
);

export const teamJoinRequests = pgTable(
  "team_join_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    withdrawnAt: timestamp("withdrawn_at"),
    status: teamJoinRequestEnum("status").default("pending"),
    profileLinks: jsonb("profile_links"),
  },
  (t) => [unique().on(t.teamId, t.userId)],
);

export const teamKickHistory = pgTable("team_kick_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  kickedUserId: uuid("kicked_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kickedById: uuid("kicked_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamNoticeBoard = pgTable("team_notice_board", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  postedBy: uuid("posted_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userInteractions = pgTable("user_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
  cohortId: uuid("cohort_id").references(() => cohorts.id, {
    onDelete: "cascade",
  }),
  relatedUserId: uuid("related_user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamLeaderTransfers = pgTable("team_leader_transfers", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  cohortId: uuid("cohort_id").references(() => cohorts.id, {
    onDelete: "cascade",
  }),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toUserId: uuid("to_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: leaderTransferStatusEnum("status").default("pending").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});
