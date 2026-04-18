import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle fetching the document URL and metadata for a specific verification request.
 * Useful when admins need to view a document associated with an entity.
 */
export const getVerificationDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await VerificationRequest.findByPk(id);

    if (!request) {
      return sendResponse(res, 404, false, "Verification request not found.");
    }

    if (!request.documentUrl) {
      return sendResponse(res, 404, false, "No document associated with this request.");
    }

    return sendResponse(res, 200, true, "Document retrieved successfully.", {
      documentUrl: request.documentUrl,
      documentMetadata: request.documentMetadata,
    });
  } catch (error) {
    logger.error("Error fetching verification document", error);
    next(error);
  }
};
