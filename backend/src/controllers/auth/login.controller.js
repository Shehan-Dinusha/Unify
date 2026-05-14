import bcrypt from "bcryptjs";
import { User, StudentProfile, BusinessProfile, ClubProfile } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { generateTokens } from "./auth.utils.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

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
        searchCriteria = { email: identifier };
      } else {
        searchCriteria = { phone: identifier };
      }
    } else {
      searchCriteria = email ? { email } : { phone };
    }

    // Find user
    const user = await User.findOne({ where: searchCriteria });

    if (!user) return sendResponse(res, 401, false, "Invalid credentials");
    if (!user.isVerified) return sendResponse(res, 403, false, "Please verify your account first");
    if (user.status === "Deleted") return sendResponse(res, 401, false, "This account has been deleted");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokens(user);
    const avatar = await resolveAvatarUrl(user.avatar, user.name);

    let profileData = {};
    if (user.role === "Student") {
      const studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
      if (studentProfile) profileData = { isBatchRep: studentProfile.isBatchRep };
    } else if (user.role === "Business") {
      const businessProfile = await BusinessProfile.findOne({ where: { userId: user.id } });
      if (businessProfile) profileData = { category: businessProfile.category };
    } else if (user.role === "Club") {
      const clubProfile = await ClubProfile.findOne({ where: { userId: user.id } });
      if (clubProfile) profileData = { stripeAccountId: clubProfile.stripeAccountId };
    }

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
