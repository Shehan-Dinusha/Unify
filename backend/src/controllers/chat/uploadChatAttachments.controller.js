import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Upload chat attachments to S3
 * @route   POST /api/v1/chat/attachments
 * @access  Private (Student, Club)
 */
export const uploadChatAttachments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, "No files uploaded");
    }

    const attachments = req.files.map((file) => ({
      key: file.location,  // S3 key set by s3UploadMiddleware
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      isImage: file.mimetype.startsWith("image/"),
    }));

    return sendResponse(res, 200, true, "Attachments uploaded", attachments);
  } catch (error) {
    logger.error("uploadChatAttachments error:", error);
    return sendResponse(res, 500, false, "Failed to upload attachments");
  }
};
