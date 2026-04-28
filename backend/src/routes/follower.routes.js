import express from "express";
import { toggleFollowClub } from "../controllers/follower/toggleFollow.controller.js";
import { getClubFollowers } from "../controllers/follower/getFollowers.controller.js";
import { getStudentFollowings } from "../controllers/follower/getFollowing.controller.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  toggleFollowValidator,
  getFollowersValidator,
  getFollowingValidator,
} from "../validators/follower.validator.js";

const router = express.Router();

router.get("/my-followers", getFollowersValidator, validateRequest, getClubFollowers);
router.get("/my-followings", getFollowingValidator, validateRequest, getStudentFollowings);
router.post("/:clubId/toggle", toggleFollowValidator, validateRequest, toggleFollowClub);

export default router;
