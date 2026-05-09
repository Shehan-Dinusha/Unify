import VerificationRequest from "../../modules/VerificationRequest.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { resolveVerificationUrl, deleteVerificationFile } from "../../utils/verificationUrl.util.js";

export const submitVerificationRequest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const requestedRole = req.body.requestedRole || "Batch Rep";

    if (requestedRole === "Club" && req.user.role !== "Club") {
      return sendResponse(
        res,
        403,
        false,
        "Only Club accounts can submit club verification requests.",
      );
    }
    if (requestedRole === "Batch Rep" && req.user.role !== "Student") {
      return sendResponse(
        res,
        403,
        false,
        "Only Students can submit batch rep verification requests.",
      );
    }

    if (!req.file) {
      return sendResponse(
        res,
        400,
        false,
        "Verification document is required.",
      );
    }

    const existingRequest = await VerificationRequest.findOne({
      where: { userId },
    });
    if (existingRequest) {
      if (existingRequest.status === "DECLINED") {
        if (existingRequest.documentUrl) {
          await deleteVerificationFile(existingRequest.documentUrl);
        }
        await existingRequest.destroy();
      } else {
        return sendResponse(
          res,
          400,
          false,
          "You already have an active verification submission. Please delete it before submitting a new one.",
        );
      }
    }

    const documentUrl = req.file.s3Key || req.file.key;

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

    const resolvedDocUrl = await resolveVerificationUrl(newRequest.documentUrl);

    return sendResponse(
      res,
      201,
      true,
      "Verification document submitted successfully.",
      {
        ...newRequest.toJSON(),
        documentUrl: resolvedDocUrl,
      },
    );
  } catch (error) {
    logger.error("Error submitting verification request", error);
    next(error);
  }
};
