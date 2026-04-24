import { ModuleCategory, AcademicModule } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Create a new module category
 * @route POST /api/learning/modules/:moduleId/categories
 */
export const createModuleCategory = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, iconName } = req.body;

    if (!title || !iconName) {
      return sendResponse(
        res,
        400,
        false,
        "Category title and icon name are required",
      );
    }

    const academicModule = await AcademicModule.findByPk(moduleId);
    if (!academicModule) {
      return sendResponse(res, 404, false, "Module not found");
    }

    // Check if category with the same title already exists in this module
    const existingCategory = await ModuleCategory.findOne({
      where: { moduleId, title },
    });
    if (existingCategory) {
      return sendResponse(
        res,
        400,
        false,
        "A category with this title already exists in this module",
      );
    }

    // Check if the maximum limit of 8 categories has been reached
    const categoryCount = await ModuleCategory.count({
      where: { moduleId },
    });
    if (categoryCount >= 8) {
      return sendResponse(
        res,
        400,
        false,
        "Maximum limit of 8 categories per module has been reached",
      );
    }

    const category = await ModuleCategory.create({
      moduleId,
      title,
      iconName,
    });

    const categoryResponse = {
      id: category.id,
      moduleId: category.moduleId,
      title: category.title,
      iconName: category.iconName,
    };

    return sendResponse(
      res,
      201,
      true,
      "Category created successfully",
      categoryResponse,
    );
  } catch (error) {
    logger.error(`Error in createModuleCategory: ${error.message}`);
    return sendResponse(res, 500, false, "Failed to create category");
  }
};
