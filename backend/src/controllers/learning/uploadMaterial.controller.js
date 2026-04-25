import {
  Material,
  AcademicModule,
  ModuleCategory,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";

export const uploadMaterial = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, category, attachmentType, linkUrl } = req.body;

    // Assume user is authenticated and uploaderId is available in req.user
    const uploaderId = req.user ? req.user.id : 1;

    // Validate if module exists
    const moduleExists = await AcademicModule.findByPk(moduleId);
    if (!moduleExists) {
      return sendResponse(res, 404, false, "Module not found", null);
    }

    let categoryId = null;
    if (category) {
      // Find category
      const moduleCat = await ModuleCategory.findOne({
        where: { moduleId, title: category },
      });

      if (!moduleCat) {
        return sendResponse(res, 404, false, "Category not found", null);
      }
      categoryId = moduleCat.id;
    }

    let url = "";
    let fileType = "Link";
    let fileSize = null;

    if (attachmentType === "Upload File") {
      if (!req.file) {
        return sendResponse(
          res,
          400,
          false,
          "File is required when attachmentType is Upload File",
          null,
        );
      }
      url = req.file.path; // Or you could manipulate path to be relative
      fileType = req.file.mimetype;
      fileSize = req.file.size.toString();
    } else {
      if (!linkUrl) {
        return sendResponse(
          res,
          400,
          false,
          "Link is required when attachmentType is Attach Link",
          null,
        );
      }
      url = linkUrl;
    }

    const material = await Material.create({
      moduleId,
      uploaderId,
      categoryId: categoryId || null,
      name: title,
      fileType,
      fileSize,
      url,
    });

    return sendResponse(
      res,
      201,
      true,
      "Material uploaded successfully",
      material,
    );
  } catch (error) {
    console.error("Error uploading material:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error while uploading material",
      null,
    );
  }
};
