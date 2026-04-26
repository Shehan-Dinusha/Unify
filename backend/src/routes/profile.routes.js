import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/constants.js";
import {
  upsertStudentProfile,
  getMyStudentProfile,
} from "../controllers/studentProfile.controller.js";
import {
  upsertBusinessProfile,
  getMyBusinessProfile,
} from "../controllers/businessProfile.controller.js";
import {
  upsertClubProfile,
  getMyClubProfile,
} from "../controllers/clubProfile.controller.js";
import {
  studentProfileValidator,
  businessProfileValidator,
  clubProfileValidator,
} from "../validators/profile.validator.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// ── Student Profile ───────────────────────────────────────────────────────────
router.put(
  "/student",
  authorize(ROLES.STUDENT),
  studentProfileValidator,
  validateRequest,
  upsertStudentProfile,
);
router.get("/student/me", authorize(ROLES.STUDENT), getMyStudentProfile);

// ── Business Profile ──────────────────────────────────────────────────────────
router.put(
  "/business",
  authorize(ROLES.BUSINESS),
  businessProfileValidator,
  validateRequest,
  upsertBusinessProfile,
);
router.get("/business/me", authorize(ROLES.BUSINESS), getMyBusinessProfile);

// ── Club Profile ──────────────────────────────────────────────────────────────
router.put(
  "/club",
  authorize(ROLES.CLUB),
  clubProfileValidator,
  validateRequest,
  upsertClubProfile,
);
router.get("/club/me", authorize(ROLES.CLUB), getMyClubProfile);

export default router;
