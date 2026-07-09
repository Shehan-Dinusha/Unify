import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

// Retrieves all boost configuration logs for the admin panel.
export const getLogs = async (req, res, next) => {
  try {
    const { page, limit, type } = req.query;
    const result = await boostService.getBoostLogs({ page, limit, type });
    return sendResponse(res, 200, true, "Boost logs retrieved successfully", result);
  } catch (error) {
    logger.error(`Error in getLogs controller: ${error.message}`);
    next(error);
  }
};
