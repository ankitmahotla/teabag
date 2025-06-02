import type { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "../utils/verify-token";
import { asyncHandler } from "../utils/async-handler";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      const { id } = verifyToken(token);

      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  },
);
