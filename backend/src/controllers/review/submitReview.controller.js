import Review from "../../modules/Review.model.js";
import User from "../../modules/User.model.js";
import ClubProfile from "../../modules/ClubProfile.model.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

export const submitReview = async (req, res, next) => {
  try {
    const { targetId, rating, review: content, isAnonymous } = req.body;

    const reviewerId = req.user.id; // Check if reviewer and target exist
    const reviewerExists = await User.findByPk(reviewerId);
    if (!reviewerExists) {
      return sendResponse(res, 404, false, "Reviewer not found.");
    }

    const allowedRoles = ["Student", "Club"];
    if (!allowedRoles.includes(reviewerExists.role)) {
      return sendResponse(
        res,
        403,
        false,
        "Only Students and Clubs can submit reviews.",
      );
    }

    const targetExists = await User.findByPk(targetId);
    if (!targetExists) {
      return sendResponse(res, 404, false, "Target user not found.");
    }

    if (targetExists.role !== "Business") {
      return sendResponse(
        res,
        400,
        false,
        "Reviews can only be given to Business accounts.",
      );
    }

    // check if user has already submitted a review for this target
    const existingReview = await Review.findOne({
      where: { reviewerId, targetId },
    });

    if (existingReview) {
      return sendResponse(
        res,
        400,
        false,
        "You already have an active review for this target. Please manage or delete it before submitting a new one.",
      );
    }

    const newReview = await Review.create({
      reviewerId,
      targetId,
      rating,
      content: content || "",
      isAnonymous: isAnonymous || false,
    });

    logger.info(
      `Review submitted by user ID: ${reviewerId} for target ID: ${targetId}`,
    );

    return sendResponse(
      res,
      201,
      true,
      "Review submitted successfully.",
      newReview,
    );
  } catch (error) {
    logger.error("Error submitting review", error);
    next(error);
  }
};
