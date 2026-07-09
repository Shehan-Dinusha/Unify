import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Get active boosts for the current user where expiryDate > NOW.
export const getMyBoosts = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    const boosts = await boostService.getUserActiveBoosts(userId);
    return sendResponse(res, 200, true, "Active boosts retrieved successfully", {
      boosts,
    });
  } catch (error) {
    logger.error(`Error in getMyBoosts controller: ${error.message}`);
    next(error);
  }
};
