import bcrypt from "bcryptjs";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Reset Password (using OTP)
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const otpRecord = await OTP.findOne({
      where: { email, code: otp, type: "PASSWORD_RESET", isUsed: false },
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return sendResponse(res, 400, false, "Invalid or expired reset code");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return sendResponse(res, 404, false, "User not found");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await user.update({ passwordHash });

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    return sendResponse(res, 200, true, "Password reset successful. You can now login.");
  } catch (error) {
    logger.error("Reset Password Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
