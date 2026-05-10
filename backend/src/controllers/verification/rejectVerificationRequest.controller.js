import { sequelize } from "../../modules/index.js";
import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import Notification from "../../modules/Notification.model.js";
import AdminLog from "../../modules/AdminLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin rejection of a Verification Request.
 * Saves the strict decline reasoning for the user to view.
 */
export const rejectVerificationRequest = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;



    // 1. Fetch the strict request constraints
    const request = await VerificationRequest.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });

    if (!request || request.status !== "PENDING") {
      await transaction.rollback();
      return sendResponse(
        res,
        400,
        false,
        "Valid pending verification request not found.",
      );
    }

    const { user, requestedRole } = request;

    // 2. Mark Verification Request as Declined and attach the reasoning
    request.status = "DECLINED";
    request.adminMessage = reason.trim();
    await request.save({ transaction });

    // 3. Dispatch In-App Notification alerting the user of rejection
    await Notification.create(
      {
        userId: user.id,
        type: "General",
        title: "Verification Request Declined",
        content: `Your request to be verified as a ${requestedRole} has been declined. Reason: ${reason.trim()}`,
      },
      { transaction },
    );

    // 4. Generate Admin Security Audit Log
    await AdminLog.create(
      {
        adminId,
        type: "verification_rejected",
        title: `Rejected ${requestedRole} Request`,
        description: `Admin rejected the verification request for ${user.name}. Reason: ${reason.trim()}`,
        targetUserId: user.id,
        referenceId: request.id,
        severity: "Low",
      },
      { transaction },
    );

    // Commit all database mutations atomically
    await transaction.commit();

    return sendResponse(
      res,
      200,
      true,
      `Verification request successfully rejected and user notified.`,
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error rejecting verification request", error);
    next(error);
  }
};
