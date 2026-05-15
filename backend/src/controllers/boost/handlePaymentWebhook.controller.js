import { Op } from 'sequelize';
import BoostCampaign from "../../modules/BoostCampaign.model.js";
import Post from "../../modules/Post.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

// Handles payment events from the payment gateway (Stripe).
export const handlePaymentWebhook = async (req, res, next) => {
  try {
    const { campaignId, paymentStatus } = req.body;

    // 1. Validate required fields
    if (!campaignId) {
      return sendResponse(res, 400, false, 'Campaign ID is required.');
    }

    const validPaymentStatuses = ['completed', 'failed', 'refunded'];
    if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
      return sendResponse(res, 400, false, 'Invalid payment status. Must be one of: completed, failed, refunded.');
    }

    // 2. Find campaign
    const isNumeric = !isNaN(campaignId) && !isNaN(parseFloat(campaignId));
    const campaign = await BoostCampaign.findOne({
      where: {
        [Op.or]: [
          isNumeric ? { id: parseInt(campaignId, 10) } : null,
          { campaignId: campaignId }
        ].filter(Boolean)
      }
    });

    if (!campaign) {
      return sendResponse(res, 404, false, 'Campaign not found');
    }

    // 3. Update payment status
    campaign.paymentStatus = paymentStatus;

    // 4. Handle side-effects based on payment outcome
    if (paymentStatus === 'completed') {
      // Activate the campaign
      campaign.status = 'Active';
      campaign.startDate = new Date();
      const endDate = new Date(campaign.startDate);
      endDate.setDate(endDate.getDate() + campaign.durationDays);
      campaign.endDate = endDate;

      // Mark the post as promoted
      try {
        const post = await Post.findByPk(campaign.postId);
        if (post) {
          post.isPromoted = true;
          await post.save();
          logger.info(`Post ${campaign.postId} marked as promoted for campaign ${campaign.campaignId}`);
        }
      } catch (postError) {
        logger.error(`Failed to update post promotion status: ${postError.message}`);
        // Non-blocking — campaign is still activated even if post update fails
      }

      logger.info(`Campaign ${campaign.campaignId} activated after successful payment`);
    } else if (paymentStatus === 'failed') {
      // Cancel the campaign
      campaign.status = 'Cancelled';
      logger.info(`Campaign ${campaign.campaignId} cancelled due to payment failure`);
    } else if (paymentStatus === 'refunded') {
      // Pause the campaign and mark as refunded
      campaign.status = 'Cancelled';

      // Remove promotion from post
      try {
        const post = await Post.findByPk(campaign.postId);
        if (post) {
          post.isPromoted = false;
          await post.save();
        }
      } catch (postError) {
        logger.error(`Failed to update post promotion status on refund: ${postError.message}`);
      }

      logger.info(`Campaign ${campaign.campaignId} cancelled and refunded`);
    }

    await campaign.save();

    return sendResponse(res, 200, true, 'Payment status updated successfully', {
      id: campaign.id,
      campaignId: campaign.campaignId,
      status: campaign.status,
      paymentStatus: campaign.paymentStatus,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
  } catch (error) {
    logger.error(`Error in handlePaymentWebhook controller: ${error.message}`);
    next(error);
  }
};
