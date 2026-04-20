import { sequelize } from "../../modules/index.js";
import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import ClubProfile from "../../modules/ClubProfile.model.js";
import StudentProfile from "../../modules/StudentProfile.model.js";
import Notification from "../../modules/Notification.model.js";
import AdminLog from "../../modules/AdminLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin removal of an already Verified Account.
 * Reverts privileges and performs a soft delete on the VerificationRequest.
 */
export const removeVerifiedAccount = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.id || 2; // Fallback for testing

    if (!reason || reason.trim() === "") {
      await transaction.rollback();
      return sendResponse(
        res,
        400,
        false,
        "A reason for removing the verified account must be provided.",
      );
    }

    // 1. Fetch the approved request
    const request = await VerificationRequest.findByPk(id, {
      include: [{ model: User, as: "user" }],
      transaction,
    });

    if (!request) {
      await transaction.rollback();
      return sendResponse(res, 404, false, "Verification request not found.");
    }

    if (request.status !== "APPROVED") {
      await transaction.rollback();
      return sendResponse(
        res,
        400,
        false,
        "Only approved accounts can be removed via this action.",
      );
    }

    const { user, requestedRole } = request;

    // 2. Revert the Role / Verification Status
    if (requestedRole === "Club" || requestedRole.includes("Club")) {
      const clubProfile = await ClubProfile.findOne({
        where: { userId: user.id },
        transaction,
      });
      if (clubProfile) {
        clubProfile.isVerified = false;
        await clubProfile.save({ transaction });
      }
    } else if (requestedRole === "Batch Rep") {
      // Revert Batch Rep flag in Student Profile
      const studentProfile = await StudentProfile.findOne({
        where: { userId: user.id },
        transaction,
      });
      if (studentProfile) {
        studentProfile.isBatchRep = false;
        await studentProfile.save({ transaction });
      }
    } else {
      // Any other dynamically assigned roles revert to 'Student' by default or keep previous state.
      // For safety, defaulting to 'Student'.
      user.role = "Student";
      await user.save({ transaction });
    }

    // 3. Mark the Verification Request with the admin message, change status, and then soft delete
    request.status = "DECLINED";
    request.adminMessage = reason.trim();
    await request.save({ transaction });

    // Soft delete the row (paranoid mode)
    await request.destroy({ transaction });

    // 4. Dispatch In-App Notification alerting the user of the removal
    await Notification.create(
      {
        userId: user.id,
        type: "General",
        title: "Verified Account Status Removed",
        content: `Your verified status as a ${requestedRole} has been revoked. Reason: ${reason.trim()}`,
      },
      { transaction },
    );

    // 5. Generate Admin Security Audit Log
    await AdminLog.create(
      {
        adminId,
        type: "verification_removed",
        title: `Removed ${requestedRole} Status`,
        description: `Admin revoked the verified status for ${user.name}. Reason: ${reason.trim()}`,
        targetUserId: user.id,
        referenceId: request.id,
        severity: "Medium", // Slightly higher severity since rights are being revoked
      },
      { transaction },
    );

    // Commit all database mutations atomically
    await transaction.commit();

    return sendResponse(
      res,
      200,
      true,
      `Verified account properly revoked and removed.`,
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error removing verified account", error);
    next(error);
  }
};
