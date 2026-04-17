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

// GET /api/v1/verifications/pending
router.get(
  "/pending",
  VerificationController.getPendingVerifications
);

// PATCH /api/v1/verifications/:id/approve
router.patch(
  "/:id/approve",
  VerificationController.approveVerificationRequest
);

// PATCH /api/v1/verifications/:id/reject
router.patch(
  "/:id/reject",
  VerificationController.rejectVerificationRequest
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
