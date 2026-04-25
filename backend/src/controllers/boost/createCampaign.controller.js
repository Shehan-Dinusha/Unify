import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostPackage from "../../modules/BoostPackage.model.js";
import Post from "../../modules/Post.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Tax rate constant — 0.8% as used by frontend BoostSelectPackage.
 * Centralized here for easy future configuration.
 */
const TAX_RATE = 0.008;

/**
 * Generates a unique campaign ID in format #Campaign-XXXX-X
 */
const generateCampaignId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  return `#Campaign-${num}-${suffix}`;
};

/**
 * Handle business user creation of a new boost campaign.
 * 100% Compatible with Frontend BoostConfirmOrder → BoostPostSuccess flow.
 * Performs manual validation matching the Report module pattern.
 */
export const createCampaign = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;

    const {
      postId,
      packageId,
      name,
      postTitle,
      description,
      image,
      estReach,
      placement,
    } = req.body;

    // 1. Manual Validation

    // Post ID (Required)
    if (!postId) {
      return sendResponse(res, 400, false, 'Post ID is required to create a boost campaign.');
    }

    // Package ID (Required)
    if (!packageId) {
      return sendResponse(res, 400, false, 'Package ID is required.');
    }

    // 2. Verify package exists and is live
    const pkg = await BoostPackage.findByPk(packageId);
    if (!pkg) {
      return sendResponse(res, 404, false, 'Selected boost package not found.');
    }
    if (pkg.status !== 'live') {
      return sendResponse(res, 400, false, 'Selected package is no longer available.');
    }

    // 3. Check for duplicate active campaign on the same post by the same user
    const existingCampaign = await BoostCampaign.findOne({
      where: {
        postId,
        userId,
        status: { [Op.in]: ['Pending', 'Active', 'Paused'] },
      },
    });

    if (existingCampaign) {
      return sendResponse(
        res,
        409,
        false,
        'An active, pending, or paused boost campaign already exists for this post.'
      );
    }

    // 4. Compute financials
    const subtotal = Number(pkg.price);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    // 5. Compute duration in days
    let durationDays;
    if (pkg.durationUnit === 'Hours') {
      durationDays = 1;
    } else if (pkg.durationUnit === 'Days') {
      durationDays = pkg.durationValue;
    } else if (pkg.durationUnit === 'Weeks') {
      durationDays = pkg.durationValue * 7;
    } else {
      durationDays = pkg.durationValue;
    }

    const dailyRate = durationDays > 0 ? Math.round((subtotal / durationDays) * 100) / 100 : subtotal;

    // 6. Compute date range
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // 7. Create campaign
    const campaignId = generateCampaignId();

    const campaign = await BoostCampaign.create({
      campaignId,
      userId,
      postId,
      packageId,
      name: name || `Boost for Post #${postId}`,
      postTitle: postTitle || null,
      description: description || null,
      image: image || null,
      status: 'Pending',
      budget: total,
      dailyRate,
      durationDays,
      estReach: estReach || null,
      placement: placement || 'Feed',
      subtotal,
      tax,
      total,
      startDate,
      endDate,
      paymentStatus: 'pending',
    });

    logger.info(`Boost campaign ${campaignId} created by user ${userId} for post ${postId} with package ${packageId}`);

    return sendResponse(res, 201, true, 'Boost campaign created successfully', {
      id: campaign.id,
      campaignId: campaign.campaignId,
      status: campaign.status,
      paymentStatus: campaign.paymentStatus,
      budget: campaign.budget,
      durationDays: campaign.durationDays,
      subtotal: campaign.subtotal,
      tax: campaign.tax,
      total: campaign.total,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
  } catch (error) {
    logger.error(`Error in createCampaign controller: ${error.message}`);
    next(error);
  }
};
