import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves a single boost package by ID.
 */
export const getPackageById = async (req, res, next) => {
  try {
    const pkg = await boostService.getPackageById(req.params.id);
    return sendResponse(res, 200, true, "Boost package retrieved successfully", pkg);
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in getPackageById controller: ${error.message}`);
    next(error);
  }
};
