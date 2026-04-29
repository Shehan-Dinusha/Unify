import express from "express";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
import {
  submitVerificationRequest,
  getPendingVerifications,
  getVerificationDocument,
  getVerifiedEntities,
  approveVerificationRequest,
  rejectVerificationRequest,
  getVerificationStatus,
  deleteVerificationRequest,
  removeVerifiedAccount,
} from "../controllers/verification/index.js";
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

const router = express.Router();

// POST /api/v1/verifications/submit
router.post(
  "/submit",
  uploadToS3({ type: "single", fieldName: "document", folder: "verifications" }),
  submitVerificationRequestValidator,
  validateRequest,
  submitVerificationRequest,
);

// GET /api/v1/verifications/pending
router.get("/pending", getPendingVerifications);

// GET /api/v1/verifications/verified
router.get("/verified", getVerifiedEntities);

// PATCH /api/v1/verifications/:id/approve
router.patch(
  "/:id/approve",
  approveVerificationRequestValidator,
  validateRequest,
  approveVerificationRequest,
);

// PATCH /api/v1/verifications/:id/reject
router.patch(
  "/:id/reject",
  rejectVerificationRequestValidator,
  validateRequest,
  rejectVerificationRequest,
);

// GET /api/v1/verifications/status
router.get(
  "/status",
  getVerificationStatusValidator,
  validateRequest,
  getVerificationStatus,
);

// DELETE /api/v1/verifications/remove
router.delete(
  "/remove",
  deleteVerificationRequestValidator,
  validateRequest,
  deleteVerificationRequest,
);

// GET /api/v1/verifications/:id/document
router.get(
  "/:id/document",
  getVerificationDocumentValidator,
  validateRequest,
  getVerificationDocument,
);

// DELETE /api/v1/verifications/:id/remove-verified
router.delete(
  "/:id/remove-verified",
  removeVerifiedAccountValidator,
  validateRequest,
  removeVerifiedAccount,
);

export default router;
