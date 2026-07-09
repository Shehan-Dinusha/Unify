import { Review } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { formatRelativeDate } from "../../utils/date.js";
import { notifyReviewReply } from "../../services/notification.service.js";

export const replyToReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;

    const currentUserId = req.user.id;
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return sendResponse(res, 404, false, "Review not found.");
    }

    // Verify that the user trying to reply is the actual target (owner)
    if (review.targetId !== currentUserId) {
      return sendResponse(
        res,
        403,
        false,
        "Unauthorized. Only the owner of this profile can reply to this review.",
      );
    }

    // Update the owner's reply
    review.ownerReply = content.trim();
    await review.save();

    notifyReviewReply({
      reviewAuthorId: review.reviewerId,
      actorId: currentUserId,
      actorName: req.user.name,
      reviewId: review.id,
      targetId: review.targetId,
    });

    const dateStr = formatRelativeDate(review.updatedAt);

    return sendResponse(res, 200, true, "Reply posted successfully.", {
      ownerReply: {
        content: review.ownerReply,
        createdAt: dateStr,
      },
    });
  } catch (error) {
    logger.error("Error replying to review", error);
    next(error);
  }
};
