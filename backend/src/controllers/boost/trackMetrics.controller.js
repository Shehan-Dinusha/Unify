import { Op } from "sequelize";
import BoostPurchase from "../../modules/BoostPurchase.model.js";
import BoostInteraction from "../../modules/BoostInteraction.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import BoostImpressionLog from "../../modules/BoostImpressionLog.model.js";
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

    // ─── ISSUE #1: Validate postId is a valid positive integer ────────────
    const postIdNum = parseInt(postId, 10);
    if (isNaN(postIdNum) || postIdNum <= 0) {
      return sendResponse(res, 400, false, "postId must be a valid positive number");
    }

    // ─── ISSUE #1: Validate postType against whitelist ────────────────────
    const validPostTypes = ['normal', 'club-product', 'club-event', 'boarding'];
    if (postType && !validPostTypes.includes(postType)) {
      return sendResponse(
        res,
        400,
        false,
        `Invalid postType. Must be one of: ${validPostTypes.join(', ')}`
      );
    }

    const validActions = ['impression', 'click', 'Like', 'Comment', 'Purchase'];
    if (!validActions.includes(action)) {
      return sendResponse(res, 400, false, `Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    // Find the currently active boost purchase for this post
    const purchase = await BoostPurchase.findOne({
      where: {
        postId: postIdNum,
        status: 'active',
        expiryDate: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });

    // Track the metric only if an active boost exists
    let metricStatus = 'no_active_boost';
    if (purchase) {
      if (action === 'impression') {
        // ─── ISSUE #11: Use UTC for consistent day boundaries ─────────────
        const dayBucket = new Date().toISOString().split('T')[0]; // Always UTC

        // ─── ISSUE #3: Add transaction with locking to prevent race conditions
        const transaction = await sequelize.transaction();
        try {
          const [log, created] = await BoostImpressionLog.findOrCreate({
            where: {
              userId: actorId,
              postId: postIdNum,
              dayBucket: dayBucket,
            },
            defaults: {
              postType: postType || null,
            },
            transaction,
            lock: true, // Acquire WRITE lock to prevent race condition
          });

          // ─── ISSUE #2: Inform user of deduplication status ──────────────
          if (created) {
            purchase.impressions = (purchase.impressions || 0) + 1;
            await purchase.save({ transaction });
            metricStatus = 'impression_tracked';
          } else {
            metricStatus = 'impression_deduped'; // Already logged today
          }

          await transaction.commit();
        } catch (txErr) {
          await transaction.rollback();
          throw txErr;
        }
      } else if (action === 'click') {
        // ─── ISSUE #8: Reject clicks if no impressions exist ──────────────
        if ((purchase.impressions || 0) === 0) {
          logger.warn(
            `Click recorded without impressions: purchaseId=${purchase.id}, userId=${actorId}`
          );
          return sendResponse(
            res,
            400,
            false,
            "Cannot record clicks without impressions. Ensure the post was viewed first."
          );
        }
        purchase.clicks = (purchase.clicks || 0) + 1;
        await purchase.save();
        metricStatus = 'click_tracked';
      } else {
        // Rich interaction (Like, Comment, Purchase)
        await BoostInteraction.create({
          purchaseId: purchase.id,
          userId: actorId,
          action: action,
          content: content || null,
          impact: impact || (action === 'Purchase' ? 'High' : 'Medium'),
        });

        // ─── ISSUE #8: Verify impressions exist before counting interaction ─
        if ((purchase.impressions || 0) === 0) {
          logger.warn(
            `${action} interaction recorded without impressions: purchaseId=${purchase.id}, userId=${actorId}`
          );
        } else {
          // Only count as engagement if impressions exist
          purchase.clicks = (purchase.clicks || 0) + 1;
        }
        await purchase.save();
        metricStatus = 'interaction_tracked';
      }
    }

    // ─── ISSUE #2: Return different messages based on metric status ──────
    const messages = {
      impression_tracked: 'Impression tracked successfully',
      impression_deduped: 'Impression already recorded for this user today',
      click_tracked: 'Click tracked successfully',
      interaction_tracked: `${action} interaction tracked successfully`,
      no_active_boost: 'No active boost found for this post',
    };

    return sendResponse(res, 200, true, messages[metricStatus] || 'Metric processed', {
      status: metricStatus,
    });
  } catch (error) {
    logger.error(`Error in trackMetrics controller: ${error.message}`);
    next(error);
  }
};
