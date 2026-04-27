import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User, OTP } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { Op } from "sequelize";
import { sendEmailOTP } from "../../services/email.service.js";
import { sendSMSOTP } from "../../services/sms.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      const identifier = existingUser.email === email ? "email" : "phone number";
      return sendResponse(res, 400, false, `User already exists with this ${identifier}`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      isVerified: false,
    });

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      email,
      phone,
      code: otpCode,
      expiresAt,
      type: "REGISTRATION",
    });

    if (email) {
      await sendEmailOTP(email, otpCode);
    } else if (phone) {
      await sendSMSOTP(phone, otpCode);
    }

    return sendResponse(res, 201, true, "Registration successful. Please verify your account with the OTP sent.", {
      userId: user.id,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    logger.error("Register Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};
