import { sequelize } from "../../modules/index.js";
import VerificationRequest from "../../modules/VerificationRequest.model.js";
import StudentProfile from "../../modules/StudentProfile.model.js";
import User from "../../modules/User.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcryptjs";

/**
 * Handle Batch Rep resigning / revoking their own verified status.
 * Requires password confirmation.
 */
export const revokeBatchRepStatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      await t.rollback();
      return sendResponse(
        res,
        400,
        false,
        "Password is required to revoke status.",
      );
    }

    // 1. Fetch user with passwordHash
    const user = await User.findByPk(userId, {
      attributes: ["id", "passwordHash"],
      transaction: t,
    });

    if (!user) {
      await t.rollback();
      return sendResponse(res, 404, false, "User not found.");
    }

    // 2. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await t.rollback();
      return sendResponse(res, 401, false, "Invalid password. Access denied.");
    }

    // 3. Find current verified request
    const existingRequest = await VerificationRequest.findOne({
      where: { userId, status: "APPROVED", requestedRole: "Batch Rep" },
      transaction: t,
    });

    if (!existingRequest) {
      await t.rollback();
      return sendResponse(
        res,
        404,
        false,
        "No active Batch Rep verification found to revoke.",
      );
    }

    // 4. Update Student Profile
    const studentProfile = await StudentProfile.findOne({
      where: { userId },
      transaction: t,
    });
    if (studentProfile) {
      studentProfile.isBatchRep = false;
      await studentProfile.save({ transaction: t });
    }

    // 5. Cleanup Verification Request (Soft Delete)
    await existingRequest.destroy({ transaction: t });

    await t.commit();

    return sendResponse(
      res,
      200,
      true,
      "Batch Rep status revoked successfully.",
    );
  } catch (error) {
    await t.rollback();
    logger.error("Error revoking Batch Rep status", error);
    next(error);
  }
};
