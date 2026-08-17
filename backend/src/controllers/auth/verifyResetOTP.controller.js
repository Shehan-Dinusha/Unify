import { OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { normalizePhone } from "../../utils/phone.util.js";
import { phoneWhere } from "../../utils/phoneWhere.util.js";

/**
 * @desc    Verify Reset OTP
 * @route   POST /api/auth/verify-reset-otp
 * Supports both email and phone number.
 */
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const normalizedPhone = phone ? normalizePhone(phone) : null;
    // Plain object for OTP queries (OTPs are stored with normalized phones)
    const otpWhere = email ? { email } : { phone: normalizedPhone };

    const otpRecord = await OTP.findOne({
      where: { ...otpWhere, code: otp, type: "PASSWORD_RESET", isUsed: false },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return sendResponse(res, 400, false, "Invalid or expired reset code");
    }

    return sendResponse(res, 200, true, "Reset code verified successfully. You can now reset your password.");
  } catch (error) {
    logger.error("Verify Reset OTP Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
