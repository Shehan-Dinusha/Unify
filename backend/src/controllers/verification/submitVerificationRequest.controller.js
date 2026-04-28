import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import fs from "fs";

export const submitVerificationRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requestedRole = req.body.requestedRole || "Batch Rep";

    if (!req.file) {
      return sendResponse(res, 400, false, "Verification document is required.");
    }

    const existingRequest = await VerificationRequest.findOne({ where: { userId } });
    if (existingRequest) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return sendResponse(
        res,
        400,
        false,
        "You already have an active verification submission. Please delete it before submitting a new one."
      );
    }

    const documentUrl = `/uploads/verifications/${req.file.filename}`;

    const documentMetadata = {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    const newRequest = await VerificationRequest.create({
      userId,
      requestedRole,
      documentUrl,
      documentMetadata,
      status: "PENDING",
    });

    logger.info(`Verification request submitted for user ID: ${userId}`);

    return sendResponse(res, 201, true, "Verification document submitted successfully.", newRequest);
  } catch (error) {
    logger.error("Error submitting verification request", error);
    next(error);
  }
};
