import express from "express";
import {
  register,
  verifyOTP,
  login,
  refreshToken,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  verifyOTPValidator,
  loginValidator,
  resendOTPValidator,
  forgotPasswordValidator,
  verifyResetOTPValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register user and send OTP
 * @access  Public
 */
router.post("/register", registerValidator, validateRequest, register);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify email using OTP
 * @access  Public
 */
router.post("/verify-otp", verifyOTPValidator, validateRequest, verifyOTP);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", loginValidator, validateRequest, login);
router.post("/refresh", refreshToken);
router.post("/resend-otp", resendOTPValidator, validateRequest, resendOTP);
router.post("/forgot-password", forgotPasswordValidator, validateRequest, forgotPassword);
router.post("/verify-reset-otp", verifyResetOTPValidator, validateRequest, verifyResetOTP);
router.post("/reset-password", resetPasswordValidator, validateRequest, resetPassword);

export default router;
