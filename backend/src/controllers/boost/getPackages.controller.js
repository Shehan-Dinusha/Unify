import BoostPackage from "../../modules/BoostPackage.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves all boost packages.
 * Business users see only 'live' packages.
 * Admins can include archived packages with ?includeArchived=true.
 * 100% Compatible with Frontend BoostController + BoostSelectPackage.
 *
 * Adds computed `duration` field (e.g., "24 Hours", "7 Days") that
 * the frontend renders as "Rs. X / {duration}" on each package card.
 */
export const getPackages = async (req, res, next) => {
  try {
    const { includeArchived } = req.query;

    const where = {};
    if (includeArchived !== 'true') {
      where.status = 'live';
    }

    const packages = await BoostPackage.findAll({
      where,
      order: [['createdAt', 'ASC']],
    });

    // Add computed fields for frontend compatibility
    const enriched = packages.map(pkg => {
      const plain = pkg.toJSON();
      plain.price = Number(plain.price);
      plain.duration = `${plain.durationValue} ${plain.durationUnit}`;
      return plain;
    });

    return sendResponse(res, 200, true, 'Boost packages retrieved successfully', {
      packages: enriched,
    });
  } catch (error) {
    logger.error(`Error in getPackages controller: ${error.message}`);
    next(error);
  }
};
