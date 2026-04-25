import { Op } from 'sequelize';
import BoostPackage from "../../modules/BoostPackage.model.js";
import BoostLog from "../../modules/BoostLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Handle admin update of an existing boost package.
 * 100% Compatible with Frontend BoostPackageForm (edit mode).
 * Performs manual validation matching the Report module pattern.
 *
 * Includes:
 * - "No change" detection: if all submitted values are identical to current, returns 200 with a clear message
 * - Duplicate check: prevents conflicting with another live package
 */
export const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, durationValue, durationUnit, badge, description, features } = req.body;

    // 1. Find package
    const pkg = await BoostPackage.findByPk(id);

    if (!pkg) {
      return sendResponse(res, 404, false, 'Boost package not found');
    }

    if (pkg.status === 'archived') {
      return sendResponse(res, 400, false, 'Cannot update an archived package. Restore it first.');
    }

    // 2. Manual Validation (only for provided fields)

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return sendResponse(res, 400, false, 'Package name cannot be empty.');
      }
      if (name.length > 100) {
        return sendResponse(res, 400, false, 'Package name cannot exceed 100 characters.');
      }
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return sendResponse(res, 400, false, 'Price must be a positive number.');
      }
    }

    if (durationValue !== undefined) {
      const parsedDuration = Number(durationValue);
      if (isNaN(parsedDuration) || parsedDuration <= 0 || !Number.isInteger(parsedDuration)) {
        return sendResponse(res, 400, false, 'Duration value must be a positive integer.');
      }
    }

    if (durationUnit !== undefined) {
      const validUnits = ['Hours', 'Days', 'Weeks'];
      if (!validUnits.includes(durationUnit)) {
        return sendResponse(res, 400, false, 'Duration unit must be one of: Hours, Days, Weeks.');
      }
    }

    if (badge !== undefined) {
      const validBadges = ['No Badge', 'Most Popular', 'Premium', 'Best Value'];
      if (!validBadges.includes(badge)) {
        return sendResponse(res, 400, false, 'Invalid badge type.');
      }
    }

    if (description !== undefined && description !== null && description.length > 500) {
      return sendResponse(res, 400, false, 'Description cannot exceed 500 characters.');
    }

    if (features !== undefined && features !== null) {
      if (!Array.isArray(features)) {
        return sendResponse(res, 400, false, 'Features must be an array of strings.');
      }
      for (const feature of features) {
        if (typeof feature !== 'string') {
          return sendResponse(res, 400, false, 'Each feature must be a string.');
        }
      }
    }

    // 3. Compute final values
    const finalName = name !== undefined ? name.trim() : pkg.name;
    const finalPrice = price !== undefined ? Math.round(Number(price) * 100) / 100 : Number(pkg.price);
    const finalDurationVal = durationValue !== undefined ? Number(durationValue) : pkg.durationValue;
    const finalDurationUnit = durationUnit !== undefined ? durationUnit : pkg.durationUnit;
    const finalBadge = badge !== undefined ? badge : pkg.badge;
    const finalDescription = description !== undefined ? description : pkg.description;
    const finalFeatures = features !== undefined
      ? (features ? features.filter(f => f.trim() !== '') : [])
      : pkg.features;

    // 4. "No Change" Detection
    // Compare every field — if nothing actually changed, tell the admin
    const nothingChanged =
      finalName === pkg.name &&
      finalPrice === Number(pkg.price) &&
      finalDurationVal === pkg.durationValue &&
      finalDurationUnit === pkg.durationUnit &&
      finalBadge === pkg.badge &&
      finalDescription === pkg.description &&
      JSON.stringify(finalFeatures) === JSON.stringify(pkg.features);

    if (nothingChanged) {
      return sendResponse(res, 200, true, 'No changes detected. Package remains the same.', {
        id: pkg.id,
        name: pkg.name,
        price: Number(pkg.price),
        durationValue: pkg.durationValue,
        durationUnit: pkg.durationUnit,
        duration: `${pkg.durationValue} ${pkg.durationUnit}`,
        badge: pkg.badge,
        description: pkg.description,
        features: pkg.features,
        status: pkg.status,
      });
    }

    // 5. Duplicate Check — only if name/price/duration is changing
    const duplicate = await BoostPackage.findOne({
      where: {
        name: finalName,
        price: finalPrice,
        durationValue: finalDurationVal,
        durationUnit: finalDurationUnit,
        status: 'live',
        id: { [Op.ne]: id }
      }
    });

    if (duplicate) {
      return sendResponse(
        res,
        409,
        false,
        `Another live package with the name "${finalName}" and this price/duration already exists.`
      );
    }

    // 6. Apply updates
    pkg.name = finalName;
    pkg.price = finalPrice;
    pkg.durationValue = finalDurationVal;
    pkg.durationUnit = finalDurationUnit;
    pkg.badge = finalBadge;
    pkg.description = finalDescription;
    pkg.features = finalFeatures;

    await pkg.save();

    await BoostLog.create({
      id: `log-${Date.now()}`,
      type: 'package_updated',
      title: `Package '${pkg.name}' updated`,
      description: `Configured: Rs. ${Number(pkg.price).toLocaleString()} / ${pkg.durationValue} ${pkg.durationUnit}`
    });

    logger.info(`Boost package ${id} updated by admin. Name: ${pkg.name}`);

    // Return the full updated package with computed duration
    return sendResponse(res, 200, true, 'Boost package updated successfully', {
      id: pkg.id,
      name: pkg.name,
      price: Number(pkg.price),
      durationValue: pkg.durationValue,
      durationUnit: pkg.durationUnit,
      duration: `${pkg.durationValue} ${pkg.durationUnit}`,
      badge: pkg.badge,
      description: pkg.description,
      features: pkg.features,
      status: pkg.status,
      updatedAt: pkg.updatedAt,
    });
  } catch (error) {
    logger.error(`Error in updatePackage controller: ${error.message}`);
    next(error);
  }
};
