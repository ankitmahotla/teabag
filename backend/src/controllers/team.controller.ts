import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import {
  cohortMemberships,
  teamJoinRequests,
  teamKickHistory,
  teamLeaderTransfers,
  teamMemberships,
  teams,
  userInteractions,
  users,
} from "../db/schema";
import { and, eq, isNull, count, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const getAllTeams = asyncHandler(async (req: Request, res: Response) => {
  const cohortId = req.query.cohortId as string;

  if (!cohortId || typeof cohortId !== "string") {
    return res.status(400).json({ error: "CohortId is required" });
  }

  try {
    const teamsWithCount = await db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        cohortId: teams.cohortId,
        isPublished: teams.isPublished,
        createdAt: teams.createdAt,
        disbandedAt: teams.disbandedAt,
        memberCount: count().as("memberCount"),
      })
      .from(teams)
      .leftJoin(teamMemberships, eq(teams.id, teamMemberships.teamId))
      .where(
        and(
          eq(teams.cohortId, cohortId),
          eq(teams.isPublished, true),
          isNull(teams.disbandedAt),
          isNull(teamMemberships.leftAt),
        ),
      )
      .groupBy(teams.id);

    return res.status(200).json(teamsWithCount);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to retrieve teams" });
  }
});

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Team ID is required" });
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
      .where(
        and(
          eq(teams.id, id),
          isNull(teams.disbandedAt),
          isNull(teamMemberships.leftAt),
        ),
      );

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

    const cohortMembership = await db
      .select()
      .from(cohortMemberships)
      .where(
        and(
          eq(cohortMemberships.userId, user.id),
          eq(cohortMemberships.cohortId, cohortId),
        ),
      )
      .then((rows) => rows[0]);

    if (!cohortMembership) {
      return res.status(403).json({ error: "User is not part of the cohort" });
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

    await db.insert(userInteractions).values({
      userId: user.id,
      type: "team_created",
      teamId: newTeam.id,
      cohortId: newTeam.cohortId,
      note: `Created team "${name}"`,
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

      await db.insert(userInteractions).values({
        userId: user.id,
        type: newPublishState ? "team_published" : "team_unpublished",
        teamId: teamId,
        note: `Team ${newPublishState ? "published" : "unpublished"}`,
      });

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

      if (team.leaderId === user.id) {
        return res
          .status(400)
          .json({ error: "You cannot request to join your own team" });
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
        const existing = existingRequest[0];

        if (["pending", "accepted"].includes(existing.status)) {
          return res.status(400).json({
            error: `You already have a ${existing?.status} request to this team`,
          });
        }

        if (existing?.status === "withdrawn") {
          const withdrawAtTime = existing?.withdrawnAt?.getTime();
          const now = Date.now();
          const timeElapsed = now - (withdrawAtTime ?? 0);

          if (timeElapsed < 1000 * 60 * 60 * 24) {
            return res.status(400).json({
              error: "You can only send a rejoin request after 24 hours",
            });
          }

          const safeNote =
            typeof note === "string" ? note.trim().slice(0, 500) : null;

          await db
            .update(teamJoinRequests)
            .set({
              note: safeNote,
              status: "pending",
              withdrawnAt: null,
              createdAt: new Date(),
            })
            .where(eq(teamJoinRequests.id, existing.id));

          await db.insert(userInteractions).values({
            userId: user.id,
            type: "requested_join",
            teamId,
            cohortId,
            note,
          });

          return res
            .status(200)
            .json({ message: "Re-activated withdrawn request" });
        }

        if (existing?.status === "rejected") {
          return res.status(400).json({
            error:
              "Your request was rejected. You cannot reapply to this team.",
          });
        }
      }

      await db
        .insert(teamJoinRequests)
        .values({ userId: user.id, teamId, note });

      await db.insert(userInteractions).values({
        userId: user.id,
        type: "requested_join",
        teamId,
        cohortId,
        note,
      });

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

      if (request.status === "accepted") {
        return res.status(400).json({
          error: "Cannot withdraw an already accepted request",
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
        .update(teamJoinRequests)
        .set({
          withdrawnAt: new Date(),
          status: "withdrawn",
        })
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.userId, user.id),
          ),
        );

      await db.insert(userInteractions).values({
        userId: user.id,
        type: "withdrew_request",
        teamId,
        note: "User withdrew join request after 24h",
      });

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
        .innerJoin(teams, eq(teamJoinRequests.teamId, teams.id))
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.status, "pending"),
            isNull(teams.disbandedAt),
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

      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      if (request?.status === "accepted") {
        const existingMembership = await db
          .select()
          .from(teamMemberships)
          .where(
            and(
              eq(teamMemberships.userId, request.userId),
              eq(teamMemberships.teamId, teamId),
            ),
          );

        if (existingMembership.length === 0) {
          const activeMembers = await db
            .select()
            .from(teamMemberships)
            .where(
              and(
                eq(teamMemberships.teamId, teamId),
                isNull(teamMemberships.leftAt),
              ),
            );

          if (activeMembers.length >= 4 && status === "accepted") {
            return res.status(400).json({
              error: "Cannot accept request — team is already full",
            });
          }

          await db.insert(teamMemberships).values({
            teamId,
            userId: request.userId,
          });

          await db.insert(userInteractions).values({
            userId: request.userId,
            type: "joined_team",
            teamId,
            note: "User joined team after request was accepted",
          });
        }
      }

      await db.insert(userInteractions).values({
        userId: request.userId,
        relatedUserId: user.id,
        type: status === "accepted" ? "accepted_request" : "rejected_request",
        teamId,
        note: `Request ${status} by leader`,
      });

      return res.status(200).json({ request });
    } catch (e) {
      console.error("Error updating join request status:", e);
      return res.status(500).json({ error: "Failed to update request status" });
    }
  },
);

