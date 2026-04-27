import { ModuleCategory } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Delete a module category
 * @route DELETE /api/learning/categories/:categoryId
 */
export const deleteModuleCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await ModuleCategory.findByPk(categoryId);
    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    await category.destroy();

    return sendResponse(res, 200, true, "Category deleted successfully", {
      id: category.id,
    });
  } catch (error) {
    logger.error(`Error in deleteModuleCategory: ${error.message}`);
    return sendResponse(res, 500, false, "Failed to delete category");
  }
};
