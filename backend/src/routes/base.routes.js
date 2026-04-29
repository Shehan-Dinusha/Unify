import express from "express";
import {
  resetDb,
  seedAcademicStructure,
  seedDummyData,
  seedFollowers,
  seedReviews,
  seedReports,
} from "../controllers/base/index.js";

const router = express.Router();

// Development/Testing endpoints
router.post("/reset-db", resetDb);
router.post("/seed-academic-structure", seedAcademicStructure);
router.post("/seed-dummy-data", seedDummyData);
router.post("/seed-followers", seedFollowers);
router.post("/seed-reviews", seedReviews);
router.post("/seed-reports", seedReports);

export default router;
// touch
// touch2
// touch3
// touch4
