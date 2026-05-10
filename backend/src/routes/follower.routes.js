import express from "express";
import { toggleFollowClub } from "../controllers/follower/toggleFollow.controller.js";
import { getClubFollowers } from "../controllers/follower/getFollowers.controller.js";
import { getStudentFollowings } from "../controllers/follower/getFollowing.controller.js";
import { getPublicFollowers, getPublicFollowing } from "../controllers/follower/getPublicFollowers.controller.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  toggleFollowValidator,
  getFollowersValidator,
  getFollowingValidator,
} from "../validators/follower.validator.js";

const router = express.Router();

router.get(
  "/my-followers",
  protect,
  authorize("Club"),
  getFollowersValidator,
  validateRequest,
  getClubFollowers,
);
router.get(
  "/my-followings",
  protect,
  authorize("Student"),
  getFollowingValidator,
  validateRequest,
  getStudentFollowings,
);
router.post(
  "/:clubId/toggle",
  protect,
  authorize("Student"),
  toggleFollowValidator,
  validateRequest,
  toggleFollowClub,
);

// Publicly viewable follower/following endpoints
router.get("/:userId/followers", protect, getPublicFollowers);
router.get("/:userId/followings", protect, getPublicFollowing);

export default router;
