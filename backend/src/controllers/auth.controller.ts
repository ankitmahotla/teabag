import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateTokens } from "../lib/tokens";
import { verifyToken } from "../utils/verifyToken";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: "postmessage",
});

export const signIn = async (req: Request, res: Response) => {
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
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId));

    let user = existingUser;

    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          googleId,
          email,
          name,
        })
        .returning();

      user = newUser;
    } else {
      await db
        .update(usersTable)
        .set({ lastLoginAt: new Date() })
        .where(eq(usersTable.id, user.id));
    }

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

    return res.status(200).json({ user });
  } catch (e) {
    console.error("Google sign-in error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
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
    console.error("Logout failed:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  const token = refreshToken;

  try {
    const { id } = verifyToken(token);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    return res.status(200).json({ user });
  } catch (e) {
    console.error("Token refresh failed:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