export const disbandTeam = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { teamId } = req.params;
  const { reason } = req.body;

  if (!teamId) {
    return res.status(400).json({ error: "Missing teamId" });
  }

  if (!reason || reason.trim().length === 0) {
    return res.status(400).json({ error: "Disband reason is required" });
  }

  try {
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.leaderId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the team leader can disband the team" });
    }

    await db.transaction(async (tx) => {
      await tx
        .update(teams)
        .set({
          disbandedAt: new Date(),
          disbandReason: reason,
        })
        .where(eq(teams.id, teamId));

      await tx
        .update(teamMemberships)
        .set({
          leftAt: new Date(),
          leftReason: `Disbanded by leader: ${user.name}`,
        })
        .where(eq(teamMemberships.teamId, teamId));

      await tx
        .update(teamJoinRequests)
        .set({
          status: "withdrawn",
          withdrawnAt: new Date(),
        })
        .where(
          and(
            eq(teamJoinRequests.teamId, teamId),
            eq(teamJoinRequests.status, "pending"),
          ),
        );

      await tx.insert(userInteractions).values({
        userId: user.id,
        type: "disbanded_team",
        teamId,
        note: `Team '${team.name}' disbanded by ${user.name}. Reason: ${reason}`,
        createdAt: new Date(),
      });
    });

    return res.status(200).json({ message: "Team disbanded successfully" });
  } catch (e) {
    console.error("Error disbanding team:", e);
    return res.status(500).json({ error: "Failed to disband team" });
  }
});

