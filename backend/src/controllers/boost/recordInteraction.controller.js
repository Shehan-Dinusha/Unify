import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

//Records a user interaction on a boosted campaign.
export const recordInteraction = async (req, res, next) => {
  try {
    const { id } = req.params; // campaign id
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    const { action, content, impact, date } = req.body;

    // 1. Validate action
    const validActions = ['Comment', 'Like', 'Share', 'Click', 'Purchase'];
    if (!action || !validActions.includes(action)) {
      return sendResponse(res, 400, false, 'A valid action is required. Must be one of: Comment, Like, Share, Click, Purchase.');
    }

    // 2. Validate optional fields
    if (content && content.length > 500) {
      return sendResponse(res, 400, false, 'Content cannot exceed 500 characters.');
    }

    if (impact) {
      const validImpacts = ['High', 'Medium', 'Low', 'Conversion'];
      if (!validImpacts.includes(impact)) {
        return sendResponse(res, 400, false, 'Impact must be one of: High, Medium, Low, Conversion.');
      }
    }

    // 3. Find campaign
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

    if (campaign.status !== 'Active') {
      return sendResponse(res, 400, false, 'Cannot record interactions on a non-active campaign.');
    }

    // 4. Format date if not provided
    const formattedDate = date || new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ', ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 5. Create interaction
    const interaction = await BoostInteraction.create({
      campaignId: campaign.id,
      userId,
      action,
      content: content || null,
      impact: impact || 'Medium',
      date: formattedDate,
    });

    // 6. Update campaign counters
    campaign.impressions = (campaign.impressions || 0) + 1;

    if (action === 'Click') {
      campaign.clicks = (campaign.clicks || 0) + 1;
    }

    if (action === 'Purchase') {
      // For purchase, increment salesAttributed by a nominal amount
      // This would be replaced by actual order value in production
      campaign.salesAttributed = Number(campaign.salesAttributed || 0) + 100;
    }

    await campaign.save();

    logger.info(`Interaction recorded on campaign ${campaign.campaignId}: ${action} by user ${userId}`);

    return sendResponse(res, 201, true, 'Interaction recorded successfully', {
      id: interaction.id,
      action: interaction.action,
      campaignId: campaign.campaignId,
    });
  } catch (error) {
    logger.error(`Error in recordInteraction controller: ${error.message}`);
    next(error);
  }
};
