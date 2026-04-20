import express from "express";
import {
  submitReview,
  deleteReview,
  getTargetReviews,
  toggleReviewFeedback,
} from "../controllers/review/index.js";

const router = express.Router();

router.post("/submit", submitReview);
router.delete("/:id", deleteReview);
router.get("/target/:targetId", getTargetReviews);
router.post("/:reviewId/feedback", toggleReviewFeedback);

export default router;
