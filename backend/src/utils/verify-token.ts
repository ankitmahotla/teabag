import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const verifyToken = (token: string): { id: string } => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded !== "object" || !("id" in decoded)) {
    throw new Error("Invalid token payload");
  }
  return decoded as { id: string };
};
