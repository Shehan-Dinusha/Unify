import express from "express";
import {
  resetDb,
  seedAcademicStructure,
  seedDummyData,
  seedFollowers,
} from "../controllers/base/index.js";

const router = express.Router();

// These endpoints are for development and testing
router.post("/reset-db", resetDb);
router.post("/seed-academic-structure", seedAcademicStructure);
router.post("/seed-dummy-data", seedDummyData);
router.post("/seed-followers", seedFollowers);

export default router;
