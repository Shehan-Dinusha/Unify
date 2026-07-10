import bcrypt from "bcryptjs";
import { User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { generateTokens } from "./auth.utils.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import { getRoleProfileData } from "../../services/roleProfile.service.js";
import { normalizePhone } from "../../utils/phone.util.js";

/**
 * @desc    Login user
 */
export const login = async (req, res) => {
  try {
    const { email, phone, identifier, password } = req.body;

    // Handshake Fix: Handle single 'identifier' field from frontend
    let searchCriteria;
    if (identifier) {
      if (identifier.includes("@")) {
        searchCriteria = { email: identifier.trim() };
      } else {
        searchCriteria = { phone: normalizePhone(identifier) };
      }
    } else {
      searchCriteria = email ? { email: email.trim() } : { phone: normalizePhone(phone) };
    }

    // Find user
    const user = await User.findOne({ where: searchCriteria });

    if (!user) return sendResponse(res, 401, false, "Invalid credentials");
    if (!user.isVerified) return sendResponse(res, 403, false, "Please verify your account first");
    if (user.status === "Deleted") return sendResponse(res, 401, false, "This account has been deleted");
    if (user.status === "Suspended") return sendResponse(res, 403, false, "Account is suspended");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokens(user);
    const avatar = await resolveAvatarUrl(user.avatar, user.name);

    const profileData = await getRoleProfileData(user);

    return sendResponse(res, 200, true, "Login successful", {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role, avatar, ...profileData },
    });
  } catch (error) {
    logger.error("Login Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
