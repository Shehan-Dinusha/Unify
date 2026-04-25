import { Material, ModuleCategory } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";

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

    return sendResponse(
      res,
      200,
      true,
      "Material updated successfully",
      material,
    );
  } catch (error) {
    console.error("Error editing material:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error while editing material",
      null,
    );
  }
};
