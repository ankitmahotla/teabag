import type { NextFunction, Request, Response } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  try {
    if (!user.role || user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
