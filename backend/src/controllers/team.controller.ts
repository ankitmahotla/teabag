import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import { teamMemberships, teams } from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { cohortId } = req.query;

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (!cohortId) {
    return res.status(400).json({ error: "CohortId is required" });
  }

  try {
    const teamsInCohort = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.cohortId, cohortId as string),
          eq(teams.isPublished, false),
        ),
      );

    return res.status(200).json(teamsInCohort);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to retrieve teams" });
  }
});

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const rows = await db
      .select({
        teamId: teams.id,
        name: teams.name,
        description: teams.description,
        cohortId: teams.cohortId,
        isPublished: teams.isPublished,
        membershipId: teamMemberships.id,
        userId: teamMemberships.userId,
      })
      .from(teams)
      .innerJoin(teamMemberships, eq(teams.id, teamMemberships.teamId))
      .where(eq(teams.id, id as string));

    if (rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const { teamId, name, description, cohortId, isPublished } = rows[0]!;

    const team = {
      id: teamId,
      name,
      description,
      cohortId,
      isPublished,
      members: rows.map((row) => ({
        membershipId: row.membershipId,
        userId: row.userId,
      })),
    };

    return res.status(200).json(team);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to retrieve team" });
  }
});

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const { name, description, cohortId } = req.body;

    if (!name || !cohortId) {
      return res.status(400).json({ error: "Name and cohortId are required" });
    }

    const existingTeamInCohort = await db
      .select()
      .from(teamMemberships)
      .innerJoin(teams, eq(teamMemberships.teamId, teams.id))
      .where(
        and(
          eq(teamMemberships.userId, user.id),
          eq(teams.cohortId, cohortId),
          isNull(teams.disbandedAt),
        ),
      );

    if (existingTeamInCohort.length > 0) {
      return res
        .status(400)
        .json({ error: "User already has a team in this cohort" });
    }

    const [newTeam] = await db
      .insert(teams)
      .values({
        name,
        description,
        cohortId,
        leaderId: user.id,
      })
      .returning();

    if (!newTeam) {
      return res.status(500).json({ error: "Failed to create team" });
    }

    await db.insert(teamMemberships).values({
      userId: user.id,
      teamId: newTeam.id,
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create team" });
  }
});
