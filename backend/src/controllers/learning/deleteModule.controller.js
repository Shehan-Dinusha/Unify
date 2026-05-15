import {
  AcademicModule,
  Material,
  StudentProfile,
} from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import s3Service from "../../services/s3.service.js";

export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingModule = await AcademicModule.findByPk(id);

    if (!existingModule) {
      return sendResponse(res, 404, false, "Module not found.");
    }

    const studentProfile = await StudentProfile.findOne({
      where: { userId: req.user.id },
    });

    // If there's a creator degree and the current user is from a DIFFERENT degree,
    // only unlink the module from their degree rather than deleting it.
    if (
      studentProfile &&
      existingModule.creatorDegreeId &&
      existingModule.creatorDegreeId !== studentProfile.degreeId
    ) {
      await existingModule.removeDegree(studentProfile.degreeId);
      logger.info(
        `Module ID ${id} unlinked from degree ${studentProfile.degreeId}`,
      );
      return sendResponse(res, 200, true, "Module unlinked successfully.");
    }

    // Fetch all materials related to this module to delete them from S3
    const materials = await Material.findAll({ where: { moduleId: id } });
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

    await existingModule.destroy();

    logger.info(`Module ID ${id} deleted successfully`);
    return sendResponse(res, 200, true, "Module deleted successfully.");
  } catch (error) {
    logger.error(`Delete Module Error: ${error.message}`);
    next(error);
  }
};
