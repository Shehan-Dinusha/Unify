import { Material } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import fs from "fs";
import path from "path";
import s3Service from "../../services/s3.service.js";

export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Material.findByPk(materialId);

    if (!material) {
      return sendResponse(res, 404, false, "Material not found", null);
    }

    const fileUrl = material.url;

    // Delete file from S3 or locally
    if (material.fileType !== "Link" && fileUrl) {
      if (!fileUrl.startsWith("http")) {
        if (fileUrl.startsWith("learning_materials/")) {
          try {
            await s3Service.deleteFile(fileUrl);
          } catch (s3Error) {
            console.error("Failed to delete from S3:", s3Error);
          }
        } else {
          // Fallback for any older local files
          const fullPath = path.resolve(fileUrl);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }
    }

    await material.destroy();

    return sendResponse(res, 200, true, "Material deleted successfully", null);
  } catch (error) {
    console.error("Error deleting material:", error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error while deleting material",
      null,
    );
  }
};
