import { Op } from "sequelize";
import BoostPurchase from "../../modules/BoostPurchase.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Track metrics (impressions or clicks) for boosted posts
 * @route   POST /api/v1/boosts/track
 * @access  Public
 */
export const trackMetrics = async (req, res, next) => {
  try {
    const { postId, postType, action, content, impact, userId } = req.body;
    const actorId = req.user?.id || userId || 1; // Fallback to 1

    if (!postId || !action) {
      return sendResponse(res, 400, false, "postId and action are required");
    }

    const validActions = ['impression', 'click', 'Like', 'Comment', 'Purchase'];
    if (!validActions.includes(action)) {
      return sendResponse(res, 400, false, `Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    // Find the currently active boost purchase for this post
    const purchase = await BoostPurchase.findOne({
      where: {
        postId: parseInt(postId, 10),
        status: 'active',
        expiryDate: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });

    if (purchase) {
      if (action === 'impression') {
        purchase.impressions = (purchase.impressions || 0) + 1;
        await purchase.save();
      } else if (action === 'click') {
        purchase.clicks = (purchase.clicks || 0) + 1;
        // Safeguard: Clicks should theoretically never exceed impressions
        if (purchase.clicks > (purchase.impressions || 0)) {
          purchase.impressions = purchase.clicks;
        }
        await purchase.save();
      } else {
        // Rich interaction (Like, Comment, Purchase)
        await BoostInteraction.create({
          purchaseId: purchase.id,
          userId: actorId,
          action: action,
          content: content || null,
          impact: impact || (action === 'Purchase' ? 'High' : 'Medium'),
        });
        
        // Also bump clicks for these, since they imply engagement
        purchase.clicks = (purchase.clicks || 0) + 1;
        if (purchase.clicks > (purchase.impressions || 0)) {
          purchase.impressions = purchase.clicks;
        }
        await purchase.save();
      }
    }

    return sendResponse(res, 200, true, "Metric tracked successfully");
  } catch (error) {
    logger.error(`Error in trackMetrics controller: ${error.message}`);
    next(error);
  }
};
