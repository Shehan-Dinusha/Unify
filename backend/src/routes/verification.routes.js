import express from "express";
import uploadService from "../services/upload.service.js";
import { VerificationController } from "../controllers/index.js";
import { validateRequest } from "../middlewares/expressValidator.middleware.js";
import {
  submitVerificationRequestValidator,
  approveVerificationRequestValidator,
  rejectVerificationRequestValidator,
  getVerificationStatusValidator,
  deleteVerificationRequestValidator,
  getVerificationDocumentValidator,
  removeVerifiedAccountValidator,
} from "../validators/verification.validator.js";

import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// POST /api/v1/verifications/submit
router.post(
  "/submit",
  protect,
  uploadService.single("document"),
  submitVerificationRequestValidator,
  validateRequest,
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
  approveVerificationRequestValidator,
  validateRequest,
  VerificationController.approveVerificationRequest
);

// PATCH /api/v1/verifications/:id/reject
router.patch(
  "/:id/reject",
  rejectVerificationRequestValidator,
  validateRequest,
  VerificationController.rejectVerificationRequest
);

// GET /api/v1/verifications/status
router.get(
  "/status",
  getVerificationStatusValidator,
  validateRequest,
  VerificationController.getVerificationStatus
);

// DELETE /api/v1/verifications/remove
router.delete(
  "/remove",
  deleteVerificationRequestValidator,
  validateRequest,
  VerificationController.deleteVerificationRequest
);

// GET /api/v1/verifications/:id/document
router.get(
  "/:id/document",
  getVerificationDocumentValidator,
  validateRequest,
  VerificationController.getVerificationDocument
);

// DELETE /api/v1/verifications/:id/remove-verified
router.delete(
  "/:id/remove-verified",
  removeVerifiedAccountValidator,
  validateRequest,
  VerificationController.removeVerifiedAccount
);

export default router;
