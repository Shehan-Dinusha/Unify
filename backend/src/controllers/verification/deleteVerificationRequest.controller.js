import VerificationRequest from "../../modules/VerificationRequest.model.js";
import User from "../../modules/User.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { deleteVerificationFile } from "../../utils/verificationUrl.util.js";
import bcrypt from "bcryptjs";

export const deleteVerificationRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existingRequest = await VerificationRequest.findOne({
      where: { userId },
    });
    if (!existingRequest) {
      return sendResponse(
        res,
        404,
        false,
        "No active verification submission found.",
      );
    }

    if (existingRequest.documentUrl) {
      // ðŸ”¥ Physically delete from S3!
      await deleteVerificationFile(existingRequest.documentUrl);
    }

    // Keep documentUrl nullified (file deleted) but preserve metadata for UI display
    existingRequest.documentUrl = null;
    await existingRequest.save();

    // Soft delete the row
    await existingRequest.destroy({ force: true });

    return sendResponse(
      res,
      200,
      true,
      "Verification submission deleted successfully.",
    );
  } catch (error) {
    logger.error("Error deleting verification request", error);
    next(error);
  }
};
