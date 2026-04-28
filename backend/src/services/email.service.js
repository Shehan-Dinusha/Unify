import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import logger from "../utils/logger.js";

/**
 * CORE EMAIL SERVICE (AWS SES Integration)
 * This service uses the AWS SDK to send emails via SES.
 * Currently operating in SES Sandbox mode.
 */

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  // Credentials are automatically picked up from environment variables:
  // AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
});

/**
 * Generic internal send function
 */
const send = async (to, subject, html, text = "") => {
  try {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
          Text: {
            Charset: "UTF-8",
            Data: text,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: process.env.EMAIL_FROM, // Ensure this is a verified email in SES
    };

    const command = new SendEmailCommand(params);
    const info = await sesClient.send(command);
    
    logger.info(`Email sent successfully via SES: ${info.MessageId}`);
    return info;
  } catch (error) {
    logger.error("Email Service Error (SES):", error);
    throw new Error("Email delivery failed");
  }
};

/**
 * Helper to generate reusable email HTML template
 */
const generateEmailTemplate = (title, message, otp) => {
  const rawOtp = otp.toString();
  return `
    <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #0D1A26; padding: 30px 20px; text-align: center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td style="vertical-align: middle; padding-right: 12px;">
              <svg width="45" height="37" style="display:block;"   viewBox="0 0 75 61" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.88787 26.1222C6.88816 29.437 6.88997 32.7518 6.88511 36.0665C6.88472 36.3633 6.91946 36.6067 7.17669 36.8198C8.9373 38.2783 9.35222 40.1497 8.81826 42.3007C8.62167 43.0926 8.27469 43.8206 7.87062 44.5234C7.02518 45.9938 6.19413 47.4728 5.32194 48.9272C4.67463 50.0066 4.38868 49.9994 3.74204 48.9269C2.67821 47.1625 1.58249 45.4143 0.694527 43.5513C0.162281 42.4346 -0.118938 41.2654 0.0479943 40.0063C0.221755 38.6961 0.825191 37.643 1.83564 36.8151C2.02446 36.6606 2.1101 36.5118 2.10981 36.259C2.10076 28.7572 2.09992 21.2553 2.10172 13.7535C2.10181 13.3262 2.13331 12.8988 2.15226 12.4716C2.20422 11.3021 2.81328 10.5645 3.90575 10.1891C6.63266 9.25234 9.35786 8.31004 12.0833 7.36897C18.6872 5.08865 25.29 2.80512 31.896 0.531083C32.6553 0.269665 33.4021 -0.0330467 34.2435 0.00292506C34.8066 0.0269976 35.3361 0.117509 35.8669 0.298213C44.5351 3.24763 53.206 6.18902 61.8755 9.1352C62.8951 9.48169 63.9142 9.83093 64.9233 10.2064C65.5504 10.4398 66.0518 10.8562 66.3703 11.4532C67.0158 12.6636 66.455 14.0721 65.1179 14.5365C63.3219 15.1602 61.5137 15.7485 59.7106 16.3513C51.8527 18.9775 43.9931 21.5978 36.1394 24.2363C35.0275 24.6098 33.957 24.6285 32.8414 24.2513C25.7429 21.8517 18.6378 19.4715 11.5351 17.0843C10.1688 16.6251 8.80381 16.1624 7.43763 15.703C6.88979 15.5188 6.88787 15.521 6.88778 16.0827C6.88739 19.4292 6.88759 22.7757 6.88787 26.1222" fill="white"/> <path d="M57.0508 38.0505C56.1142 38.01 55.0567 38.1032 54.0068 38.2594C53.1933 38.3806 52.3818 38.5305 51.6417 38.9279C51.2876 39.1181 51.0976 39.3699 51.1321 39.8007C51.1674 40.2418 51.1368 40.6881 51.1391 41.132C51.1401 41.3177 51.1108 41.4866 50.9124 41.5587C49.7691 41.9743 49.4844 42.8503 49.6191 43.9555C49.718 44.7672 49.8141 45.6373 50.5108 46.1356C51.1105 46.5647 51.4107 47.1082 51.6549 47.7439C51.7338 47.9495 51.8496 48.1436 51.9677 48.3307C53.1854 50.2608 54.927 51.3687 57.2178 51.2806C59.576 51.1899 61.3172 49.9691 62.3537 47.8369C62.6762 47.1731 63.0068 46.5929 63.579 46.0661C64.5369 45.1841 64.5924 43.9354 64.375 42.7077C64.3081 42.3296 64.0545 41.9646 63.6842 41.8462C62.9831 41.6219 62.8914 41.1354 62.9642 40.5235C62.9772 40.414 62.9658 40.3016 62.9658 40.1907C62.9657 39.1606 62.8716 39.0216 61.9141 38.6597C61.7664 38.6038 61.6135 38.5602 61.4608 38.5191C60.0579 38.1406 58.6252 38.0315 57.0508 38.0506M66.7279 52.2405C67.2071 51.2984 67.6475 50.4923 68.0301 49.6597C68.29 49.0945 68.1379 48.5293 67.6723 48.1648C67.4789 48.0134 67.4413 47.8466 67.4415 47.6329C67.4436 45.0006 67.4449 42.3683 67.4423 39.7359C67.442 39.4974 67.4802 39.3022 67.7311 39.1961C68.0322 39.0689 68.1201 38.8081 68.1391 38.5019C68.1796 37.8466 67.8414 37.4221 67.3076 37.1209C64.1461 35.3374 61.037 33.4647 57.9111 31.6201C57.3999 31.3183 56.8855 31.3142 56.3803 31.6209C53.0337 33.6519 49.6891 35.6863 46.3444 37.7207C46.0504 37.8995 45.7884 38.1115 45.8195 38.5019C45.8496 38.8815 46.1518 39.0206 46.45 39.138C47.2752 39.463 48.105 39.7768 48.933 40.0948C49.5542 40.3335 49.609 40.3279 49.5433 39.6746C49.4366 38.6127 49.963 37.973 50.8122 37.4884C51.341 37.1868 51.9062 36.9818 52.4952 36.8511C55.3161 36.2248 58.153 36.2274 60.9909 36.703C62.0106 36.874 63 37.1756 63.8222 37.8523C64.2647 38.2164 64.5743 38.6414 64.5604 39.2677C64.5378 40.2887 64.5614 40.2988 65.5272 39.973C65.8459 39.8653 65.9914 39.8816 65.9899 40.2722C65.9802 42.7301 65.9839 45.1879 65.9865 47.6459C65.9867 47.8629 65.948 48.0388 65.7534 48.1801C65.2731 48.5289 65.1939 49.0432 65.3741 49.5447C65.6996 50.4514 66.2152 51.2705 66.728 52.2405M57.0878 60.7054C47.7195 60.7484 39.2961 53.0479 39.3846 42.5812C39.4654 33.0268 47.2817 25.1741 57.3173 25.2489C66.8672 25.3199 75.0516 32.9058 74.9998 43.0291C74.9482 53.0879 66.6323 60.7979 57.0878 60.7054" fill="white"/> <path d="M38.5325 28.4628C37.9764 29.2676 37.4008 30.0009 36.9103 30.7929C35.1812 33.5842 34.1656 36.6225 33.7142 39.8645C33.6049 40.6495 33.5645 41.4394 33.4725 42.2248C33.403 42.8181 33.3839 42.8157 32.8397 42.598C30.8692 41.8099 28.9044 41.0069 26.9259 40.2392C24.4563 39.2809 21.9394 38.4803 19.305 38.1068C18.3798 37.9757 17.4486 37.906 16.5158 37.8695C15.8796 37.8445 15.8627 37.8482 15.8628 37.2349C15.8631 32.7164 15.8647 28.1981 15.8677 23.6796C15.8681 23.076 15.9306 23.0367 16.4949 23.2564C21.736 25.2967 27.0277 27.1886 32.4535 28.6857C34.2826 29.1905 36.0934 28.9526 37.8979 28.5335C38.0519 28.4977 38.2044 28.4547 38.3587 28.42C38.3852 28.414 38.4174 28.4332 38.5325 28.4628Z" fill="white"/> <path d="M57.186 41.0315C58.3504 41.0241 59.6084 41.268 60.8605 41.5501C61.2947 41.6479 61.5695 41.9128 61.581 42.3726C61.5889 42.6922 61.7453 42.7631 62.0309 42.772C63.2012 42.8084 63.1831 42.8145 63.1397 43.9598C63.108 44.7943 62.8321 45.4054 61.9368 45.5912C61.6403 45.6529 61.6446 45.9239 61.5992 46.1567C61.2173 48.119 59.7043 49.6133 57.7547 49.9582C55.4628 50.3636 53.1219 48.7837 52.5119 46.4185C52.4724 46.2654 52.4256 46.1111 52.4131 45.9549C52.3956 45.7339 52.3085 45.6139 52.0782 45.5699C51.3735 45.4351 51.0267 44.9767 50.9651 44.2805C50.9371 43.9653 50.9122 43.6501 50.8877 43.3346C50.8599 42.9759 51.0499 42.8087 51.3869 42.7787C51.4974 42.7689 51.6093 42.7615 51.7195 42.7692C52.172 42.801 52.5533 42.8124 52.5517 42.1539C52.5508 41.7986 52.9126 41.6143 53.2545 41.5365C54.5066 41.2518 55.7675 41.0282 57.186 41.0314" fill="white"/> </svg>
            </td>
            <td style="vertical-align: middle;">
              <span style="font-size: 34px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">Unify</span>
            </td>
          </tr>
        </table>
        <div style="margin-top: 8px; font-size: 15px; color: #8BA3B8;">University Social &amp; Learning Platform</div>
      </div>

      <!-- Body -->
      <div style="padding: 40px 35px; color: #12283E; text-align: center;">
        <h2 style="margin-top: 0; color: #0D1A26; font-size: 24px; font-weight: bold;">${title}</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #4A5568;">${message}</p>

        <!-- OTP Box -->
        <div style="background-color: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 30px; text-align: center; margin: 35px 0;">
          <span style="font-size: 42px; font-weight: bold; color: #2B8CEE; letter-spacing: 4px; padding-left: 4px;">${rawOtp}</span>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">This code will expire in <strong>5 minutes</strong>.</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4A5568; margin-bottom: 0;">If you didn't request this, please safely ignore this email.</p>
      </div>

      <!-- Footer -->
      <div style="background-color: #F1F5F9; padding: 25px; text-align: center; border-top: 1px solid #E2E8F0;">
        <p style="margin: 0; font-size: 14px; color: #718096;">&copy; ${new Date().getFullYear()} Unify Platform. All rights reserved.</p>
      </div>
    </div>
  `;
};

/**
 * @desc    Send OTP via Email
 */
export const sendEmailOTP = async (email, otp) => {
  const subject = "Your Unify Verification Code";
  const html = generateEmailTemplate(
    "Welcome to Unify!",
    "Thank you for registering. Please use the verification code below to complete your sign-up process:",
    otp
  );
  return send(email, subject, html, `Your verification code is ${otp}`);
};

/**
 * @desc    Send Password Reset OTP
 */
export const sendPasswordResetOTP = async (email, otp) => {
  const subject = "Password Reset Code";
  const html = generateEmailTemplate(
    "Password Reset Request",
    "We received a request to reset the password for your Unify account. Please use the following code to proceed:",
    otp
  );
  return send(email, subject, html, `Your password reset code is ${otp}`);
};
