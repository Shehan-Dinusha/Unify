import BoostPackage from "../../modules/BoostPackage.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves a single boost package by ID.
 * Adds computed `duration` field for frontend compatibility.
 */
export const getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pkg = await BoostPackage.findByPk(id);

    if (!pkg) {
      return sendResponse(res, 404, false, 'Boost package not found');
    }

    const plain = pkg.toJSON();
    plain.price = Number(plain.price);
    plain.duration = `${plain.durationValue} ${plain.durationUnit}`;

    return sendResponse(res, 200, true, 'Boost package retrieved', plain);
  } catch (error) {
    logger.error(`Error in getPackageById controller: ${error.message}`);
    next(error);
  }
};
