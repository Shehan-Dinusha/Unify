import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserSession } from "../../modules/index.js";

/**
 * Returns the SHA-256 hex digest of a token string.
 * This is stored in user_sessions instead of the raw token.
 */
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Generates a new access + refresh token pair and creates a session row.
 *
 * One persistent session row is created per login. Subsequent refreshes
 * UPDATE that same row (see refreshToken.controller.js) rather than adding
 * new rows, so session count stays stable.
 *
 * @param {object} user - Sequelize User instance (must have id and role)
 * @param {object} [req={}] - Express request (used to capture user-agent/IP)
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export const generateTokens = async (user, req = {}) => {
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

  // Parse expiry duration from env so expiresAt matches the JWT claim.
  const refreshExpiresInMs = parseExpiryToMs(
    process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  );

  await UserSession.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    userAgent: req.headers?.["user-agent"] ?? null,
    ipAddress: req.ip ?? null,
    expiresAt: new Date(Date.now() + refreshExpiresInMs),
  });

  return { accessToken, refreshToken };
};

/**
 * Converts a JWT expiry string like "7d", "15m", "1h" into milliseconds.
 * Falls back to 7 days if the format is not recognised.
 */
function parseExpiryToMs(expiry) {
  const match = String(expiry).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[unit];
}
