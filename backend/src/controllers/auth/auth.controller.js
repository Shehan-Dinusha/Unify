import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, OTP } from "../modules/index.js";
import { sendResponse } from "../utils/response.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";
import { sendEmailOTP, sendPasswordResetOTP } from "../services/email.service.js";
import { sendSMSOTP } from "../services/sms.service.js";

// Helper to generate Tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || "refresh_secret_key_change_me",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

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

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return sendResponse(res, 401, false, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokens(user);
    return sendResponse(res, 200, true, "Login successful", {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role },
    });
  } catch (error) {
    logger.error("Login Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};

/**
 * @desc    Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendResponse(res, 400, false, "Refresh token is required");

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret_key");
    } catch (err) {
      return sendResponse(res, 401, false, "Invalid refresh token");
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return sendResponse(res, 401, false, "Invalid refresh token");

    const tokens = await generateTokens(user);
    return sendResponse(res, 200, true, "Token refreshed successfully", tokens);
  } catch (error) {
    logger.error("Refresh Token Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};

/**
 * @desc    Resend OTP
 */
export const resendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ where: email ? { email } : { phone } });

    if (!user) return sendResponse(res, 404, false, "User not found");
    if (user.isVerified) return sendResponse(res, 400, false, "Account already verified");

    const lastOtp = await OTP.findOne({
      where: { ...(email ? { email } : { phone }), type: "REGISTRATION" },
      order: [["createdAt", "DESC"]],
    });

    if (lastOtp) {
      const timeDiff = (new Date() - new Date(lastOtp.createdAt)) / 1000;
      if (timeDiff < 60) return sendResponse(res, 429, false, `Please wait ${Math.ceil(60 - timeDiff)} seconds`);
    }

    await OTP.update({ isUsed: true }, { where: { ...(email ? { email } : { phone }), type: "REGISTRATION", isUsed: false } });

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, phone, code: otpCode, expiresAt, type: "REGISTRATION" });

    if (email) await sendEmailOTP(email, otpCode);
    else if (phone) await sendSMSOTP(phone, otpCode);

    return sendResponse(res, 200, true, "New verification code sent");
  } catch (error) {
    logger.error("Resend OTP Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error.message);
  }
};

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

/**
 * @desc    Verify Reset OTP
 * @route   POST /api/auth/verify-reset-otp
 */
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      where: { email, code: otp, type: "PASSWORD_RESET", isUsed: false },
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
