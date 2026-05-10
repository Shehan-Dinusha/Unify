import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveVerificationUrl } from "../../utils/verificationUrl.util.js";

/**
 * Handle fetching the current user's verification status and document info
 */
export const getVerificationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existingRequest = await VerificationRequest.findOne({
      where: { userId },
    });

    if (!existingRequest) {
      const removedRequest = await VerificationRequest.findOne({
        where: { userId, status: "DECLINED" },
        paranoid: false,
        order: [["deletedAt", "DESC"]],
      });

      if (removedRequest && removedRequest.deletedAt) {
        const resolvedDocUrl = await resolveVerificationUrl(
          removedRequest.documentUrl,
        );

        return sendResponse(
          res,
          200,
          true,
          "Verification status retrieved successfully.",
          {
            hasRequest: true,
            status: "removed",
            requestedRole: removedRequest.requestedRole,
            declineReason: removedRequest.adminMessage,
            document: {
              name: removedRequest.documentMetadata?.originalName || "Document",
              size: removedRequest.documentMetadata?.size || 0,
              url: resolvedDocUrl,
            },
          },
        );
      }

      return sendResponse(res, 200, true, "No active verification request.", {
        hasRequest: false,
        status: "idle",
      });
    }

    const resolvedDocUrl = await resolveVerificationUrl(
      existingRequest.documentUrl,
    );

    return sendResponse(
      res,
      200,
      true,
      "Verification status retrieved successfully.",
      {
        hasRequest: true,
        status: existingRequest.status.toLowerCase(),
        requestedRole: existingRequest.requestedRole,
        declineReason: existingRequest.adminMessage,
        document: {
          name: existingRequest.documentMetadata?.originalName || "Document",
          size: existingRequest.documentMetadata?.size || 0,
          url: resolvedDocUrl,
        },
      },
    );
  } catch (error) {
    logger.error("Error retrieving verification status", error);
    next(error);
  }
};
