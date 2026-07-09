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
  revokeBatchRepStatus,
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
  revokeBatchRepStatusValidator,
} from "../validators/verification.validator.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
const router = express.Router();

// POST /api/v1/verifications/submit
router.post(
  "/submit",
  protect,
  authorize("Student", "Club"),
  uploadToS3({ type: "single", fieldName: "document", folder: "verifications" }),
  submitVerificationRequestValidator,
  validateRequest,
  submitVerificationRequest,
);

// GET /api/v1/verifications/pending
router.get(
  "/pending",
  protect,
  authorize("Admin"),
  getPendingVerifications,
);

// GET /api/v1/verifications/verified
router.get(
  "/verified",
  protect,
  authorize("Admin"),
  getVerifiedEntities,
);

// PATCH /api/v1/verifications/:id/approve
router.patch(
  "/:id/approve",
  protect,
  authorize("Admin"),
  approveVerificationRequestValidator,
  validateRequest,
  approveVerificationRequest,
);

// PATCH /api/v1/verifications/:id/reject
router.patch(
  "/:id/reject",
  protect,
  authorize("Admin"),
  rejectVerificationRequestValidator,
  validateRequest,
  rejectVerificationRequest,
);

// GET /api/v1/verifications/status
router.get(
  "/status",
  protect,
  getVerificationStatusValidator,
  validateRequest,
  getVerificationStatus,
);

// DELETE /api/v1/verifications/remove
router.delete(
  "/remove",
  protect,
  deleteVerificationRequestValidator,
  validateRequest,
  deleteVerificationRequest,
);

// GET /api/v1/verifications/:id/document
router.get(
  "/:id/document",
  protect,
  authorize("Admin"),
  getVerificationDocumentValidator,
  validateRequest,
  getVerificationDocument,
);

// DELETE /api/v1/verifications/:id/remove-verified
router.delete(
  "/:id/remove-verified",
  protect,
  authorize("Admin"),
  removeVerifiedAccountValidator,
  validateRequest,
  removeVerifiedAccount,
);

// POST /api/v1/verifications/revoke-batch-rep
router.post(
  "/revoke-batch-rep",
  protect,
  revokeBatchRepStatusValidator,
  validateRequest,
  revokeBatchRepStatus,
);

export default router;
