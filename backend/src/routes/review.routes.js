import express from "express";
import { submitReview, deleteReview, getTargetReviews } from "../controllers/review/index.js";

const router = express.Router();

router.post("/submit", submitReview);
router.delete("/:id", deleteReview);
router.get("/target/:targetId", getTargetReviews);

export default router;
