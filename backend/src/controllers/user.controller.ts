import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import {
  cohortMemberships,
  cohorts,
  teamJoinRequests,
  teamMemberships,
  teams,
  users,
} from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  try {
    const usersList = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));

    if (usersList.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: usersList[0] });
  } catch (e) {
    console.error(e);
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
      console.error(e);
      return res.status(500).json({ error: "Error fetching user cohorts" });
    }
  },
);

export const getUserTeamByCohort = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { cohortId } = req.params;

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!cohortId) {
      return res.status(400).json({ error: "Invalid cohort id" });
    }

    try {
      const teamRows = await db
        .select({
          teamId: teams.id,
          name: teams.name,
          leaderId: teams.leaderId,
          isPublished: teams.isPublished,
          createdAt: teams.createdAt,
        })
        .from(teamMemberships)
        .innerJoin(teams, eq(teamMemberships.teamId, teams.id))
        .where(
          and(
            eq(teamMemberships.userId, user.id),
            eq(teams.cohortId, cohortId),
            isNull(teams.disbandedAt),
          ),
        );

      if (!teamRows || teamRows.length === 0) {
        return res
          .status(404)
          .json({ error: "User is not a part of any teams in the cohort" });
      }

      const [team] = teamRows;

      const members = await db
        .select({
          membershipId: teamMemberships.id,
          userId: teamMemberships.userId,
        })
        .from(teamMemberships)
        .where(eq(teamMemberships.teamId, team.teamId));

      return res.status(200).json({
        teamDetails: [
          {
            ...team,
            members,
          },
        ],
      });
    } catch (e) {
      console.error(e);
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
          ),
        );

      return res.status(200).json({
        requests,
      });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ error: "Error fetching team joining requests for user" });
    }
  },
);
