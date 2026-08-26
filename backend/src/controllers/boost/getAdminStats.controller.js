import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Returns DB-driven stats for the admin boost dashboard tiles.
export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await boostService.getAdminStats();
    return sendResponse(res, 200, true, "Admin stats retrieved.", { stats });
  } catch (error) {
    // Issue #21 fix: Add consistent error logging
    logger.error(`Error in getAdminStats controller: ${error.message}`);
    return sendResponse(res, error.statusCode || 500, false, error.message);
  }
};
