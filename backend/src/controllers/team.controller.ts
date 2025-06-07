import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import { teamJoinRequests, teamMemberships, teams, users } from "../db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  const cohortId = req.query.cohortId as string;

  if (!cohortId || typeof cohortId !== "string") {
    return res.status(400).json({ error: "CohortId is required" });
  }

  try {
    const teamsInCohort = await db
      .select()
      .from(teams)
      .where(and(eq(teams.cohortId, cohortId), eq(teams.isPublished, true)));

    return res.status(200).json(teamsInCohort);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to retrieve teams" });
  }
});

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ error: "Team ID is required" });
  }

  try {
    const rows = await db
      .select({
        teamId: teams.id,
        name: teams.name,
        description: teams.description,
        leaderId: teams.leaderId,
        cohortId: teams.cohortId,
        isPublished: teams.isPublished,
        membershipId: teamMemberships.id,
        userId: teamMemberships.userId,
      })
      .from(teams)
      .innerJoin(teamMemberships, eq(teams.id, teamMemberships.teamId))
      .where(eq(teams.id, id));

    if (rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const { teamId, name, description, cohortId, isPublished, leaderId } =
      rows[0]!;

    const team = {
      id: teamId,
      name,
      description,
      leaderId,
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

export const togglePublishTeam = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Missing team ID" });
    }

    try {
      const team = await db
        .select()
        .from(teams)
        .where(
          and(
            eq(teams.id, teamId),
            eq(teams.leaderId, user.id),
            isNull(teams.disbandedAt),
          ),
        )
        .then((rows) => rows[0]);

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      const newPublishState = !team.isPublished;

      await db
        .update(teams)
        .set({ isPublished: newPublishState })
        .where(eq(teams.id, teamId));

      return res.status(200).json({
        message: `Team ${newPublishState ? "published" : "unpublished"} successfully`,
        isPublished: newPublishState,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to toggle publish state" });
    }
  },
);

export const requestToJoinTeam = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId } = req.params;
    const { cohortId, note } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "Invalid team id" });
    }

    if (!cohortId) {
      return res.status(400).json({ error: "Invalid cohort id" });
    }

    try {
      const existingMembership = await db
        .select()
        .from(teamMemberships)
        .where(
          and(
            eq(teamMemberships.teamId, teamId),
            eq(teamMemberships.userId, user.id),
          ),
        );

      if (existingMembership.length > 0) {
        return res
          .status(400)
          .json({ error: "User is already a member of the team" });
      }

      const leaderOfTeamInCohort = await db
        .select()
        .from(teams)
        .where(
          and(
            eq(teams.cohortId, cohortId),
            eq(teams.leaderId, user.id),
            isNull(teams.disbandedAt),
          ),
        );

      if (leaderOfTeamInCohort.length > 0) {
        return res
          .status(400)
          .json({ error: "User is already a leader of a team in this cohort" });
      }

      const team = await db
        .select()
        .from(teams)
        .where(and(eq(teams.id, teamId), eq(teams.cohortId, cohortId)))
        .then((rows) => rows[0]);

      if (!team) {
        return res
          .status(400)
          .json({ error: "Team does not belong to the provided cohort" });
      }

      const activeMembers = await db
        .select()
        .from(teamMemberships)
        .where(
          and(
            eq(teamMemberships.teamId, teamId),
            isNull(teamMemberships.leftAt),
          ),
        );

      if (activeMembers.length >= 4) {
        return res.status(400).json({
          error: "Team already has the maximum number of members (4)",
        });
      }

      const existingRequest = await db
        .select()
        .from(teamJoinRequests)
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.userId, user.id),
          ),
        );

      if (existingRequest.length > 0) {
        return res.status(400).json({
          error: "You have already requested to join this team",
        });
      }

      await db
        .insert(teamJoinRequests)
        .values({ userId: user.id, teamId, note });

      return res.status(200).json({ message: "Added team join request" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error processing join request" });
    }
  },
);

export const withdrawTeamJoiningRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Invalid team id" });
    }

    try {
      const existingRequest = await db
        .select()
        .from(teamJoinRequests)
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.userId, user.id),
          ),
        );

      if (existingRequest.length === 0) {
        return res.status(400).json({
          error: "You have not requested to join this team",
        });
      }

      const request = existingRequest[0];

      if (!request) {
        return res.status(400).json({
          error: "Invalid request",
        });
      }

      if (request.status === "rejected") {
        return res.status(400).json({
          error: "Cannot withdraw a rejected request",
        });
      }

      const createdAtTime = request.createdAt.getTime();
      const now = Date.now();
      const timeElapsed = now - createdAtTime;

      if (timeElapsed < 1000 * 60 * 60 * 24) {
        return res.status(400).json({
          error: "You can only withdraw your request after 24 hours",
        });
      }

      await db
        .delete(teamJoinRequests)
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.userId, user.id),
          ),
        );

      return res.status(200).json({ message: "Withdrawn team join request" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error processing withdrawal" });
    }
  },
);

export const getTeamRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId } = req.params;

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!teamId) {
      return res.status(400).json({ error: "Invalid team id" });
    }

    try {
      const request = await db
        .select()
        .from(teamJoinRequests)
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.userId, user.id),
          ),
        );

      const hasRequested = request.length > 0;
      let canWithdraw = false;

      if (hasRequested) {
        const createdAtTime = request[0]?.createdAt.getTime();
        const now = Date.now();
        const timeElapsed = now - (createdAtTime ?? 0);

        if (timeElapsed >= 1000 * 60 * 60 * 24) {
          canWithdraw = true;
        }
      }

      return res.status(200).json({
        hasRequested,
        canWithdraw,
        request: hasRequested ? request[0] : null,
      });
    } catch (e) {
      console.error("Error checking join request status:", e);
      return res.status(500).json({ error: "Failed to fetch request status" });
    }
  },
);

export const getPendingTeamJoinRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Invalid team id" });
    }

    try {
      const requests = await db
        .select({
          id: teamJoinRequests.id,
          teamId: teamJoinRequests.teamId,
          userId: teamJoinRequests.userId,
          email: users.email,
          name: users.name,
          note: teamJoinRequests.note,
          createdAt: teamJoinRequests.createdAt,
        })
        .from(teamJoinRequests)
        .innerJoin(users, eq(teamJoinRequests.userId, users.id))
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.status, "pending"),
          ),
        );

      return res.status(200).json({ requests });
    } catch (e) {
      console.error("Error fetching pending join requests:", e);
      return res
        .status(500)
        .json({ error: "Failed to fetch pending requests" });
    }
  },
);

export const updateTeamJoinRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId, requestId } = req.params;
    const { status } = req.body;

    if (!teamId || !requestId || !status) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const team = await db
        .select()
        .from(teams)
        .where(and(eq(teams.id, teamId), eq(teams.leaderId, user.id)))
        .limit(1);

      if (!team.length) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this request" });
      }

      const updatedRequest = await db
        .update(teamJoinRequests)
        .set({ status })
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.id, requestId),
          ),
        )
        .returning({
          id: teamJoinRequests.id,
          userId: teamJoinRequests.userId,
          status: teamJoinRequests.status,
        });

      const request = updatedRequest[0];

      if (request?.status === "accepted") {
        await db.insert(teamMemberships).values({
          teamId,
          userId: request.userId,
        });
      }

      return res.status(200).json({ request });
    } catch (e) {
      console.error("Error updating join request status:", e);
      return res.status(500).json({ error: "Failed to update request status" });
    }
  },
);
