import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
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

// All dev/seed endpoints require admin authentication
router.use(protect, authorize("Admin"));

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
