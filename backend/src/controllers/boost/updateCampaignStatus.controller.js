import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

const VALID_TRANSITIONS = {
  'Pending': ['Active', 'Cancelled'],
  'Active': ['Paused', 'Completed', 'Cancelled'],
  'Paused': ['Active', 'Cancelled'],
  'Completed': [],       // Terminal state
  'Cancelled': [],       // Terminal state
};

//Updates the status of a boost campaign.
export const updateCampaignStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    // 1. Validate status value
    const validStatuses = ['Pending', 'Active', 'Paused', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return sendResponse(res, 400, false, 'Invalid status. Must be one of: Pending, Active, Paused, Completed, Cancelled.');
    }

    // 2. Find campaign (support either numeric id or string campaignId)
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

    // 3. Check ownership (business user can only cancel their own)
    if (campaign.userId !== userId && status !== 'Cancelled') {
      return sendResponse(res, 403, false, 'You do not have permission to update this campaign.');
    }

    // 4. Validate state transition
    const allowedNextStatuses = VALID_TRANSITIONS[campaign.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return sendResponse(
        res,
        400,
        false,
        `Cannot transition from '${campaign.status}' to '${status}'. Allowed transitions: ${allowedNextStatuses.join(', ') || 'none (terminal state)'}.`
      );
    }

    // 5. Apply status change
    campaign.status = status;

    // Handle side-effects of status changes
    if (status === 'Active' && !campaign.startDate) {
      campaign.startDate = new Date();
      const endDate = new Date(campaign.startDate);
      endDate.setDate(endDate.getDate() + campaign.durationDays);
      campaign.endDate = endDate;
    }

    await campaign.save();

    logger.info(`Campaign ${campaign.campaignId} status updated to '${status}' by user ${userId}`);

    return sendResponse(res, 200, true, 'Campaign status updated successfully', {
      id: campaign.id,
      campaignId: campaign.campaignId,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
  } catch (error) {
    logger.error(`Error in updateCampaignStatus controller: ${error.message}`);
    next(error);
  }
};
