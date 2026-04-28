import jwt from "jsonwebtoken";
import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { generateTokens } from "./auth.utils.js";

/**
 * @desc    Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, false, "Refresh token is required");

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret_key");
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return sendResponse(res, 401, false, "Invalid refresh token");

    const tokens = await generateTokens(user);
    return sendResponse(res, 200, true, "Token refreshed successfully", tokens);
  } catch (error) {
    logger.error("Refresh Token Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
