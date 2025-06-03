import type { Request, Response } from "express";
import fs from "fs/promises";
import { parseCSV } from "../utils/parse-csv";
import { db } from "../db";
import { cohortMemberships, cohorts, users } from "../db/schema";
import { asyncHandler } from "../utils/async-handler";
import { inArray } from "drizzle-orm";

export const uploadStudentCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const { uniqueEmails, uniqueCohorts, emailCohortRelationships } =
        await parseCSV(file.path);

      const emailRows = uniqueEmails.map((email: string) => ({ email }));
      const cohortRows = uniqueCohorts.map((cohort: string) => ({
        name: cohort,
      }));

      let existingUsers = await db
        .select()
        .from(users)
        .where(inArray(users.email, uniqueEmails));

      const uploadedUsers = await db
        .insert(users)
        .values(emailRows)
        .onConflictDoNothing()
        .returning();

      existingUsers.push(...uploadedUsers);

      let existingCohorts = await db
        .select()
        .from(cohorts)
        .where(inArray(cohorts.name, uniqueCohorts));

      const uploadedCohorts = await db
        .insert(cohorts)
        .values(cohortRows)
        .onConflictDoNothing()
        .returning();

      existingCohorts.push(...uploadedCohorts);

      for (const item of emailCohortRelationships) {
        const userId = existingUsers.find(
          (user) => user.email === item.email,
        )?.id;
        const cohortId = existingCohorts.find(
          (cohort) => cohort.name === item.cohort,
        )?.id;

        if (userId && cohortId) {
          console.log(userId, cohortId);
          await db
            .insert(cohortMemberships)
            .values({ userId, cohortId })
            .onConflictDoNothing();
        }
      }

      return res
        .status(200)
        .json({ message: `Uploaded ${uniqueEmails.length} emails` });
    } catch (error: any) {
      console.error("Error uploading student emails:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    } finally {
      fs.unlink(file.path).catch((err) =>
        console.warn("Failed to delete uploaded CSV file:", err),
      );
    }
  },
);
