import { db } from "../db";
import { teamNoticeBoard, teams } from "../db/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { asyncHandler } from "../utils/async-handler";
import { logError } from "../utils/logError";

async function isTeamLeader(teamId: string, userId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  if (result.length === 0) return false;
  return result[0]?.leaderId === userId;
}

export const createNotice = asyncHandler(async (req, res) => {
  const { teamId, message, postedBy } = req.body;

  if (
    !teamId ||
    !postedBy ||
    typeof message !== "string" ||
    message.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const isLeader = await isTeamLeader(teamId, postedBy);
    if (!isLeader) {
      return res
        .status(403)
        .json({ error: "Only the team leader can post notices" });
    }

    const newNotice = await db
      .insert(teamNoticeBoard)
      .values({ teamId, message, postedBy })
      .returning();

    res.status(201).json(newNotice[0]);
  } catch (e) {
    logError("Error creating notice:", e);
    res.status(500).json({ error: "Failed to create notice" });
  }
});

export const updateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, postedBy } = req.body;

  if (
    !id ||
    typeof message !== "string" ||
    message.trim() === "" ||
    !postedBy
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const [notice] = await db
      .select({ teamId: teamNoticeBoard.teamId })
      .from(teamNoticeBoard)
      .where(eq(teamNoticeBoard.id, id))
      .limit(1);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    const isLeader = await isTeamLeader(notice.teamId, postedBy);
    if (!isLeader) {
      return res
        .status(403)
        .json({ error: "Only the team leader can update notices" });
    }

    const updated = await db
      .update(teamNoticeBoard)
      .set({ message })
      .where(eq(teamNoticeBoard.id, id))
      .returning();

    res.status(200).json(updated[0]);
  } catch (e) {
    logError("Error updating notice:", e);
    res.status(500).json({ error: "Failed to update notice" });
  }
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { postedBy } = req.body;

  if (!id || !postedBy) {
    return res
      .status(400)
      .json({ error: "Notice ID and postedBy are required" });
  }

  try {
    const [notice] = await db
      .select({ teamId: teamNoticeBoard.teamId })
      .from(teamNoticeBoard)
      .where(eq(teamNoticeBoard.id, id))
      .limit(1);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    const isLeader = await isTeamLeader(notice.teamId, postedBy);
    if (!isLeader) {
      return res
        .status(403)
        .json({ error: "Only the team leader can delete notices" });
    }

    await db
      .delete(teamNoticeBoard)
      .where(eq(teamNoticeBoard.id, id))
      .returning();

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (e) {
    logError("Error deleting notice:", e);
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

export const getNoticesByTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;
  const cursor = req.query.cursor as string | undefined;

  if (!teamId) {
    return res.status(400).json({ error: "Team ID is required" });
  }

  try {
    const conditions = [eq(teamNoticeBoard.teamId, teamId)];

    if (cursor) {
      conditions.push(lt(teamNoticeBoard.createdAt, new Date(cursor)));
    }

    const results = await db
      .select()
      .from(teamNoticeBoard)
      .where(and(...conditions))
      .orderBy(desc(teamNoticeBoard.createdAt))
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
    logError("Error fetching notices:", e);
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});
