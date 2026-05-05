import express from "express";
import {
  createNormalPost,
  createClubProductPost,
  createClubEventPost,
  createBoardingPost,
  getFeed,
  getFilteredBoardingFeed,
  getPost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  toggleSave,
  getSavedPosts,
} from "../controllers/posts/index.js";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createNormalPostValidator,
  createClubProductPostValidator,
  createClubEventPostValidator,
  createBoardingPostValidator,
  postParamsValidator,
  commentValidator,
} from "../validators/post.validator.js";


const router = express.Router();

// Create Normal Post (Supports multiple images)
router.post(
  "/normal",
  uploadToS3({ type: "array", fieldName: "images", folder: "posts", maxCount: 10 }),
  createNormalPostValidator,
  validate,
  createNormalPost
);

// Create Club Product Post (Supports multiple images)
router.post(
  "/club-product",
  uploadToS3({ type: "array", fieldName: "images", folder: "posts/products", maxCount: 10 }),
  createClubProductPostValidator,
  validate,
  createClubProductPost
);

// Create Club Event Post (Supports one cover image)
router.post(
  "/club-event",
  uploadToS3({ type: "array", fieldName: "coverImage", folder: "posts/events", maxCount: 1 }),
  createClubEventPostValidator,
  validate,
  createClubEventPost
);

// Create Boarding Post (Supports multiple images)
router.post(
  "/boarding",
  uploadToS3({ type: "array", fieldName: "images", folder: "posts/boarding", maxCount: 10 }),
  createBoardingPostValidator,
  validate,
  createBoardingPost
);

// Create Food & Cafe Post
router.post(
  "/food-cafe",
  uploadToS3({ type: "array", fieldName: "images", folder: "posts/food", maxCount: 10 }),
  createNormalPostValidator,
  validate,
  createNormalPost
);

// Create Service Post
router.post(
  "/service",
  uploadToS3({ type: "array", fieldName: "images", folder: "posts/services", maxCount: 10 }),
  createNormalPostValidator,
  validate,
  createNormalPost
);


// ── Unified Post Routes ───────────────────────────────────────────────────────

// Get unified feed
router.get("/feed", getFeed);

// Get filtered boarding feed
router.get("/boarding/filter", getFilteredBoardingFeed);
// Get saved posts
router.get("/saved", getSavedPosts);

// Get specific post dynamically
router.get("/:type/:id", postParamsValidator, validate, getPost);

// Delete specific post dynamically
router.delete("/:type/:id", postParamsValidator, validate, deletePost);

// Toggle Like
router.post("/:type/:id/like", postParamsValidator, validate, toggleLike);

// Comments
router.get("/:type/:id/comments", postParamsValidator, validate, getComments);
router.post("/:type/:id/comments", postParamsValidator, commentValidator, validate, addComment);

// Toggle Save
router.post("/:type/:id/save", postParamsValidator, validate, toggleSave);

export default router;
