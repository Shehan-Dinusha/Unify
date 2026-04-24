import { AcademicModule } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendResponse(res, 400, false, "Module ID is required.");
    }

    const existingModule = await AcademicModule.findByPk(id);

    if (!existingModule) {
      return sendResponse(res, 404, false, "Module not found.");
    }

    await existingModule.destroy();

    logger.info(`Module ID ${id} deleted successfully`);
    return sendResponse(res, 200, true, "Module deleted successfully.");
  } catch (error) {
    logger.error(`Delete Module Error: ${error.message}`);
    next(error);
  }
};
