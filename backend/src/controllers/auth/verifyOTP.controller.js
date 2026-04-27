import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { generateTokens } from "./auth.utils.js";

/**
 * @desc    Verify OTP (Registration)
 * @route   POST /api/auth/verify-otp
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    const otpRecord = await OTP.findOne({
      where: {
        ...(email ? { email } : { phone }),
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

    const user = await User.findOne({ where: email ? { email } : { phone } });
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    return sendResponse(res, 200, true, "Account verified successfully", {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role },
    });
  } catch (error) {
    logger.error("Verify OTP Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
