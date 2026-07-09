import express from "express";
import {
  getUniversities,
  getFaculties,
  getDegrees,
  getBatches,
} from "../controllers/education/index.js";

const router = express.Router();

/**
 * @desc    Get all universities
 * @route   GET /api/v1/education/universities
 */
router.get("/universities", getUniversities);

/**
 * @desc    Get faculties by university
 * @route   GET /api/v1/education/universities/:universityId/faculties
 */
router.get("/universities/:universityId/faculties", getFaculties);

/**
 * @desc    Get degrees by faculty
 * @route   GET /api/v1/education/faculties/:facultyId/degrees
 */
router.get("/faculties/:facultyId/degrees", getDegrees);

/**
 * @desc    Get all batches
 * @route   GET /api/v1/education/batches
 */
router.get("/batches", getBatches);

export default router;