export const kickTeamMember = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { teamId } = req.params;
    const { teamMemberId, reason } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "Team ID is required" });
    }

    if (!teamMemberId || !reason) {
      return res
        .status(400)
        .json({ error: "Team member ID and reason are required" });
    }

    try {
      const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      const [teamMember] = await db
        .select({
          name: users.name,
          email: users.email,
        })
        .from(teamMemberships)
        .innerJoin(users, eq(teamMemberships.userId, users.id))
        .where(
          and(
            eq(teamMemberships.userId, teamMemberId),
            eq(teamMemberships.teamId, teamId),
          ),
        );

      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }

      if (user.id !== team.leaderId) {
        return res.status(403).json({
          error: "You do not have permission to kick this team member",
        });
      }

      await db.insert(teamKickHistory).values({
        teamId,
        kickedUserId: teamMemberId,
        kickedById: user.id,
        reason,
      });

      await db
        .update(teamMemberships)
        .set({ leftAt: new Date(), leftReason: reason })
        .where(
          and(
            eq(teamMemberships.userId, teamMemberId),
            eq(teamMemberships.teamId, teamId),
          ),
        );

      await db.insert(userInteractions).values({
        userId: user.id,
        type: "kicked_team_member",
        teamId,
        relatedUserId: teamMemberId,
        note: reason,
      });

      return res
        .status(200)
        .json({ message: "Team member kicked successfully" });
    } catch (error) {
      console.error("Error kicking team member:", error);
      return res.status(500).json({ error: "Failed to kick team member" });
    }
  },
);

export const getTeamMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Team ID is required" });
    }

    try {
      const [team] = await db.select().from(teams).where(eq(teams.id, teamId));

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      const members = await db
        .select({
          id: teamMemberships.id,
          userId: teamMemberships.userId,
          name: users.name,
          email: users.email,
        })
        .from(teamMemberships)
        .innerJoin(users, eq(teamMemberships.userId, users.id))
        .where(
          and(
            eq(teamMemberships.teamId, teamId),
            isNull(teamMemberships.leftAt),
          ),
        );

      return res.status(200).json({ members });
    } catch (e) {
      console.error("Error fetching team members:", e);
      return res.status(500).json({ error: "Failed to fetch team members" });
    }
  },
);

