import express from "express";
import {
  resetDb,
  seedDummyData,
  seedFollowers,
  seedReviews,
  seedReports,
  seedSuspensions,
  seedBoostData,
  seedLearningData,
  seedAllUserTypes,
  seedUsers,
} from "../controllers/base/index.js";

const router = express.Router();

// Development/Testing endpoints
router.post("/reset-db", resetDb);
router.post("/seed-dummy-data", seedDummyData);
router.post("/seed-followers", seedFollowers);
router.post("/seed-reviews", seedReviews);
router.post("/seed-reports", seedReports);
router.post("/seed-suspensions", seedSuspensions);
router.post("/seed-boost-data", seedBoostData);
router.post("/seed-learning-data", seedLearningData);
router.post("/seed-all-users", seedAllUserTypes);
router.post("/seed-users", seedUsers);

export default router;
