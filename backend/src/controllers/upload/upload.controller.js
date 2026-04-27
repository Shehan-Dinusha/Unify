import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import path from "path";

/**
 * @desc    Upload a single file and return its URL and metadata
 * @route   POST /api/v1/upload/avatar
 * @route   POST /api/v1/upload/club-document
 * @access  Private
 */
export const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, "No file uploaded.");
    }

    // Determine subfolder from destination path
    // Multer destination is usually .../uploads/subfolder
    const destParts = req.file.destination.split(path.sep);
    const subFolder = destParts[destParts.length - 1];

    const fileUrl = `/uploads/${subFolder}/${req.file.filename}`;

    const fileMetadata = {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    };

    logger.info(`File uploaded successfully: ${fileUrl}`);

    return sendResponse(res, 201, true, "File uploaded successfully.", {
      url: fileUrl,
      metadata: fileMetadata,
    });
  } catch (error) {
    logger.error("File Upload Error:", error);
    next(error);
  }
};
