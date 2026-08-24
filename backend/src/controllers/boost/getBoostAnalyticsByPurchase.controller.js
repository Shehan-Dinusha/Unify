import { Op } from 'sequelize';
import { sequelize } from "../../modules/index.js";
import BoostPurchase from "../../modules/BoostPurchase.model.js";
import BoostPackage from "../../modules/BoostPackage.model.js";
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Get boost analytics for a business user via their BoostPurchase ID.
 *          Looks up the linked BoostCampaign (by postId + userId) if it exists,
 *          otherwise derives analytics directly from the BoostPurchase record.
 * @route   GET /api/v1/boosts/purchase/:purchaseId/analytics
 * @access  Private (owner of the purchase)
 */
export const getBoostAnalyticsByPurchase = async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, 'Authentication required.');
    }

    // 1. Look up the BoostPurchase and verify ownership
    const purchase = await BoostPurchase.findOne({
      where: { id: parseInt(purchaseId, 10), userId },
      include: [
        {
          model: BoostPackage,
          as: 'package',
          attributes: ['id', 'name', 'price', 'durationValue', 'durationUnit', 'badge', 'boostConfig'],
        },
      ],
    });

    if (!purchase) {
      return sendResponse(res, 404, false, 'Boost purchase not found or unauthorized.');
    }

    // 2. Try to find a linked BoostCampaign by postId + userId
    let campaign = null;
    if (purchase.postId) {
      campaign = await BoostCampaign.findOne({
        where: {
          postId: purchase.postId,
          userId,
          status: { [Op.in]: ['Pending', 'Active', 'Paused', 'Completed'] },
        },
        order: [['createdAt', 'DESC']],
      });
    }

    // 3. Build analytics — from BoostCampaign if available, otherwise from BoostPurchase
    let impressions = 0;
    let clicks = 0;
    let purchaseCount = 0;
    let adSpend = Number(purchase.amount) || 0;
    let salesAttributed = 0;
    let totalInteractions = 0;
    let byAction = [];
    let campaignInfo = null;

    if (campaign) {
      // Use campaign-level data
      const internalId = campaign.id;

      totalInteractions = await BoostInteraction.count({ where: { campaignId: internalId } });
      const clickCountFromInteractions = await BoostInteraction.count({ where: { campaignId: internalId, action: 'Click' } });
      purchaseCount = await BoostInteraction.count({ where: { campaignId: internalId, action: 'Purchase' } });

      byAction = await BoostInteraction.findAll({
        attributes: ['action', [sequelize.fn('COUNT', sequelize.col('action')), 'count']],
        where: { campaignId: internalId },
        group: ['action'],
        raw: true,
      });

      impressions = campaign.impressions || 0;
      clicks = campaign.clicks || clickCountFromInteractions;
      adSpend = Number(campaign.total) || adSpend;
      salesAttributed = Number(campaign.salesAttributed) || 0;

      campaignInfo = {
        id: campaign.id,
        campaignId: campaign.campaignId,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        durationDays: campaign.durationDays,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      };
    }

    // 4. Compute derived metrics
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';
    const roi = adSpend > 0 ? (salesAttributed / adSpend).toFixed(1) : '0.0';

    // 5. Build post info from purchase
    const pkg = purchase.package;
    const durationDays = pkg
      ? pkg.durationUnit === 'Hours' ? 1
        : pkg.durationUnit === 'Days' ? pkg.durationValue
        : pkg.durationValue * 7
      : 0;

    const analytics = {
      // Post/purchase identity
      purchaseId: purchase.id,
      postId: purchase.postId,
      transactionId: purchase.transactionId,
      packageName: pkg?.name || 'Boost Package',
      packageBadge: pkg?.badge,
      purchaseDate: purchase.purchaseDate,
      expiryDate: purchase.expiryDate,
      durationDays,
      // Campaign info (null if no campaign was created via Campaign flow)
      campaign: campaignInfo,
      // Core metrics
      totalReach: impressions.toLocaleString(),
      clicks: clicks.toLocaleString(),
      ctr: `${ctr}%`,
      adSpend: `Rs ${adSpend.toFixed(2)}`,
      salesAttributed: `Rs. ${salesAttributed.toFixed(0)}`,
      roi: `${roi}x`,
      totalInteractions,
      // Funnel
      conversionFunnel: {
        impressions,
        clicks,
        clicksRate: impressions > 0 ? `${((clicks / impressions) * 100).toFixed(1)}%` : '0.0%',
        purchases: purchaseCount,
        purchasesRate: clicks > 0 ? `${((purchaseCount / clicks) * 100).toFixed(1)}%` : '0.0%',
      },
      byAction,
    };

    return sendResponse(res, 200, true, 'Boost analytics retrieved successfully', analytics);
  } catch (error) {
    logger.error(`Error in getBoostAnalyticsByPurchase: ${error.message}`);
    next(error);
  }
};
