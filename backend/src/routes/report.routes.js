import express from 'express';
import { ReportController } from '../controllers/index.js';
import uploadService from '../services/upload.service.js';
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
  uploadService.array('evidenceFiles', 5), // Handles up to 5 optional file uploads from Step 3
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

// ==========================================
// Social Report System Routes (Admin Moderation)
// ==========================================

// GET /api/v1/reports/social/queue - Social moderation queue
router.get(
  '/social/queue',
  ReportController.getSocialReportQueue
);

// GET /api/v1/reports/social/:id - Get specific social report details
router.get(
  '/social/:id',
  ReportController.getSocialReportById
);

// PUT /api/v1/reports/social/:id - Process social report (Dismiss, Resolve, Delete Post, etc.)
router.put(
  '/social/:id',
  ReportController.processSocialReport
);

// ==========================================
// Academic/Facility Report Routes
// ==========================================

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
