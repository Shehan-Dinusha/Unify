import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Handle user purchase of a boost package.
export const purchaseBoost = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }
    
    const { packageId, postId, postType } = req.body;

    if (!packageId) {
      return sendResponse(res, 400, false, "Package ID is required.");
    }
    
    if (postType) {
      const validPostTypes = ['normal', 'club-product', 'club-event', 'boarding'];
      if (!validPostTypes.includes(postType)) {
        return sendResponse(
          res,
          400,
          false,
          `Invalid postType. Must be one of: ${validPostTypes.join(', ')}`
        );
      }
    }

    // Issue #16 fix: Validate postType if provided
    if (postType) {
      const validPostTypes = ['normal', 'club-product', 'club-event', 'boarding'];
      if (!validPostTypes.includes(postType)) {
        return sendResponse(
          res,
          400,
          false,
          `Invalid postType. Must be one of: ${validPostTypes.join(', ')}`
        );
      }
    }

    // Issue #16 fix: Validate postType if provided
    if (postType) {
      const validPostTypes = ['normal', 'club-product', 'club-event', 'boarding'];
      if (!validPostTypes.includes(postType)) {
        return sendResponse(
          res,
          400,
          false,
          `Invalid postType. Must be one of: ${validPostTypes.join(', ')}`
        );
      }
    }

    const result = await boostService.purchaseBoost(userId, packageId, postId, postType);

    return sendResponse(res, 201, true, "Boost purchased successfully", result);
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in purchaseBoost controller: ${error.message}`);
    next(error);
  }
};
