import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import {
  cohortMemberships,
  cohorts,
  teamJoinRequests,
  teamMemberships,
  teams,
  userInteractions,
  users,
} from "../db/schema";
import { and, desc, eq, isNotNull, isNull, lt } from "drizzle-orm";
import { logError } from "../utils/logError";

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const [userDetail] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!userDetail) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = {
      id: userDetail.id,
      email: userDetail.email,
      name: userDetail.name,
      role: userDetail.role,
    };

    return res.status(200).json({ user });
  } catch (e) {
    logError("Internal Server Error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export const getUserCohorts = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    try {
      const userCohorts = await db
        .select({
          cohortId: cohorts.id,
          name: cohorts.name,
          createdAt: cohorts.createdAt,
        })
        .from(cohortMemberships)
        .innerJoin(cohorts, eq(cohortMemberships.cohortId, cohorts.id))
        .where(eq(cohortMemberships.userId, user.id));

      if (!userCohorts || userCohorts.length === 0) {
        return res
          .status(404)
          .json({ error: "User is not a part of any cohorts" });
      }

      return res.status(200).json({ cohortsDetails: userCohorts });
    } catch (e) {
      logError("Error fetching user cohorts:", e);
      return res.status(500).json({ error: "Error fetching user cohorts" });
    }
  },
);

export const getUserTeamByCohort = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.query.userId || req.user.id;

    const { cohortId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Invalid user id" });
    }

    if (!cohortId) {
      return res.status(400).json({ error: "Invalid cohort id" });
    }

    try {
      const teamRows = await db
        .select({
          teamId: teams.id,
          name: teams.name,
          description: teams.description,
          leaderId: teams.leaderId,
          isPublished: teams.isPublished,
          createdAt: teams.createdAt,
        })
        .from(teamMemberships)
        .innerJoin(teams, eq(teamMemberships.teamId, teams.id))
        .where(
          and(
            eq(teams.cohortId, cohortId),
            eq(teamMemberships.userId, userId),
            eq(teams.cohortId, cohortId),
            isNull(teamMemberships.leftAt),
            isNull(teams.disbandedAt),
          ),
        );

      if (!teamRows || teamRows.length === 0) {
        return res
          .status(404)
          .json({ error: "User is not a part of any teams in the cohort" });
      }

      const [team] = teamRows;

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      return res.status(200).json({
        teamDetails: team,
      });
    } catch (e) {
      logError("Error fetching team details:", e);
      return res.status(500).json({ error: "Error fetching team details" });
    }
  },
);

export const getAllUserTeamJoiningRequestsByCohort = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const cohortId = req.params.cohortId;

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!cohortId) {
      return res.status(400).json({ error: "Cohort ID is required" });
    }

    try {
      const requests = await db
        .select({
          requestId: teamJoinRequests.id,
          teamId: teamJoinRequests.teamId,
          teamName: teams.name,
          status: teamJoinRequests.status,
          createdAt: teamJoinRequests.createdAt,
        })
        .from(teamJoinRequests)
        .innerJoin(teams, eq(teams.id, teamJoinRequests.teamId))
        .where(
          and(
            eq(teamJoinRequests.userId, user.id),
            eq(teams.cohortId, cohortId),
            isNull(teams.disbandedAt),
          ),
        );

      return res.status(200).json({
        requests,
      });
    } catch (e) {
      logError("Error fetching team joining requests for user:", e);
      return res
        .status(500)
        .json({ error: "Error fetching team joining requests for user" });
    }
  },
);

export const getUserInteractions = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor as string | undefined;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const conditions = [eq(userInteractions.userId, id)];
      if (cursor) {
        conditions.push(lt(userInteractions.createdAt, new Date(cursor)));
      }

      const results = await db
        .select()
        .from(userInteractions)
        .where(and(...conditions))
        .orderBy(desc(userInteractions.createdAt))
        .limit(limit + 1);

      const hasMore = results.length > limit;
      const data = hasMore ? results.slice(0, -1) : results;
      const lastItem = data[data.length - 1];
      const nextCursor =
        hasMore && lastItem?.createdAt
          ? new Date(lastItem.createdAt).toISOString()
          : null;

      return res.status(200).json({ data, nextCursor });
    } catch (e) {
      logError("Error fetching user interactions:", e);
      return res.status(500).json({ error: "Failed to fetch interactions" });
    }
  },
);

export const getUsersInCohort = asyncHandler(
  async (req: Request, res: Response) => {
    const { cohortId } = req.params;
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const cursor = req.query.cursor as string | undefined;

    // Validate cohortId
    if (!cohortId || typeof cohortId !== "string") {
      return res
        .status(400)
        .json({ error: "Cohort ID is required and must be a string." });
    }

    try {
      const conditions = [
        isNotNull(users.lastLoginAt),
        eq(cohortMemberships.userId, users.id),
        eq(cohortMemberships.cohortId, cohortId),
      ];
      if (cursor) {
        const cursorDate = new Date(cursor);
        if (isNaN(cursorDate.getTime())) {
          return res.status(400).json({ error: "Invalid cursor format." });
        }
        conditions.push(lt(cohortMemberships.createdAt, cursorDate));
      }

      // Query users with pagination (limit + 1 for hasMore detection)
      const results = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(cohortMemberships)
        .innerJoin(users, eq(users.id, cohortMemberships.userId))
        .where(and(...conditions))
        .orderBy(desc(cohortMemberships.createdAt))
        .limit(limit + 1);

      // Pagination logic
      const hasMore = results.length > limit;
      const data = hasMore ? results.slice(0, limit) : results;
      const lastItem = data[data.length - 1];
      const nextCursor =
        hasMore && lastItem?.createdAt
          ? new Date(lastItem.createdAt).toISOString()
          : null;

      return res.status(200).json({ data, nextCursor });
    } catch (e) {
      logError("Error fetching users in cohort:", e);
      return res.status(500).json({ error: "Failed to fetch users in cohort" });
    }
  },
);
