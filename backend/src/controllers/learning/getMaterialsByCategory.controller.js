import {
  Material,
  AcademicModule,
  ModuleCategory,
  User,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { formatRelativeDate } from "../../utils/date.js";
import s3Service from "../../services/s3.service.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";

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

    const include = [];
    if (req.user?.role !== "Student") {
      include.push({
        model: User,
        as: "uploader",
        attributes: ["name", "avatar"],
      });
    }

    const materials = await Material.findAll({
      where: {
        moduleId,
        categoryId,
      },
      include,
    });

    // Format response data
    const formattedMaterials = await Promise.all(
      materials.map(async (material) => {
        const { uploaderId, createdAt, updatedAt, uploader, ...rest } = material.get({
          plain: true,
        });

        // Generate presigned URL if it's a file
        let fileUrl = rest.url;
        if (rest.fileType !== "Link" && fileUrl && !fileUrl.startsWith("http")) {
          try {
             fileUrl = await s3Service.getFileUrl(fileUrl);
          } catch(e) {
             console.error("Failed to generate presigned URL for", rest.url, e);
          }
        }

        // Resolve uploader avatar to a full URL
        let resolvedUploader = null;
        if (uploader) {
          resolvedUploader = {
            name: uploader.name,
            avatar: await resolveAvatarUrl(uploader.avatar, uploader.name),
          };
        }

        return {
          ...rest,
          uploader: resolvedUploader,
          url: fileUrl,
          modifiedDate: formatRelativeDate(material.updatedAt),
        };
      })
    );

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
