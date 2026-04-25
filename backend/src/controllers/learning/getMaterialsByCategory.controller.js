import {
  Material,
  AcademicModule,
  ModuleCategory,
  User,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { formatRelativeDate } from "../../utils/date.js";

export const getMaterialsByCategory = async (req, res) => {
  try {
    const { moduleId, categoryId } = req.params;

    // Verify module exists
    const moduleExists = await AcademicModule.findByPk(moduleId);
    if (!moduleExists) {
      return sendResponse(res, 404, false, "Module not found", null);
    }

    // Verify category exists
    const categoryExists = await ModuleCategory.findByPk(categoryId);
    if (!categoryExists) {
      return sendResponse(res, 404, false, "Category not found", null);
    }

    const materials = await Material.findAll({
      where: {
        moduleId,
        categoryId,
      },
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["name", "avatar"],
        },
      ],
    });

    // Format response data
    const formattedMaterials = materials.map((material) => {
      const { uploaderId, createdAt, updatedAt, ...rest } = material.get({
        plain: true,
      });
      return {
        ...rest,
        modifiedDate: formatRelativeDate(material.updatedAt),
      };
    });

    return sendResponse(
      res,
      200,
      true,
      "Materials fetched successfully",
      formattedMaterials,
    );
  } catch (error) {
    console.error("Error fetching materials:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error while fetching materials",
      null,
    );
  }
};
