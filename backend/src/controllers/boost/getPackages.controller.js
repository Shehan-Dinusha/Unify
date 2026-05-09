import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves all boost packages.
 * Business users see only 'live' packages.
 * Admins can include archived packages with ?includeArchived=true.
 */
export const getPackages = async (req, res, next) => {
  try {
    const includeArchived = req.query.includeArchived === "true";
    const packages = await boostService.getAllPackages(includeArchived);
    return sendResponse(res, 200, true, "Boost packages retrieved successfully", {
      packages,
    });
  } catch (error) {
    logger.error(`Error in getPackages controller: ${error.message}`);
    next(error);
  }
};
