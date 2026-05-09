import { ModuleCategory, AcademicModule } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import sequelize from "../../config/database.js";
import logger from "../../utils/logger.js";

/**
 * Get all categories for a specific module
 * @route GET /api/learning/modules/:moduleId/categories
 */
export const getModuleCategories = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Check if the module exists
    const academicModule = await AcademicModule.findByPk(moduleId);
    if (!academicModule) {
      return sendResponse(res, 404, false, "Module not found");
    }

    // Fetch all categories for the module, up to a maximum of 8
    const categories = await ModuleCategory.findAll({
      attributes: [
        "id",
        "moduleId",
        "title",
        "iconName",
        [
          sequelize.literal(
            `(SELECT CAST(COUNT(*) AS INTEGER) FROM materials WHERE materials."categoryId" = "ModuleCategory"."id")`,
          ),
          "fileCount",
        ],
      ],
      where: { moduleId },
      order: [["createdAt", "ASC"]],
      limit: 8,
      raw: true,
    });

    return sendResponse(res, 200, true, "Categories retrieved successfully", {
      categories,
      canCreateMore: categories.length < 8,
    });
  } catch (error) {
    logger.error(`Error in getModuleCategories: ${error.message}`);
    return sendResponse(res, 500, false, "Failed to retrieve categories");
  }
};
