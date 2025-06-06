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
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
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

      const team = teamRows[0]!;

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
