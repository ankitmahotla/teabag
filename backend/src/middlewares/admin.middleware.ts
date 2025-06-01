import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    try {
      if (!user.role || user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  },
);
