import express from "express";
import uploadService from "../services/upload.service.js";
import { VerificationController } from "../controllers/index.js";

const router = express.Router();

// POST /api/v1/verifications/submit
router.post(
  "/submit",
  uploadService.single("document"),
  VerificationController.submitVerificationRequest
);

// GET /api/v1/verifications/status
router.get(
  "/status",
  VerificationController.getVerificationStatus
);

// DELETE /api/v1/verifications/remove
router.delete(
  "/remove",
  VerificationController.deleteVerificationRequest
);

export default router;
