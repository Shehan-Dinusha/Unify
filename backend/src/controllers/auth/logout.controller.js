import jwt from "jsonwebtoken";
import { UserSession } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { hashToken } from "./auth.utils.js";

/**
 * @desc    Logout current session only
 * @route   POST /api/v1/auth/logout
 * @access  Public (refresh token in body identifies the session)
 *
 * Always returns 200. If the token is already invalid / expired the client
 * is effectively already logged out, so no error is surfaced.
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse(res, 200, true, "Logged out successfully");
    }

    // Decode without throwing — we only need the userId for the DB lookup.
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret_key"
      );
    } catch {
      // Token is already invalid — client is effectively logged out.
      return sendResponse(res, 200, true, "Logged out successfully");
    }

    const tokenHash = hashToken(refreshToken);

    // Revoke only this specific session row.
    await UserSession.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: decoded.id,
          tokenHash,
          revokedAt: null,
        },
      }
    );

    return sendResponse(res, 200, true, "Logged out successfully");
  } catch (error) {
    logger.error("Logout Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};

/**
 * @desc    Logout all sessions for the authenticated user
 * @route   POST /api/v1/auth/logout-all
 * @access  Private (requires valid access token via protect middleware)
 */
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;

    await UserSession.update(
      { revokedAt: new Date() },
      {
        where: {
          userId,
          revokedAt: null,
        },
      }
    );

    return sendResponse(res, 200, true, "All sessions logged out successfully");
  } catch (error) {
    logger.error("Logout All Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};
