import bcrypt from "bcryptjs";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { normalizePhone } from "../../utils/phone.util.js";
import { phoneWhere } from "../../utils/phoneWhere.util.js";

/**
 * @desc    Reset Password (using OTP)
 * @route   POST /api/auth/reset-password
 * Supports both email and phone number.
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, password } = req.body;
    const normalizedPhone = phone ? normalizePhone(phone) : null;
    // Space-insensitive lookup for the Users table
    const userWhere = email ? { email } : phoneWhere(phone);
    // Plain object for OTP queries (OTPs are stored with normalized phones)
    const otpWhere = email ? { email } : { phone: normalizedPhone };

    const otpRecord = await OTP.findOne({
      where: { ...otpWhere, code: otp, type: "PASSWORD_RESET", isUsed: false },
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return sendResponse(res, 400, false, "Invalid or expired reset code");
    }

    const user = await User.findOne({ where: userWhere });
    if (!user) return sendResponse(res, 404, false, "User not found");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await user.update({ passwordHash });

    // Mark used then immediately delete — password reset complete, OTP no longer needed
    otpRecord.isUsed = true;
    await otpRecord.save();
    await otpRecord.destroy();

    return sendResponse(res, 200, true, "Password reset successful. You can now login.");
  } catch (error) {
    logger.error("Reset Password Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
