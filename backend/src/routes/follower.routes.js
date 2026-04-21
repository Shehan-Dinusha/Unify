import express from "express";
import { toggleFollowClub } from "../controllers/follower/toggleFollow.controller.js";
import { getClubFollowers } from "../controllers/follower/getFollowers.controller.js";
import { getStudentFollowings } from "../controllers/follower/getFollowing.controller.js";

const router = express.Router();

router.get("/my-followers", getClubFollowers);
router.get("/my-followings", getStudentFollowings);
router.post("/:clubId/toggle", toggleFollowClub);

export default router;
