import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

// Retrieves all boost configuration logs for the admin panel.
export const getLogs = async (req, res, next) => {
  try {
    // Issue #20 fix: Validate page and limit parameters with bounds checking
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 50;

    // Ensure page and limit are positive integers within safe bounds
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 50; // Cap at 100 per page

    const { type } = req.query;

    const result = await boostService.getBoostLogs({ page, limit, type });
    return sendResponse(res, 200, true, "Boost logs retrieved successfully", result);
  } catch (error) {
    logger.error(`Error in getLogs controller: ${error.message}`);
    next(error);
  }
};
