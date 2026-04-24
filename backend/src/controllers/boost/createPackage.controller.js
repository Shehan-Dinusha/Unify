import BoostPackage from "../../modules/BoostPackage.model.js";
import BoostLog from "../../modules/BoostLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Generates a unique package ID in format #PKG-YYYYMMDD-XXXX
 * Matching the exact pattern used in Report module (#RPT-YYYYMMDD-XXXX)
 */
const generatePackageId = async () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const id = `#PKG-${date}-${random}`;

  // Ensure uniqueness (extremely unlikely collision but matches the report pattern)
  const exists = await BoostPackage.findByPk(id);
  if (exists) {
    return generatePackageId(); // Recurse on collision
  }
  return id;
};

/**
 * Handle admin creation of a new boost package.
 * 100% Compatible with Frontend BoostPackageForm (create mode) + BoostController admin page.
 * Performs manual validation matching the Report module pattern.
 */
export const createPackage = async (req, res, next) => {
  try {
    const { name, price, durationValue, durationUnit, badge, description, features } = req.body;

    // 1. Manual Validation

    // Package name (Required, max 100 characters)
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return sendResponse(res, 400, false, 'Package name is required.');
    }
    if (name.length > 100) {
      return sendResponse(res, 400, false, 'Package name cannot exceed 100 characters.');
    }

    // Price (Required, must be a positive number)
    const parsedPrice = Number(price);
    if (price === undefined || price === null || price === '') {
      return sendResponse(res, 400, false, 'Price is required.');
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return sendResponse(res, 400, false, 'Price must be a positive number.');
    }

    // Duration value (Required, must be a positive integer)
    const parsedDuration = Number(durationValue);
    if (!durationValue) {
      return sendResponse(res, 400, false, 'Duration value is required.');
    }
    if (isNaN(parsedDuration) || parsedDuration <= 0 || !Number.isInteger(parsedDuration)) {
      return sendResponse(res, 400, false, 'Duration value must be a positive integer.');
    }

    // Duration unit (Required, must be one of Hours/Days/Weeks)
    const validUnits = ['Hours', 'Days', 'Weeks'];
    if (!durationUnit || !validUnits.includes(durationUnit)) {
      return sendResponse(res, 400, false, 'Duration unit must be one of: Hours, Days, Weeks.');
    }

    // Badge (Optional, validate if provided)
    const validBadges = ['No Badge', 'Most Popular', 'Premium', 'Best Value'];
    if (badge && !validBadges.includes(badge)) {
      return sendResponse(res, 400, false, 'Invalid badge type. Must be one of: No Badge, Most Popular, Premium, Best Value.');
    }

    // Description (Optional, max 500 characters)
    if (description && description.length > 500) {
      return sendResponse(res, 400, false, 'Description cannot exceed 500 characters.');
    }

    // Features (Optional, must be array of strings if provided)
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

    // 2. Duplicate Check
    const roundedPrice = Math.round(parsedPrice * 100) / 100;

    const existingPackage = await BoostPackage.findOne({
      where: {
        name: name.trim(),
        price: roundedPrice,
        durationValue: parsedDuration,
        durationUnit,
        status: 'live'
      }
    });

    if (existingPackage) {
      return sendResponse(
        res, 
        409, 
        false, 
        `A live package with the name "${name}" and this price/duration already exists.`
      );
    }

    // 3. Generate ID and create
    const id = await generatePackageId();

    // Compute the display duration string used by the frontend (e.g., "24 Hours", "7 Days")
    const duration = `${parsedDuration} ${durationUnit}`;

    const pkg = await BoostPackage.create({
      id,
      name: name.trim(),
      price: roundedPrice,
      durationValue: parsedDuration,
      durationUnit,
      description: description || null,
      badge: badge || 'No Badge',
      features: features ? features.filter(f => f.trim() !== '') : [],
      status: 'live',
    });

    await BoostLog.create({
      id: `log-${Date.now()}`,
      type: 'package_added',
      title: `New package '${pkg.name}' created`,
      description: `Tier added with pricing: Rs. ${Number(pkg.price).toLocaleString()} / ${duration}`
    });

    logger.info(`Boost package ${id} created by admin: ${name}`);

    // Return the full package object so frontend can use it immediately
    // Include computed `duration` field that frontend renders as "Rs. X / {duration}"
    return sendResponse(res, 201, true, 'Boost package created successfully', {
      id: pkg.id,
      name: pkg.name,
      price: Number(pkg.price),
      durationValue: pkg.durationValue,
      durationUnit: pkg.durationUnit,
      duration,
      badge: pkg.badge,
      description: pkg.description,
      features: pkg.features,
      status: pkg.status,
      createdAt: pkg.createdAt,
    });
  } catch (error) {
    logger.error(`Error in createPackage controller: ${error.message}`);
    next(error);
  }
};
