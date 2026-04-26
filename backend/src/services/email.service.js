import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

/**
 * CORE EMAIL SERVICE (Provider Agnostic)
 * This service uses Nodemailer which can be configured for any provider
 * (SendGrid, AWS SES, Mailgun, etc.) via environment variables.
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generic internal send function
 */
const send = async (to, subject, html, text = "") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Unify Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Email Service Error:", error);
    throw new Error("Email delivery failed");
  }
};

/**
 * @desc    Send OTP via Email
 */
export const sendEmailOTP = async (email, otp) => {
  const subject = "Your Unify Verification Code";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #3b82f6;">Welcome to Unify!</h2>
      <p>Please use the following verification code to complete your registration:</p>
      <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f3f4f6; border-radius: 8px; text-align: center; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in <strong>5 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
      <p style="font-size: 12px; color: #999;">&copy; 2026 Unify Platform.</p>
    </div>
  `;
  return send(email, subject, html, `Your verification code is ${otp}`);
};

/**
 * @desc    Send Password Reset OTP
 */
export const sendPasswordResetOTP = async (email, otp) => {
  const subject = "Password Reset Code";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #3b82f6;">Password Reset Request</h2>
      <p>We received a request to reset your password. Please use the following code to proceed:</p>
      <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f3f4f6; border-radius: 8px; text-align: center; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in <strong>5 minutes</strong>.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
      <p style="font-size: 12px; color: #999;">&copy; 2026 Unify Platform.</p>
    </div>
  `;
  return send(email, subject, html, `Your password reset code is ${otp}`);
};
