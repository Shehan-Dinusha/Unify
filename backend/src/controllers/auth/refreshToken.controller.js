import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User, UserSession } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { hashToken } from "./auth.utils.js";

/**
 * @desc    Refresh access token using a valid session refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 *
 * Design: One row per session — the same row is UPDATED on each successful
 * refresh (tokenHash + expiresAt are rotated in-place). No new rows are added.
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return sendResponse(res, 400, false, "Refresh token is required");

    // 1. Verify the JWT signature / expiry first (cheap, no DB hit).
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret_key"
      );
    } catch {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    const now = new Date();
    const incomingHash = hashToken(refreshToken);

    // 2. Look up the specific session: must match hash, not revoked, not expired.
    const session = await UserSession.findOne({
      where: {
        userId: decoded.id,
        tokenHash: incomingHash,
        revokedAt: null,
        expiresAt: { [Op.gt]: now },
      },
    });

    if (!session) return sendResponse(res, 401, false, "Invalid refresh token");

    // 3. Confirm the user account is still valid.
    const user = await User.findByPk(decoded.id);
    if (!user || user.status === "Deleted" || user.status === "Suspended") {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    // 4. Issue a new access token.
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    );

    // 5. Issue a new refresh token.
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    const refreshExpiresInMs = parseExpiryToMs(
      process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    );

    // 6. Rotate in-place: update the SAME session row (no new row created).
    await session.update({
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + refreshExpiresInMs),
    });

    return sendResponse(res, 200, true, "Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("Refresh Token Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};

/**
 * Converts a JWT expiry string like "7d", "15m", "1h" into milliseconds.
 */
function parseExpiryToMs(expiry) {
  const match = String(expiry).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[unit];
}
