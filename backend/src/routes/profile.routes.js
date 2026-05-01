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
  changePassword,
  deleteAccount,
} from "../controllers/profile/index.js";
import {
  studentProfileValidator,
  businessProfileValidator,
  clubProfileValidator,
} from "../validators/profile.validator.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
import { parseFormDataFields } from "../middlewares/parseFormData.middleware.js";

const router = express.Router();

// All profile routes require authentication
router.use(protect);

// ── Student Profile ───────────────────────────────────────────────────────────
router.put(
  "/student",
  uploadToS3({
    type: "fields",
    fieldName: [
      { name: "avatar", maxCount: 1 },
      { name: "profileImage", maxCount: 1 },
    ],
    folder: "profiles",
  }),
  parseFormDataFields(["addresses"]),
  authorize(ROLES.STUDENT),
  studentProfileValidator,
  validateRequest,
  upsertStudentProfile,
);
router.get("/student/me", authorize(ROLES.STUDENT), getMyStudentProfile);

// ── Business Profile ──────────────────────────────────────────────────────────
router.put(
  "/business",
  uploadToS3({
    type: "fields",
    fieldName: [
      { name: "avatar", maxCount: 1 },
      { name: "profileImage", maxCount: 1 },
    ],
    folder: "profiles",
  }),
  parseFormDataFields(["addresses"]),
  authorize(ROLES.BUSINESS),
  businessProfileValidator,
  validateRequest,
  upsertBusinessProfile,
);
router.get("/business/me", authorize(ROLES.BUSINESS), getMyBusinessProfile);

// ── Club Profile ──────────────────────────────────────────────────────────────
router.put(
  "/club",
  uploadToS3({
    type: "fields",
    fieldName: [
      { name: "avatar", maxCount: 1 },
      { name: "profileImage", maxCount: 1 },
      { name: "clubDoc", maxCount: 1 },
    ],
    folder: "profiles",
  }),
  parseFormDataFields(["addresses"]),
  authorize(ROLES.CLUB),
  clubProfileValidator,
  validateRequest,
  upsertClubProfile,
);
router.get("/club/me", authorize(ROLES.CLUB), getMyClubProfile);
// ── Account Management ────────────────────────────────────────────────────────
router.put("/password", changePassword);
router.delete("/", deleteAccount);

export default router;
