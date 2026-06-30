import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import { Op } from "sequelize";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveVerificationUrl } from "../../utils/verificationUrl.util.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import { formatRelativeDate } from "../../utils/date.js";
import { formatFileSize, detectFileType } from "../../services/verification.service.js";

/**
 * Handle fetching all PENDING verification requests for Admins
 */
export const getPendingVerifications = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const lastViewedParam = req.query.lastViewed;
    const countQueries = [
      VerificationRequest.count({ where: { status: "PENDING" } }),
      VerificationRequest.count({
        where: {
          status: "APPROVED",
          updatedAt: { [Op.gte]: startOfDay },
        },
      }),
      VerificationRequest.count({
        where: {
          status: "DECLINED",
          updatedAt: { [Op.gte]: startOfDay },
        },
        paranoid: false, // Includes soft-deleted requests for accurate admin metric retention!
      }),
    ];

    const lastViewedTimestamp = parseInt(lastViewedParam, 10);
    if (lastViewedParam && !isNaN(lastViewedTimestamp)) {
      // Count pending requests created strictly AFTER the admin's last visit timestamp
      countQueries.push(
        VerificationRequest.count({
          where: {
            status: "PENDING",
            createdAt: { [Op.gt]: new Date(lastViewedTimestamp) },
          },
        }),
      );
    } else {
      // Fallback: If no lastViewed is passed, just count how many were created 'Today'
      countQueries.push(
        VerificationRequest.count({
          where: {
            status: "PENDING",
            createdAt: { [Op.gte]: startOfDay },
          },
        }),
      );
    }

    const [pendingCount, approvedToday, rejectedToday, newPendingCount] =
      await Promise.all(countQueries);

    const pendingRequests = await VerificationRequest.findAll({
      where: { status: "PENDING" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar"], // Added avatar
        },
      ],
      order: [["createdAt", "DESC"]], // Show newest first
    });

    // Map to exactly match what the frontend VerificationQueue.jsx components expect!
    const formattedRequests = await Promise.all(
      pendingRequests.map(async (request) => {
        const fileType = detectFileType(request.documentMetadata?.mimeType);

        const [resolvedDocUrl, resolvedAvatar] = await Promise.all([
          resolveVerificationUrl(request.documentUrl),
          resolveAvatarUrl(request.user?.avatar, request.user?.name),
        ]);

        return {
          id: request.id,
          userId: request.user?.id,
          name: request.user?.name || "Unknown User",
          type: request.requestedRole,
          time: formatRelativeDate(request.createdAt),
          avatar: resolvedAvatar,
          file: request.documentMetadata?.originalName || "Document",
          fileSize: formatFileSize(request.documentMetadata?.size),
          fileType: fileType,
          status: request.status.toLowerCase(),
          url: resolvedDocUrl,
        };
      }),
    );

    return sendResponse(
      res,
      200,
      true,
      "Pending verifications retrieved successfully.",
      {
        stats: {
          totalPending: pendingCount,
          newPending: newPendingCount || 0,
          approvedToday,
          rejectedToday,
        },
        requests: formattedRequests,
      },
    );
  } catch (error) {
    logger.error("Error fetching pending verifications", error);
    next(error);
  }
};
