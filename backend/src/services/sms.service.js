import logger from "../utils/logger.js";

/**
 * @desc    Send OTP via SMS
 * @param   {string} phone - Recipient phone number
 * @param   {string} otp - OTP code
 */
export const sendSMSOTP = async (phone, otp) => {
  try {
    // Placeholder for real SMS Gateway integration (e.g., Twilio, Textlocal, or local SL gateway)
    // Example Twilio Implementation:
    /*
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your Unify verification code is ${otp}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */

    logger.info(`[SMS SERVICE] Sending OTP ${otp} to ${phone}`);
    
    // For now, we still mock the actual delivery but the service is architecturally in place
    return true;
  } catch (error) {
    logger.error("SMS Service Error:", error);
    throw new Error("Failed to send verification SMS");
  }
};
