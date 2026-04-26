import express from "express";
import {
  resetDb,
  seedAcademicStructure,
  seedDummyData,
  getUniversities,
  getFaculties,
  getDegrees,
  getBatches,
} from "../controllers/base/index.js";

const router = express.Router();

// Development/Testing endpoints
router.post("/reset-db", resetDb);
router.post("/seed-academic-structure", seedAcademicStructure);
router.post("/seed-dummy-data", seedDummyData);

// Academic Data endpoints (Publicly available for dropdowns)
router.get("/universities", getUniversities);
router.get("/universities/:universityId/faculties", getFaculties);
router.get("/faculties/:facultyId/degrees", getDegrees);
router.get("/batches", getBatches);

export default router;
