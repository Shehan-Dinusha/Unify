import BoostPackage from "../../modules/BoostPackage.model.js";
import BoostLog from "../../modules/BoostLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin soft-deletion (archiving) of a boost package.
 * 100% Compatible with Frontend BoostController delete modal.
 */
export const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pkg = await BoostPackage.findByPk(id);

    if (!pkg) {
      return sendResponse(res, 404, false, 'Boost package not found');
    }

    if (pkg.status === 'archived') {
      return sendResponse(res, 400, false, 'Package is already archived');
    }

    pkg.status = 'archived';
    await pkg.save();

    await BoostLog.create({
      id: `log-${Date.now()}`,
      type: 'package_deleted',
      title: `Package '${pkg.name}' removed`,
      description: 'Package tier has been decommissioned from active lists'
    });

    logger.info(`Boost package ${id} archived by admin. Name: ${pkg.name}`);

    const plain = pkg.toJSON();
    plain.price = Number(plain.price);
    plain.duration = `${plain.durationValue} ${plain.durationUnit}`;

    return sendResponse(res, 200, true, 'Boost package deleted successfully', plain);
  } catch (error) {
    logger.error(`Error in deletePackage controller: ${error.message}`);
    next(error);
  }
};
