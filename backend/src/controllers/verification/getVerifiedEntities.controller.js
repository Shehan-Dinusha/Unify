import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import StudentProfile from "../../modules/StudentProfile.model.js";
import Degree from "../../modules/Degree.model.js";
import Batch from "../../modules/Batch.model.js";
import { Op } from "sequelize";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import { resolveVerificationUrl } from "../../utils/verificationUrl.util.js";
import { formatRelativeDate } from "../../utils/date.js";

/**
 * Handle fetching all APPROVED verification requests (Verified Entities) for Admins.
 * Returns the data shaped perfectly for the VerifiedList.jsx component.
 */
export const getVerifiedEntities = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const lastViewedParam = req.query.lastViewed;
    const sinceDate =
      lastViewedParam && !isNaN(new Date(lastViewedParam))
        ? new Date(lastViewedParam)
        : startOfDay;

    // Count how many entities were verified "recently" (Since last visit OR today), plus global totals.
    const [
      newVerifiedClubs,
      newVerifiedReps,
      totalClubs,
      totalBatchReps,
      totalVerified,
    ] = await Promise.all([
      VerificationRequest.count({
        where: {
          status: "APPROVED",
          requestedRole: "Club",
          updatedAt: { [Op.gte]: sinceDate },
        },
      }),
      VerificationRequest.count({
        where: {
          status: "APPROVED",
          requestedRole: "Batch Rep",
          updatedAt: { [Op.gte]: sinceDate },
        },
      }),
      VerificationRequest.count({
        where: { status: "APPROVED", requestedRole: "Club" },
      }),
      VerificationRequest.count({
        where: { status: "APPROVED", requestedRole: "Batch Rep" },
      }),
      VerificationRequest.count({
        where: { status: "APPROVED" },
      }),
    ]);

    // Fetch all physically verified requests
    const verifiedRequests = await VerificationRequest.findAll({
      where: { status: "APPROVED" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
          include: [
            {
              model: StudentProfile,
              as: "studentProfile",
              attributes: ["id"],
              include: [
                { model: Degree, as: "degree", attributes: ["name"] },
                { model: Batch, as: "batch", attributes: ["name"] },
              ],
              required: false, // Left join: Not all Users (like native Clubs) have a student profile
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]], // Show most recently verified items first
    });

    // Map the database entities explicitly to what mockVerified provides in frontend!
    const formattedVerified = await Promise.all(
      verifiedRequests.map(async (request) => {
        // Return shape identically matching mockVerified
        const [resolvedAvatar, resolvedDocUrl] = await Promise.all([
          resolveAvatarUrl(request.user?.avatar, request.user?.name),
          resolveVerificationUrl(request.documentUrl),
        ]);

        return {
          id: request.id,
          name: request.user?.name || "Unknown User",
          type: request.requestedRole,
          verifiedDate: formatRelativeDate(request.updatedAt),
          avatar: resolvedAvatar,
          email: request.user?.email || "No email available",
          degree: request.user?.studentProfile?.degree?.name || null,
          batch: request.user?.studentProfile?.batch?.name || null,
          documentName: request.documentMetadata?.originalName || "Document",
          documentUrl: resolvedDocUrl,
        };
      }),
    );

    return sendResponse(
      res,
      200,
      true,
      "Verified entities retrieved successfully.",
      {
        stats: {
          totalVerified,
          totalClubs,
          totalBatchReps,
          newVerifiedClubs,
          newVerifiedReps,
        },
        verified: formattedVerified,
      },
    );
  } catch (error) {
    logger.error("Error fetching verified entities", error);
    next(error);
  }
};
