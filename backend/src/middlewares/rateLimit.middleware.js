import rateLimit from "express-rate-limit";
import { sendResponse } from "../utils/response.js";

/**
 * @desc    Auth Rate Limiter
 * Prevents brute-force attacks on login, register, and OTP endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  handler: (req, res, _next, options) => {
    return sendResponse(res, 429, false, options.message.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * @desc    General API Rate Limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  handler: (req, res, _next, options) => {
    return sendResponse(res, 429, false, "Too many requests, please slow down.");
  },
});
