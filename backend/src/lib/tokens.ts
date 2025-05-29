import jwt from "jsonwebtoken";

export const generateTokens = ({ id }: { id: string }) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
