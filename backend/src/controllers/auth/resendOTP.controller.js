import crypto from "crypto";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { sendEmailOTP } from "../../services/email.service.js";
import { sendSMSOTP } from "../../services/sms.service.js";
import { normalizePhone } from "../../utils/phone.util.js";
import { phoneWhere } from "../../utils/phoneWhere.util.js";

/**
 * @desc    Resend OTP
 */
export const resendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const normalizedPhone = phone ? normalizePhone(phone) : null;
    const user = await User.findOne({ where: email ? { email } : phoneWhere(phone) });

    if (!user) return sendResponse(res, 404, false, "User not found");
    if (user.isVerified) return sendResponse(res, 400, false, "Account already verified");

    const lastOtp = await OTP.findOne({
      where: { ...(email ? { email } : { phone: normalizedPhone }), type: "REGISTRATION" },
      order: [["createdAt", "DESC"]],
    });

    if (lastOtp) {
      const timeDiff = (new Date() - new Date(lastOtp.createdAt)) / 1000;
      if (timeDiff < 60) return sendResponse(res, 429, false, `Please wait ${Math.ceil(60 - timeDiff)} seconds`);
    }

    await OTP.update({ isUsed: true }, { where: { ...(email ? { email } : { phone: normalizedPhone }), type: "REGISTRATION", isUsed: false } });

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, phone: normalizedPhone, code: otpCode, expiresAt, type: "REGISTRATION" });

    if (email) await sendEmailOTP(email, otpCode);
    else if (normalizedPhone) await sendSMSOTP(normalizedPhone, otpCode);

    return sendResponse(res, 200, true, "New verification code sent");
  } catch (error) {
    logger.error("Resend OTP Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
