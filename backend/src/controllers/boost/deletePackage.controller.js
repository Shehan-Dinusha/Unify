import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin soft-deletion (archiving) of a boost package.
 * 100% Compatible with Frontend BoostController delete modal.
 */
export const deletePackage = async (req, res, next) => {
  try {
    const adminId = req.user?.id || null;
    const result = await boostService.deletePackage(req.params.id, adminId);
    return sendResponse(res, 200, true, "Boost package deleted successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in deletePackage controller: ${error.message}`);
    next(error);
  }
};
