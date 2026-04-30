import jwt from "jsonwebtoken";

/**
 * Helper to generate Tokens
 */
export const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || "refresh_secret_key_change_me",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};
