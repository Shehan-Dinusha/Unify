import { Material } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import fs from "fs";
import path from "path";

export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Material.findByPk(materialId);

    if (!material) {
      return sendResponse(res, 404, false, "Material not found", null);
    }

    const fileUrl = material.url;
    const isFile =
      fileUrl && !fileUrl.startsWith("http") && !fileUrl.startsWith("www");

    // Optional: Delete physical file if it's stored locally
    if (isFile) {
      const fullPath = path.resolve(fileUrl);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
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
