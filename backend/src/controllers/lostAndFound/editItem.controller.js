import { LostAndFound } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import s3Service from "../../services/s3.service.js";
import fs from "fs";

export const editItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body; // sanitized by express-validator
  
  //if (!req.user) return sendResponse(res, 401, false, "Unauthorized");

  // for testing
  const userId = 1; // test user



  const item = await LostAndFound.findByPk(id);

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  // Security Check: Only the original poster can edit
  if (item.userId !== userId) {
    return sendResponse(res, 403, false, "You do not have permission to edit this item.");
  }

  // Handle multiple images
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(async (file) => {
      try {
        const fileKey = await s3Service.uploadFile(
          file.path,
          file.originalname,
          file.mimetype,
          "lost-and-found"
        );
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return fileKey;
      } catch (err) {
        console.error("Failed to upload to S3 or cleanup local file:", err);
        return null;
      }
    });
    const results = await Promise.all(uploadPromises);
    updates.images = results.filter((key) => key !== null);
  }

  // Apply updates and save
  await item.update(updates);

  return sendResponse(res, 200, true, "Item updated successfully.", item);
});
