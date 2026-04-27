import crypto from "crypto";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { sendPasswordResetOTP } from "../../services/email.service.js";

/**
 * @desc    Forgot Password (OTP-based)
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendResponse(res, 200, true, "If your email is registered, you will receive a code shortly.");
    }

    // Cooldown check (60 seconds)
    const lastOtp = await OTP.findOne({
      where: { email, type: "PASSWORD_RESET" },
      order: [["createdAt", "DESC"]],
    });
    if (lastOtp && (new Date() - new Date(lastOtp.createdAt)) / 1000 < 60) {
      return sendResponse(res, 429, false, "Please wait before requesting another code.");
    }

    // Invalidate previous reset OTPs
    await OTP.update({ isUsed: true }, { where: { email, type: "PASSWORD_RESET", isUsed: false } });

    // Generate numeric OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
      email,
      code: otpCode,
      expiresAt,
      type: "PASSWORD_RESET",
    });

    await sendPasswordResetOTP(email, otpCode);

    return sendResponse(res, 200, true, "Password reset code sent successfully");
  } catch (error) {
    logger.error("Forgot Password Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
