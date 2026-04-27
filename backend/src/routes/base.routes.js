import express from "express";
import {
  resetDb,
  seedAcademicStructure,
  seedDummyData,
} from "../controllers/base/index.js";

const router = express.Router();

// Development/Testing endpoints
router.post("/reset-db", resetDb);
router.post("/seed-academic-structure", seedAcademicStructure);
router.post("/seed-dummy-data", seedDummyData);

export default router;
