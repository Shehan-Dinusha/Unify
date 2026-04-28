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

const router = express.Router();

router.post("/submit", submitReviewValidator, validateRequest, submitReview);
router.delete("/:id", deleteReviewValidator, validateRequest, deleteReview);
router.get("/target/:targetId", getTargetReviewsValidator, validateRequest, getTargetReviews);
router.get("/received", getReceivedReviews);
router.get("/me", getMyReviews);
router.post("/:reviewId/feedback", toggleReviewFeedbackValidator, validateRequest, toggleReviewFeedback);
router.post("/:reviewId/owner-like", toggleOwnerLikeValidator, validateRequest, toggleOwnerLike);
router.post("/:reviewId/reply", replyToReviewValidator, validateRequest, replyToReview);

export default router;
