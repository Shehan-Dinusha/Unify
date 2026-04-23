import { Review } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const toggleOwnerLike = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    // Fallback to 4 for testing if req.user is not yet defined
    const currentUserId = req.user?.id || 4;

    if (!reviewId) {
      return sendResponse(res, 400, false, "Review ID is required.");
    }

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return sendResponse(res, 404, false, "Review not found.");
    }

    // Verify that the user trying to like the review is the actual target (owner)
    if (review.targetId !== currentUserId) {
      return sendResponse(
        res,
        403,
        false,
        "Unauthorized. Only the owner of this profile can like this review.",
      );
    }

    // Toggle the like status
    review.isLikedByOwner = !review.isLikedByOwner;
    await review.save();

    const message = review.isLikedByOwner
      ? "Review liked successfully."
      : "Review unliked successfully.";

    return sendResponse(res, 200, true, message, {
      isLikedByOwner: review.isLikedByOwner,
    });
  } catch (error) {
    logger.error("Error toggling owner like for review", error);
    next(error);
  }
};
