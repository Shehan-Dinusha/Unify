import { Op } from "sequelize";
import BoostPurchase from "../../modules/BoostPurchase.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import BoostImpressionLog from "../../modules/BoostImpressionLog.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { sequelize } from "../../modules/index.js";

/**
 * @desc    Track metrics (impressions or clicks) for boosted posts
 * @route   POST /api/v1/boosts/track
 * @access  Private
 */
export const trackMetrics = async (req, res, next) => {
  try {
    const { postId, postType, action, content, impact } = req.body;
    const actorId = req.user?.id;

    if (!actorId) {
      return sendResponse(res, 401, false, "Authentication required");
    }

    if (!postId || !action) {
      return sendResponse(res, 400, false, "postId and action are required");
    }

    const validActions = ['impression', 'click', 'Like', 'Comment', 'Purchase'];
    if (!validActions.includes(action)) {
      return sendResponse(res, 400, false, `Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    // ── Find the currently active boost purchase for this post
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
      // All metric updates must use transactions to prevent race conditions (Issue #14 fix)
      const transaction = await sequelize.transaction();
      try {
        if (action === 'impression') {
          // Deduplicate impressions per user per day
          const dayBucket = new Date().toISOString().split('T')[0];
          const [log, created] = await BoostImpressionLog.findOrCreate({
            where: {
              userId: actorId,
              postId: parseInt(postId, 10),
              dayBucket: dayBucket,
            },
            defaults: {
              postType: postType || null,
            },
            transaction,
          });

          if (created) {
            purchase.impressions = (purchase.impressions || 0) + 1;
            await purchase.save({ transaction }); // Issue #13 fix: pass transaction
          }
        } else if (action === 'click') {
          purchase.clicks = (purchase.clicks || 0) + 1;
          // Safeguard: Clicks should theoretically never exceed impressions
          if (purchase.clicks > (purchase.impressions || 0)) {
            purchase.impressions = purchase.clicks;
          }
          await purchase.save({ transaction }); // Issue #13 fix: add transaction here
        } else {
          // Rich interaction (Like, Comment, Purchase)
          await BoostInteraction.create(
            {
              purchaseId: purchase.id,
              userId: actorId,
              action: action,
              content: content || null,
              impact: impact || (action === 'Purchase' ? 'High' : 'Medium'),
            },
            { transaction }
          );
          
          // Also bump clicks for these, since they imply engagement
          purchase.clicks = (purchase.clicks || 0) + 1;
          if (purchase.clicks > (purchase.impressions || 0)) {
            purchase.impressions = purchase.clicks;
          }
          await purchase.save({ transaction }); // Issue #13 fix: add transaction here
        }

        await transaction.commit();
      } catch (error) {
        if (transaction && !transaction.finished) {
          await transaction.rollback().catch(() => {});
        }
        throw error;
      }
    }

    return sendResponse(res, 200, true, "Metric tracked successfully");
  } catch (error) {
    logger.error(`Error in trackMetrics controller: ${error.message}`);
    next(error);
  }
};
