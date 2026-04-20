import express from "express";
import {
  submitReview,
  deleteReview,
  getTargetReviews,
  toggleReviewFeedback,
  getReceivedReviews,
  toggleOwnerLike,
  replyToReview,
} from "../controllers/review/index.js";

const router = express.Router();

router.post("/submit", submitReview);
router.delete("/:id", deleteReview);
router.get("/target/:targetId", getTargetReviews);
router.get("/received", getReceivedReviews);
router.post("/:reviewId/feedback", toggleReviewFeedback);
router.post("/:reviewId/owner-like", toggleOwnerLike);
router.post("/:reviewId/reply", replyToReview);

export default router;
