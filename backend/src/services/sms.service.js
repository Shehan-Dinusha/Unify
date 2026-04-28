import twilio from "twilio";
import logger from "../utils/logger.js";

/**
 * CORE SMS SERVICE (Twilio Integration)
 *
 * Design mirrors email.service.js for consistency:
 *   - `twilioClient` is initialized once at module load (not per-call)
 *   - `send()` is an internal helper that contains all Twilio-specific logic
 *   - `sendSMSOTP()` is the public API — provider-agnostic signature
 *
 * To switch SMS providers in the future:
 *   Replace only the body of send(). Everything above it stays the same.
 */

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Internal provider-specific send helper.
 * All Twilio SDK logic is isolated here.
 *
 * @param {string} to   - Recipient phone number (E.164 format, e.g. +94771234567)
 * @param {string} body - SMS message body
 * @returns {Promise}   - Twilio message object
 */
const send = async (to, body) => {
  try {
    const message = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    logger.info(`SMS sent successfully via Twilio | SID: ${message.sid} | To: ${to}`);
    return message;
  } catch (error) {
    // Log the full Twilio error (includes error code, more info URL, etc.)
    logger.error("SMS Service Error (Twilio):", {
      message: error.message,
      code: error.code,           // Twilio error code (e.g. 21608 = unverified number on trial)
      moreInfo: error.moreInfo,   // Twilio docs URL for this specific error
      status: error.status,
    });
    throw new Error("SMS delivery failed");
  }
};

/**
 * Branded SMS template.
 * All OTP messages (registration, resend, password reset) use this format.
 * To update wording across the entire app, change it here only.
 *
 * @param {string} otp - The 6-digit OTP code to inject
 * @returns {string}   - Formatted SMS body
 */
const generateSMSTemplate = (otp) =>
  `Welcome to Unify!\n\nYour verification code is: ${otp}\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this message.`;

/**
 * @desc    Send OTP via SMS
 * @param   {string} phone - Recipient phone number in E.164 format
 * @param   {string} otp   - 6-digit OTP code
 */
export const sendSMSOTP = async (phone, otp) => {
  const body = generateSMSTemplate(otp);
  return send(phone, body);
};

