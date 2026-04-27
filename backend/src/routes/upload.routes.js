import express from "express";
// import uploadService from "../services/upload.service.js";
// import { uploadSingleFile } from "../controllers/upload/index.js";
// import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @deprecated Standalone upload routes are deprecated. 
 * Please upload files directly during form submission using:
 * - PUT /api/v1/profiles/student (field: 'avatar')
 * - PUT /api/v1/profiles/business (field: 'avatar')
 * - POST /api/v1/verifications/submit (field: 'document')
 */

/*
router.use(protect);

router.post(
  "/avatar",
  uploadService.single("avatar"),
  uploadSingleFile
);

router.post(
  "/club-document",
  uploadService.single("clubDoc"),
  uploadSingleFile
);
*/

export default router;
