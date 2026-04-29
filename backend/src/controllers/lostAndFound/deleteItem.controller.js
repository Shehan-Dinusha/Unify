import { LostAndFound } from "../../modules/index.js";
import { sendResponse, catchAsync } from "../../utils/response.js";

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

  await item.destroy();

  return sendResponse(res, 200, true, "Item deleted successfully.");
});
