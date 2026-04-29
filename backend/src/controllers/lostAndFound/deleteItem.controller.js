import { LostAndFound } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";
import s3Service from "../../services/s3.service.js";

export const deleteItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  //if (!req.user) return sendResponse(res, 401, false, "Unauthorized");
   // for testing
  const userId = 1; // test user



  const item = await LostAndFound.findByPk(id);

  if (!item) {
    return sendResponse(res, 404, false, "Item not found.");
  }

  // Security Check: Only original poster can delete
  if (item.userId !== userId) {
    return sendResponse(res, 403, false, "You do not have permission to delete this item.");
  }

  // 1. Delete all associated images from S3 Bucket
  if (item.images && item.images.length > 0) {
    const s3DeletePromises = item.images.map((s3Key) => {
      return s3Service.deleteFile(s3Key);
    });
    await Promise.all(s3DeletePromises);
  }

  await item.destroy();

  return sendResponse(res, 200, true, "Item deleted successfully.");
});
