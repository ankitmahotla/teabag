import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateTokens } from "../lib/tokens";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signIn = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing credential token" });
    }

    let payload;

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.warn("Invalid Google token:", verifyError);
      return res
        .status(401)
        .json({ error: "Invalid or malformed Google token" });
    }

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

    const { accessToken, refreshToken } = generateTokens({ id: user?.id! });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user });
  } catch (e) {
    console.error("Google sign-in error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
