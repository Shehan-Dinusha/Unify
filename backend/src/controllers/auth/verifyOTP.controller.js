import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { generateTokens } from "./auth.utils.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import { normalizePhone } from "../../utils/phone.util.js";
import { phoneWhere } from "../../utils/phoneWhere.util.js";

/**
 * @desc    Verify OTP (Registration)
 * @route   POST /api/auth/verify-otp
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const normalizedPhone = phone ? normalizePhone(phone) : null;

    const otpRecord = await OTP.findOne({
      where: {
        ...(email ? { email } : { phone: normalizedPhone }),
        type: "REGISTRATION",
        isUsed: false,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) return sendResponse(res, 400, false, "Invalid or expired OTP");
    if (new Date() > otpRecord.expiresAt) return sendResponse(res, 400, false, "OTP has expired");
    if (otpRecord.code !== otp) return sendResponse(res, 400, false, "Incorrect OTP code");

    otpRecord.isUsed = true;
    await otpRecord.save();
    await otpRecord.destroy(); // Remove immediately — no longer needed after verification


    const user = await User.findOne({ where: email ? { email } : phoneWhere(phone) });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const avatar = await resolveAvatarUrl(user.avatar, user.name);
    return sendResponse(res, 200, true, "Account verified successfully", {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role, avatar },
    });
  } catch (error) {
    logger.error("Verify OTP Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
