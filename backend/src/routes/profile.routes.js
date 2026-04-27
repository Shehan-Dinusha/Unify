import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/constants.js";
import {
  upsertStudentProfile,
  getMyStudentProfile,
  upsertBusinessProfile,
  getMyBusinessProfile,
  upsertClubProfile,
  getMyClubProfile,
} from "../controllers/profile/index.js";
import {
  studentProfileValidator,
  businessProfileValidator,
  clubProfileValidator,
} from "../validators/profile.validator.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import uploadService from "../services/upload.service.js";

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// ── Student Profile ───────────────────────────────────────────────────────────
router.put(
  "/student",
  uploadService.fields([{ name: "avatar", maxCount: 1 }, { name: "profileImage", maxCount: 1 }]),
  authorize(ROLES.STUDENT),
  studentProfileValidator,
  validateRequest,
  upsertStudentProfile,
);
router.get("/student/me", authorize(ROLES.STUDENT), getMyStudentProfile);

// ── Business Profile ──────────────────────────────────────────────────────────
router.put(
  "/business",
  uploadService.fields([{ name: "avatar", maxCount: 1 }, { name: "profileImage", maxCount: 1 }]),
  authorize(ROLES.BUSINESS),
  businessProfileValidator,
  validateRequest,
  upsertBusinessProfile,
);
router.get("/business/me", authorize(ROLES.BUSINESS), getMyBusinessProfile);

// ── Club Profile ──────────────────────────────────────────────────────────────
router.put(
  "/club",
  uploadService.fields([{ name: "avatar", maxCount: 1 }, { name: "profileImage", maxCount: 1 }]),
  authorize(ROLES.CLUB),
  clubProfileValidator,
  validateRequest,
  upsertClubProfile,
);
router.get("/club/me", authorize(ROLES.CLUB), getMyClubProfile);

export default router;
