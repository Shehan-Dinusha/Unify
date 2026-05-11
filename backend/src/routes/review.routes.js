import express from "express";
import {
  submitReview,
  deleteReview,
  getTargetReviews,
  toggleReviewFeedback,
  getReceivedReviews,
  toggleOwnerLike,
  replyToReview,
  getMyReviews,
} from "../controllers/review/index.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  submitReviewValidator,
  deleteReviewValidator,
  getTargetReviewsValidator,
  toggleReviewFeedbackValidator,
  toggleOwnerLikeValidator,
  replyToReviewValidator,
} from "../validators/review.validator.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/submit",
  protect,
  authorize("Student"),
  submitReviewValidator,
  validateRequest,
  submitReview,
);
router.delete(
  "/:id",
  protect,
  authorize("Student"),
  deleteReviewValidator,
  validateRequest,
  deleteReview,
);
router.get(
  "/target/:targetId",
  protect,
  getTargetReviewsValidator,
  validateRequest,
  getTargetReviews,
);
router.get("/received", protect, authorize("Business"), getReceivedReviews);
router.get("/me", protect, authorize("Student"), getMyReviews);
router.post(
  "/:reviewId/feedback",
  protect,
  toggleReviewFeedbackValidator,
  validateRequest,
  toggleReviewFeedback,
);
router.post(
  "/:reviewId/owner-like",
  protect,
  authorize("Business"),
  toggleOwnerLikeValidator,
  validateRequest,
  toggleOwnerLike,
);
router.post(
  "/:reviewId/reply",
  protect,
  authorize("Business"),
  replyToReviewValidator,
  validateRequest,
  replyToReview,
);

export default router;
