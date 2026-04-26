import express from "express";
import {
  createNormalPost,
  createClubProductPost,
  createClubEventPost,
  createBoardingPost,
  getFeed,
  getPost,
  deletePost,
} from "../controllers/posts/index.js";
import uploadService from "../services/upload.service.js";

const router = express.Router();

// You can add your authentication middleware here when ready, 
// e.g., router.use(verifyToken);

// Create Normal Post (Supports multiple images)
router.post(
  "/normal",
  uploadService.array("images", 10),
  createNormalPost
);

// Create Club Product Post (Supports multiple images)
router.post(
  "/club-product",
  uploadService.array("images", 10),
  createClubProductPost
);

// Create Club Event Post (Supports one cover image)
router.post(
  "/club-event",
  uploadService.array("coverImage", 1), // Using array for consistency, or uploadService.single
  createClubEventPost
);

// Create Boarding Post (Supports multiple images)
router.post(
  "/boarding",
  uploadService.array("images", 10),
  createBoardingPost
);

// Create Food & Cafe Post (Using createNormalPost controller with FOOD category)
router.post(
  "/food-cafe",
  uploadService.array("images", 10),
  createNormalPost
);

// Create Service Post (Using createNormalPost controller with SELF_EMPLOYED category)
router.post(
  "/service",
  uploadService.array("images", 10),
  createNormalPost
);

// ── Unified Post Routes ───────────────────────────────────────────────────────

// Get unified feed
router.get("/feed", getFeed);

// Get specific post dynamically
router.get("/:type/:id", getPost);

// Delete specific post dynamically
router.delete("/:type/:id", deletePost);

export default router;
