import express from 'express';
import { ReportController } from '../controllers/index.js';
import reportUploadService from '../services/reportUpload.service.js';
// import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Student Report System Routes
 * 100% Compatible with Frontend UI Scenarios.
 * [TEMPORARY] Authentication bypassed for testing.
 */

// POST /api/v1/reports - Create a new report (Supports Step 3 File Upload)
router.post(
  '/',
  reportUploadService.single('evidenceFile'), // Handles optional file upload from Step 3
  ReportController.createReport
);

// GET /api/v1/reports - Get all reports for the logged-in student (For Submitted Reports Table)
router.get(
  '/',
  ReportController.getStudentReports
);

// GET /api/v1/reports/admin/queue - Admin moderation queue
router.get(
  '/admin/queue',
  ReportController.getReportQueue
);

// GET /api/v1/reports/admin/statistics - Admin statistics
router.get(
  '/admin/statistics',
  ReportController.getStatistics
);

// GET /api/v1/reports/:id - Get specific report details (For StudentReportDetail page)
router.get(
  '/:id',
  ReportController.getReportById
);

// PUT /api/v1/reports/:id - Update report status/priority (Admin Moderation)
router.put(
  '/:id',
  ReportController.updateReport
);

// DELETE /api/v1/reports/:id - Withdraw a report (Student Withdrawal flow)
router.delete(
  '/:id',
  ReportController.withdrawReport
);

export default router;
