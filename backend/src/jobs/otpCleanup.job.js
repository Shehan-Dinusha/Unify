import cron from "node-cron";
import { Op } from "sequelize";
import { OTP } from "../modules/index.js";
import logger from "../utils/logger.js";

/**
 * OTP Cleanup Cron Job
 *
 * Runs every 10 minutes and deletes:
 *  1. Expired OTPs (expiresAt < NOW) — regardless of isUsed state
 *  2. Used OTPs older than 5 minutes (isUsed = true, updatedAt < NOW - 5min)
 *     The 5-minute buffer prevents race conditions where the OTP row is
 *     read by a concurrent request (e.g. resetPassword) in the same moment
 *     a successful verifyResetOTP just deleted it.
 */
export const startOtpCleanupJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();
      const bufferTime = new Date(now.getTime() - 5 * 60 * 1000); // 5-min buffer

      const deleted = await OTP.destroy({
        where: {
          [Op.or]: [
            // 1. Hard-expired OTPs (safe to delete immediately)
            { expiresAt: { [Op.lt]: now } },
            // 2. Used OTPs — with buffer to avoid race conditions
            {
              isUsed: true,
              updatedAt: { [Op.lt]: bufferTime },
            },
          ],
        },
      });

      if (deleted > 0) {
        logger.info(`[OTP Cleanup] Deleted ${deleted} expired/used OTP record(s).`);
      }
    } catch (err) {
      logger.error("[OTP Cleanup] Cron job failed:", err);
    }
  });

  logger.info("✅ OTP cleanup cron job scheduled (every 10 minutes).");
};
