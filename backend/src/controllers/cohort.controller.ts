import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../db";
import { cohortMemberships, cohorts } from "../db/schema";
import { eq } from "drizzle-orm";

export const getUserCohorts = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    try {
      const userCohorts = await db
        .select()
        .from(cohortMemberships)
        .where(eq(cohortMemberships.userId, user.id));

      if (!userCohorts || userCohorts.length === 0) {
        return res
          .status(404)
          .json({ error: "User is not a part of any cohorts" });
      }

      let cohortsDetails = [];

      for (const cohortMembership of userCohorts) {
        const [cohortDetail] = await db
          .select()
          .from(cohorts)
          .where(eq(cohorts.id, cohortMembership.cohortId));
        cohortsDetails.push(cohortDetail);
      }

      return res.status(200).json({ cohortsDetails });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
);
