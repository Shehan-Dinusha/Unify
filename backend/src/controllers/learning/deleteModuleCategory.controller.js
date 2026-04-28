import { ModuleCategory, Material } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import s3Service from "../../services/s3.service.js";

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

    // Fetch and delete materials from S3 before deleting category
    const materials = await Material.findAll({ where: { categoryId } });
    for (const material of materials) {
      if (
        material.fileType !== "Link" &&
        material.url &&
        !material.url.startsWith("http")
      ) {
        try {
          await s3Service.deleteFile(material.url);
        } catch (s3Error) {
          logger.error(
            `Failed to delete S3 file ${material.url}: ${s3Error.message}`,
          );
        }
      }
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
