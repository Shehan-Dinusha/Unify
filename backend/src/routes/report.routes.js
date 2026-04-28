import express from 'express';
import { ReportController } from '../controllers/index.js';
import uploadService from '../services/upload.service.js';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  createReportSchema, 
  updateReportSchema, 
  withdrawReportSchema 
} from '../validators/report.validator.js';

const router = express.Router();

/**
 * Student Report System Routes
 * 100% Compatible with Frontend UI Scenarios.
 */

// POST /api/v1/reports - Create a new report
router.post(
  '/',
  uploadService.array('evidenceFiles', 5),
  createReportSchema,
  validate,
  ReportController.createReport
);

// GET /api/v1/reports - Get all reports for the logged-in student
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

// GET /api/v1/reports/social/stats - Social moderation dashboard stats
router.get(
  '/social/stats',
  ReportController.getSocialReportStats
);

// GET /api/v1/reports/social/queue - Social moderation queue
router.get(
  '/social/queue',
  ReportController.getSocialReportQueue
);

// GET /api/v1/reports/social/:id - Get specific social report details
router.get(
  '/social/:id',
  [param('id').notEmpty().withMessage('Report ID is required')],
  validate,
  ReportController.getSocialReportById
);

// PUT /api/v1/reports/social/:id - Process social report
router.put(
  '/social/:id',
  updateReportSchema,
  validate,
  ReportController.processSocialReport
);

// ==========================================
// Academic/Facility Report Routes
// ==========================================

// GET /api/v1/reports/:id - Get specific report details
router.get(
  '/:id',
  [param('id').notEmpty().withMessage('Report ID is required')],
  validate,
  ReportController.getReportById
);

// PUT /api/v1/reports/:id - Update report status/priority
router.put(
  '/:id',
  updateReportSchema,
  validate,
  ReportController.updateReport
);

// DELETE /api/v1/reports/:id - Withdraw a report
router.delete(
  '/:id',
  withdrawReportSchema,
  validate,
  ReportController.withdrawReport
);

export default router;
