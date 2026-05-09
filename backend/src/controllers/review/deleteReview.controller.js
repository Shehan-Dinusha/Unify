import Review from "../../modules/Review.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const reviewerId = req.user.id;
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return sendResponse(res, 404, false, "Review not found.");
    }

    // Check if the current user is the one who submitted the review
    if (existingReview.reviewerId !== reviewerId) {
      return sendResponse(
        res,
        403,
        false,
        "Unauthorized: You can only delete your own reviews.",
      );
    }

    await existingReview.destroy();

    logger.info(`Review ID: ${reviewId} deleted by user ID: ${reviewerId}`);

    return sendResponse(res, 200, true, "Review deleted successfully.");
  } catch (error) {
    logger.error("Error deleting review", error);
    next(error);
  }
};
