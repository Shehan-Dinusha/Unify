import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import fs from "fs";
import path from "path";

export const deleteVerificationRequest = async (req, res, next) => {
  try {
    const userId = req.body.userId || 1;

    const existingRequest = await VerificationRequest.findOne({ where: { userId } });
    if (!existingRequest) {
      return sendResponse(res, 404, false, "No active verification submission found.");
    }

    if (existingRequest.documentUrl && existingRequest.documentUrl.startsWith('/uploads/verifications/')) {
      const filename = existingRequest.documentUrl.split('/').pop();
      const filePath = path.join(process.cwd(), 'uploads/verifications', filename);
      // 🔥 Physically delete the file to save disk/S3 space!
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Scrub the file references from the database so we only keep the pure structural row for stats
    existingRequest.documentUrl = null;
    existingRequest.documentMetadata = null;
    await existingRequest.save();

    // Soft delete the row
    await existingRequest.destroy();

    return sendResponse(res, 200, true, "Verification submission deleted successfully.");
  } catch (error) {
    logger.error("Error deleting verification request", error);
    next(error);
  }
};
