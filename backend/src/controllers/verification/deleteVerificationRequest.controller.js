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
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await existingRequest.destroy();

    return sendResponse(res, 200, true, "Verification submission deleted successfully.");
  } catch (error) {
    logger.error("Error deleting verification request", error);
    next(error);
  }
};
