import { sequelize } from "../../modules/index.js";
import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import ClubProfile from "../../modules/ClubProfile.model.js";
import Notification from "../../modules/Notification.model.js";
import AdminLog from "../../modules/AdminLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin approval of a Verification Request.
 * Analyzes the requestedRole and updates corresponding profiles dynamically.
 */
export const approveVerificationRequest = async (req, res, next) => {
  // We use a database transaction to make sure ALL updates succeed together or fail together.
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params; // Expecting the verification request ID in the URL params
    const adminId = req.user?.id || 2; // Fallback to 1 for testing purposes until Auth is wired in

    // 1. Fetch the request constraints
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

    // 2. Mark Verification Request as Approved
    request.status = "APPROVED";
    await request.save({ transaction });

    // 3. Analyze and Update Cross-Models based on Role Policy
    if (requestedRole === "Club" || requestedRole.includes("Club")) {
      // Strict Check: The user must already be registered as a Club role via Auth
      if (user.role !== "Club") {
        await transaction.rollback();
        return sendResponse(
          res,
          400,
          false,
          "System inconsistency: Attempting to verify a Club, but base User role is not 'Club'.",
        );
      }

      // Fetch the strict Club Profile
      const clubProfile = await ClubProfile.findOne({
        where: { userId: user.id },
        transaction,
      });
      if (!clubProfile) {
        await transaction.rollback();
        return sendResponse(
          res,
          404,
          false,
          "Fatal Error: Club Profile is missing for this Club User.",
        );
      }

      // Elevate Profile Verification Status
      clubProfile.isVerified = true;
      await clubProfile.save({ transaction });
    } else if (requestedRole === "Batch Rep") {
      // Strict Check: ONLY a generalized Student can become a Batch Rep
      if (user.role !== "Student") {
        await transaction.rollback();
        return sendResponse(
          res,
          400,
          false,
          "Only active Students can be verified as Batch Representatives.",
        );
      }

      // Elevate User
      user.role = "Batch Rep";
      await user.save({ transaction });
    } else {
      // Fallback for Business or generic future roles
      user.role = requestedRole;
      await user.save({ transaction });
    }

    // 4. Dispatch In-App Notification alerting the user of success
    await Notification.create(
      {
        userId: user.id,
        type: "General",
        title: "Verification Approved! 🎉",
        content: `Your request to be verified as a ${requestedRole} has been officially approved. Please log in again to access your new privileges.`,
      },
      { transaction },
    );

    // 5. Generate Admin Security Audit Log
    await AdminLog.create(
      {
        adminId,
        type: "verification_approved",
        title: `Approved ${requestedRole} Request`,
        description: `Admin approved the system verification request for ${user.name} to become a ${requestedRole}.`,
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
      `Verification request successfully approved and ${requestedRole} privileges granted!`,
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error approving verification request", error);
    next(error);
  }
};