export const teamLeadershipTransferRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const { teamId } = req.params;
    const { receiverId, reason } = req.body;

    if (!teamId || !receiverId || !reason) {
      console.log(
        "teamId:",
        teamId,
        "receiverId:",
        receiverId,
        "reason:",
        reason,
      );
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const [team] = await db
        .select()
        .from(teams)
        .where(and(eq(teams.id, teamId), isNull(teams.disbandedAt)));

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      const [receiver] = await db
        .select()
        .from(users)
        .leftJoin(
          teamMemberships,
          and(
            eq(users.id, teamMemberships.userId),
            eq(teamMemberships.teamId, teamId),
            isNull(teamMemberships.leftAt),
          ),
        )
        .where(eq(users.id, receiverId));

      if (!receiver || !receiver.team_memberships) {
        return res
          .status(400)
          .json({ error: "Receiver is not an active team member" });
      }

      const [leaderCheck] = await db
        .select()
        .from(teams)
        .where(and(eq(teams.id, teamId), eq(teams.leaderId, user.id)));

      if (!leaderCheck) {
        return res
          .status(403)
          .json({ error: "Only the team leader can request a transfer" });
      }

      const existingRequest = await db
        .select()
        .from(teamLeaderTransfers)
        .where(
          and(
            eq(teamLeaderTransfers.teamId, teamId),
            isNull(teamLeaderTransfers.respondedAt),
          ),
        );

      if (existingRequest.length > 0) {
        return res.status(409).json({
          error: "There is already a pending leadership transfer request",
        });
      }

      await db.insert(teamLeaderTransfers).values({
        teamId,
        fromUserId: user.id,
        toUserId: receiverId,
        reason,
      });

      return res
        .status(200)
        .json({ message: "Leadership transfer request submitted" });
    } catch (e) {
      console.error("Error requesting leadership transfer:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export const teamLeadershipTransferResponse = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { transferRequestId, status } = req.body;

    if (!transferRequestId) {
      return res.status(400).json({ error: "Transfer request ID is required" });
    }

    const validStatuses = ["accepted", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    try {
      const [transferRequest] = await db
        .select()
        .from(teamLeaderTransfers)
        .where(eq(teamLeaderTransfers.id, transferRequestId));

      if (!transferRequest) {
        return res.status(404).json({ error: "Transfer request not found" });
      }

      const isRequester = user.id === transferRequest.fromUserId;
      const isReceiver = user.id === transferRequest.toUserId;

      if (transferRequest.status !== "pending" || transferRequest.respondedAt) {
        return res
          .status(400)
          .json({ error: "Transfer request has already been responded to" });
      }

      if (status === "cancelled") {
        if (!isRequester) {
          return res
            .status(403)
            .json({ error: "Only the team leader can cancel the request" });
        }

        await db
          .update(teamLeaderTransfers)
          .set({ status: "cancelled", respondedAt: new Date() })
          .where(eq(teamLeaderTransfers.id, transferRequestId));

        await db.insert(userInteractions).values({
          userId: transferRequest.fromUserId,
          type: "leadership_transfer_cancelled_by_requester",
          teamId: transferRequest.teamId,
          cohortId: transferRequest.cohortId,
          relatedUserId: transferRequest.toUserId,
          note: "User cancelled leadership transfer request",
        });

        return res
          .status(200)
          .json({ message: "Leadership transfer request was cancelled" });
      }

      if (!isReceiver) {
        return res.status(403).json({
          error: "Only the requested receiver can respond to this transfer",
        });
      }

      if (status === "accepted") {
        await db
          .update(teams)
          .set({ leaderId: user.id })
          .where(eq(teams.id, transferRequest.teamId));

        await db.insert(userInteractions).values({
          userId: transferRequest.toUserId,
          type: "promoted_to_leader",
          teamId: transferRequest.teamId,
          cohortId: transferRequest.cohortId,
          note: `User was promoted to leader of teamId: ${transferRequest.teamId}`,
        });
      }

      await db
        .update(teamLeaderTransfers)
        .set({ status, respondedAt: new Date() })
        .where(eq(teamLeaderTransfers.id, transferRequestId));

      await db.insert(userInteractions).values({
        userId: transferRequest.toUserId,
        type: `${status}_leadership_transfer_request`,
        teamId: transferRequest.teamId,
        cohortId: transferRequest.cohortId,
        relatedUserId: transferRequest.fromUserId,
        note: `User ${status} team leadership request of teamId: ${transferRequest.teamId}`,
      });

      return res
        .status(200)
        .json({ message: `Leadership transfer request was ${status}` });
    } catch (e) {
      console.error("Error responding to leadership transfer request:", e);
      return res
        .status(500)
        .json({ error: "Error responding to leadership transfer request" });
    }
  },
);

export const getPendingTeamLeadershipTransferRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const fromUser = alias(users, "fromUser");
    const toUser = alias(users, "toUser");

    try {
      const requests = await db
        .select({
          id: teamLeaderTransfers.id,
          teamId: teamLeaderTransfers.teamId,
          fromUserId: teamLeaderTransfers.fromUserId,
          toUserId: teamLeaderTransfers.toUserId,
          status: teamLeaderTransfers.status,
          reason: teamLeaderTransfers.reason,
          createdAt: teamLeaderTransfers.createdAt,
          respondedAt: teamLeaderTransfers.respondedAt,
          fromUserName: fromUser.name,
          toUserName: toUser.name,
        })
        .from(teamLeaderTransfers)
        .leftJoin(fromUser, eq(fromUser.id, teamLeaderTransfers.fromUserId))
        .leftJoin(toUser, eq(toUser.id, teamLeaderTransfers.toUserId))
        .where(
          and(
            eq(teamLeaderTransfers.status, "pending"),
            or(
              eq(teamLeaderTransfers.fromUserId, user.id),
              eq(teamLeaderTransfers.toUserId, user.id),
            ),
          ),
        );

      return res.status(200).json({ requests });
    } catch (e) {
      console.error("Error fetching pending leadership transfer requests:", e);
      return res
        .status(500)
        .json({ error: "Failed to fetch transfer requests" });
    }
  },
);
