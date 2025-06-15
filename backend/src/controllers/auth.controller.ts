import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateTokens } from "../lib/tokens";
import { verifyToken } from "../utils/verify-token";
import { asyncHandler } from "../utils/async-handler";
import { logError } from "../utils/logError";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: "postmessage",
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      return res
        .status(400)
        .json({ error: "Missing ID token in exchange response" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(400).json({ error: "Incomplete token payload" });
    }

    const { sub: googleId, email, name } = payload;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    let user = existingUser;

    if (!user) {
      return res
        .status(403)
        .json({ error: "Access denied: not part of Chaicode platform" });
    } else if (user.lastLoginAt === null) {
      const safeName = name?.trim() || "Unknown User";

      await db
        .update(users)
        .set({
          googleId,
          email,
          name: safeName,
          lastLoginAt: new Date(),
        })
        .where(eq(users.id, user.id));
    } else {
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
    }

    user = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .then((rows) => rows[0]);

    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user.id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user?.name,
        role: user.role,
      },
    });
  } catch (e) {
    logError("Google sign-in error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const signOut = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    logError("Logout failed:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const refreshTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token" });
    }

    const token = refreshToken;

    try {
      const { id } = verifyToken(token);

      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) {
        return res.status(401).json({ error: "Invalid user session" });
      }

      const { accessToken, refreshToken } = generateTokens({ id: user.id });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user?.name,
          role: user.role,
        },
      });
    } catch (e) {
      logError("Token refresh failed:", e);
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }
  },
);
