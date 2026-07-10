import crypto from "crypto";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { sendPasswordResetOTP } from "../../services/email.service.js";
import { sendSMSOTP } from "../../services/sms.service.js";
import { normalizePhone } from "../../utils/phone.util.js";

/**
 * @desc    Forgot Password (OTP-based)
 * @route   POST /api/auth/forgot-password
 * Supports both email and phone number.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const normalizedPhone = phone ? normalizePhone(phone) : null;
    const whereClause = email ? { email } : { phone: normalizedPhone };

    const user = await User.findOne({ where: whereClause });

    // Generic response to prevent user enumeration
    if (!user) {
      return sendResponse(res, 200, true, "If your account is registered, you will receive a code shortly.");
    }

    // Cooldown check (60 seconds)
    const lastOtp = await OTP.findOne({
      where: { ...whereClause, type: "PASSWORD_RESET" },
      order: [["createdAt", "DESC"]],
    });
    if (lastOtp && (new Date() - new Date(lastOtp.createdAt)) / 1000 < 60) {
      return sendResponse(res, 429, false, "Please wait before requesting another code.");
    }

    // Invalidate previous reset OTPs
    await OTP.update({ isUsed: true }, { where: { ...whereClause, type: "PASSWORD_RESET", isUsed: false } });

    // Generate numeric OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({ ...whereClause, code: otpCode, expiresAt, type: "PASSWORD_RESET" });

    // Send via the appropriate channel
    if (email) {
      await sendPasswordResetOTP(email, otpCode);
    } else if (normalizedPhone) {
      await sendSMSOTP(normalizedPhone, otpCode);
    }

    return sendResponse(res, 200, true, "Password reset code sent successfully");
  } catch (error) {
    logger.error("Forgot Password Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
