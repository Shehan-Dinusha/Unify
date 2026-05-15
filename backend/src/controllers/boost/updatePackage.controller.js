import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Handle admin update of an existing boost package.
export const updatePackage = async (req, res, next) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return sendResponse(res, 401, false, "Admin authentication required.");
    }

    const result = await boostService.updatePackage(req.params.id, req.body, adminId);

    if (result.noChange) {
      return sendResponse(
        res,
        200,
        true,
        "No changes detected. Package remains the same.",
        result.package
      );
    }

    return sendResponse(
      res,
      200,
      true,
      "Boost package updated successfully",
      result.package
    );
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in updatePackage controller: ${error.message}`);
    next(error);
  }
};
