import type { Request, Response } from "express";
import fs from "fs/promises";
import { parseCSV } from "../utils/parse-csv";
import { db } from "../db";
import { users } from "../db/schema";
import { asyncHandler } from "../utils/async-handler";

export const uploadStudentCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const uniqueEmails = await parseCSV(file.path);

      const emailRows = uniqueEmails.map((email: string) => ({ email }));

      await db.insert(users).values(emailRows).onConflictDoNothing();

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
