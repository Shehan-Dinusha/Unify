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

// GET /api/v1/verifications/verified
router.get(
  "/verified",
  VerificationController.getVerifiedEntities
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

// GET /api/v1/verifications/:id/document
router.get(
  "/:id/document",
  VerificationController.getVerificationDocument
);

// DELETE /api/v1/verifications/:id/remove-verified
router.delete(
  "/:id/remove-verified",
  VerificationController.removeVerifiedAccount
);

export default router;
