import express from 'express';
import { ReportController } from '../controllers/index.js';
// import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Student Report System Routes
 * [TEMPORARY] Authentication bypassed for testing.
 */

// POST /api/v1/reports - Create a new report
router.post(
  '/',
  // authenticateToken,
  ReportController.createReport
);

// GET /api/v1/reports - Get all reports for the logged-in student
router.get(
  '/',
  // authenticateToken,
  ReportController.getStudentReports
);

// GET /api/v1/reports/admin/queue - Admin moderation queue
router.get(
  '/admin/queue',
  // authenticateToken,
  ReportController.getReportQueue
);

// GET /api/v1/reports/admin/statistics - Admin statistics
router.get(
  '/admin/statistics',
  // authenticateToken,
  ReportController.getStatistics
);

// GET /api/v1/reports/:id - Get specific report details
router.get(
  '/:id',
  // authenticateToken,
  ReportController.getReportById
);

// PUT /api/v1/reports/:id - Update report status/priority (Admin)
router.put(
  '/:id',
  // authenticateToken,
  ReportController.updateReport
);

// DELETE /api/v1/reports/:id - Withdraw a report (Student)
router.delete(
  '/:id',
  // authenticateToken,
  ReportController.withdrawReport
);

export default router;
