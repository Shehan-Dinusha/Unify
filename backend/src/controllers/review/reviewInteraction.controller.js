import { Review, ReviewFeedback } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { notifyReviewFeedback, deleteByDedupeKey } from "../../services/notification.service.js";

/**
 * Controller to handle "Helpful" or "Not Helpful" interactions on a review.
 * Expected body: { action: "helpful" | "not_helpful" }
 */
export const toggleReviewFeedback = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // should be either "helpful" or "not_helpful"

    const currentUserId = req.user.id;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return sendResponse(res, 404, false, "Review not found.");
    }

    const isHelpfulClicked = action === "helpful";

    // Check if the user already left feedback for this review
    const existingFeedback = await ReviewFeedback.findOne({
      where: { reviewId, userId: currentUserId },
    });

    if (existingFeedback) {
      // If they click the same button again, we remove it (toggle off)
      if (existingFeedback.isHelpful === isHelpfulClicked) {
        const action = existingFeedback.isHelpful ? "helpful" : "not_helpful";
        await deleteByDedupeKey(`review-feedback:${currentUserId}:${reviewId}:${action}`);

        await existingFeedback.destroy();

        if (isHelpfulClicked) {
          review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        } else {
          review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
        }
        await review.save();

        return sendResponse(
          res,
          200,
          true,
          "Review feedback removed successfully",
          {
            reviewId: review.id,
            feedbackModified: "removed",
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
          },
        );
      } else {
        // If they click the opposite button, we update the existing record
        existingFeedback.isHelpful = isHelpfulClicked;
        await existingFeedback.save();

        if (isHelpfulClicked) {
          review.helpfulCount += 1;
          review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
        } else {
          review.notHelpfulCount += 1;
          review.helpfulCount = Math.max(0, review.helpfulCount - 1);
        }
        await review.save();

        notifyReviewFeedback({
          reviewAuthorId: review.reviewerId,
          actorId: currentUserId,
          actorName: req.user.name,
          reviewId: review.id,
          targetId: review.targetId,
          action,
        });

        return sendResponse(
          res,
          200,
          true,
          "Review feedback changed successfully",
          {
            reviewId: review.id,
            feedbackModified: "updated",
            isHelpful: existingFeedback.isHelpful,
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
          },
        );
      }
    } else {
      // Create new feedback
      await ReviewFeedback.create({
        reviewId,
        userId: currentUserId,
        isHelpful: isHelpfulClicked,
      });

      if (isHelpfulClicked) {
        review.helpfulCount += 1;
      } else {
        review.notHelpfulCount += 1;
      }
      await review.save();

      notifyReviewFeedback({
        reviewAuthorId: review.reviewerId,
        actorId: currentUserId,
        actorName: req.user.name,
        reviewId: review.id,
        targetId: review.targetId,
        action,
      });

      return sendResponse(
        res,
        201,
        true,
        "Review feedback added successfully",
        {
          reviewId: review.id,
          feedbackModified: "added",
          isHelpful: isHelpfulClicked,
          helpfulCount: review.helpfulCount,
          notHelpfulCount: review.notHelpfulCount,
        },
      );
    }
  } catch (error) {
    logger.error("Error updating review feedback", error);
    next(error);
  }
};
