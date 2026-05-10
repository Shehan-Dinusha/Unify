import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin creation of a new boost package.
 * 100% Compatible with Frontend BoostPackageForm (create mode) + BoostController admin page.
 */
export const createPackage = async (req, res, next) => {
  try {
    const adminId = req.user?.id || null;
    const result = await boostService.createPackage(req.body, adminId);
    return sendResponse(res, 201, true, "Boost package created successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in createPackage controller: ${error.message}`);
    next(error);
  }
};
