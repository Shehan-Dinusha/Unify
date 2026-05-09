import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle user purchase of a boost package.
 * Creates BoostPurchase record, calculates expiry, returns transaction details.
 * 100% Compatible with Frontend BoostConfirmOrder → BoostPostSuccess flow.
 */
export const purchaseBoost = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1; // TODO: remove fallback after auth is enforced
    const { packageId, postId } = req.body;

    if (!packageId) {
      return sendResponse(res, 400, false, "Package ID is required.");
    }

    const result = await boostService.purchaseBoost(userId, packageId, postId);

    return sendResponse(res, 201, true, "Boost purchased successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in purchaseBoost controller: ${error.message}`);
    next(error);
  }
};
