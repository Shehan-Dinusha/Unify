import { Op } from 'sequelize';
import { sequelize } from "../../modules/index.js";
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * Retrieves detailed analytics for a specific campaign.
 * 100% Compatible with Frontend BoostAnalytics page stats + chart data.
 */
export const getCampaignAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isNumeric = !isNaN(id) && !isNaN(parseFloat(id));
    const campaign = await BoostCampaign.findOne({
      where: {
        [Op.or]: [
          isNumeric ? { id: parseInt(id, 10) } : null,
          { campaignId: id }
        ].filter(Boolean)
      }
    });

    if (!campaign) {
      return sendResponse(res, 404, false, 'Campaign not found');
    }

    const internalId = campaign.id;

    // Aggregate interaction data
    const totalInteractions = await BoostInteraction.count({
      where: { campaignId: internalId },
    });

    const clickCount = await BoostInteraction.count({
      where: { campaignId: internalId, action: 'Click' },
    });

    const purchaseCount = await BoostInteraction.count({
      where: { campaignId: internalId, action: 'Purchase' },
    });

    // Breakdown by action type
    const byAction = await BoostInteraction.findAll({
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('action')), 'count'],
      ],
      where: { campaignId: internalId },
      group: ['action'],
      raw: true,
    });

    // Compute metrics
    const impressions = campaign.impressions || 0;
    const clicks = campaign.clicks || clickCount;
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';
    const adSpend = Number(campaign.total) || 0;
    const salesAttributed = Number(campaign.salesAttributed) || 0;
    const roi = adSpend > 0 ? ((salesAttributed / adSpend)).toFixed(1) : '0.0';

    const analytics = {
      totalReach: impressions.toLocaleString(),
      clicks: clicks.toLocaleString(),
      ctr: `${ctr}%`,
      adSpend: `Rs ${adSpend.toFixed(2)}`,
      salesAttributed: `Rs. ${salesAttributed.toFixed(0)}`,
      roi: `${roi}x`,
      totalInteractions,
      conversionFunnel: {
        impressions,
        clicks,
        clicksRate: impressions > 0 ? `${((clicks / impressions) * 100).toFixed(1)}%` : '0.0%',
        purchases: purchaseCount,
        purchasesRate: clicks > 0 ? `${((purchaseCount / clicks) * 100).toFixed(1)}%` : '0.0%',
      },
      byAction,
      campaign: {
        id: campaign.id,
        campaignId: campaign.campaignId,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        durationDays: campaign.durationDays,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      },
    };

    return sendResponse(res, 200, true, 'Campaign analytics retrieved successfully', analytics);
  } catch (error) {
    logger.error(`Error in getCampaignAnalytics controller: ${error.message}`);
    next(error);
  }
};
