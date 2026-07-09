import { Material, ModuleCategory } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import s3Service from "../../services/s3.service.js";
import logger from "../../utils/logger.js";

export const editMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { title, categoryId } = req.body;

    const material = await Material.findByPk(materialId);

    if (!material) {
      return sendResponse(res, 404, false, "Material not found", null);
    }

    if (categoryId) {
      const category = await ModuleCategory.findByPk(categoryId);
      if (!category) {
        return sendResponse(res, 404, false, "Category not found", null);
      }
      material.categoryId = categoryId;
    }

    if (title) {
      material.name = title;
    }

    await material.save();

    const responseData = material.toJSON();
    if (material.fileType !== "Link" && material.url && !material.url.startsWith("http")) {
      try {
        responseData.url = await s3Service.getFileUrl(material.url);
      } catch (e) {
        logger.error("Failed to generate presigned URL during edit:", e);
      }
    }

    return sendResponse(
      res,
      200,
      true,
      "Material updated successfully",
      responseData,
    );
  } catch (error) {
    logger.error("Error editing material:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error while editing material",
      null,
    );
  }
};
