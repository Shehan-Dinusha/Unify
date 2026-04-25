import { ModuleCategory } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Update a module category
 * @route PUT /api/learning/categories/:categoryId
 */
export const updateModuleCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title, iconName } = req.body;

    const category = await ModuleCategory.findByPk(categoryId);
    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    // Check if another category with the same title already exists in this module
    const existingCategory = await ModuleCategory.findOne({
      where: { moduleId: category.moduleId, title },
    });
    // Use Number() to safely compare against category.id in case categoryId is passed as string, but category.id is what Sequelize assigned
    if (existingCategory && existingCategory.id !== category.id) {
      return sendResponse(
        res,
        400,
        false,
        "A category with this title already exists in this module",
      );
    }

    category.title = title;
    category.iconName = iconName;

    await category.save();

    const categoryResponse = {
      id: category.id,
      moduleId: category.moduleId,
      title: category.title,
      iconName: category.iconName,
    };

    return sendResponse(
      res,
      200,
      true,
      "Category updated successfully",
      categoryResponse,
    );
  } catch (error) {
    logger.error(`Error in updateModuleCategory: ${error.message}`);
    return sendResponse(res, 500, false, "Failed to update category");
  }
};
