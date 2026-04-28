import { LostAndFound } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

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
    updates.images = req.files.map(
      (file) => `/uploads/lost-found/${file.filename}`
    );
  }

  // Apply updates and save
  await item.update(updates);

  return sendResponse(res, 200, true, "Item updated successfully.", item);
});
