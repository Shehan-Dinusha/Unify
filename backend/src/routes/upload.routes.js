import express from "express";
import uploadService from "../services/upload.service.js";
import { uploadSingleFile } from "../controllers/upload/index.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All upload routes require authentication
router.use(protect);

/**
 * @desc    Upload Profile Picture (Avatar)
 * @route   POST /api/v1/upload/avatar
 * @access  Private
 */
router.post(
  "/avatar",
  uploadService.single("avatar"),
  uploadSingleFile
);

/**
 * @desc    Upload Club Document (Personal Details Form)
 * @route   POST /api/v1/upload/club-document
 * @access  Private
 */
router.post(
  "/club-document",
  uploadService.single("clubDoc"),
  uploadSingleFile
);

export default router;
