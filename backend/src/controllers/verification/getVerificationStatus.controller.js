import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveVerificationUrl } from "../../utils/verificationUrl.util.js";

/**
 * Handle fetching the current user's verification status and document info
 */
export const getVerificationStatus = async (req, res, next) => {
  try {
    // For local testing without auth, fallback to req.query.userId or 1
    const userId = req.user?.id || req.query.userId || 1;

    const existingRequest = await VerificationRequest.findOne({
      where: { userId },
    });

    if (!existingRequest) {
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
