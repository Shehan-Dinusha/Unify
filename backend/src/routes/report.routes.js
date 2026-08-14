import express from 'express';
import { param } from 'express-validator';
import { ReportController } from '../controllers/index.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadToS3 } from '../middlewares/s3Upload.middleware.js';
import { 
  createReportSchema, 
  updateReportSchema, 
  withdrawReportSchema 
} from '../validators/report.validator.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

//Student Report System Routes

//Create a new report
router.post(
  '/',
  protect,
  uploadToS3({ 
    type: 'array', 
    fieldName: 'evidenceFiles', 
    folder: 'reports', 
    maxCount: 5 
  }),
  createReportSchema,
  validate,
  ReportController.createReport
);

//Get all reports for the logged-in student
router.get(
  '/',
  protect,
  ReportController.getStudentReports
);

//Admin moderation queue
router.get(
  '/admin/queue',
  protect,
  authorize('Admin'),
  ReportController.getReportQueue
);

//Admin statistics
router.get(
  '/admin/statistics',
  protect,
  authorize('Admin'),
  ReportController.getStatistics
);

// ==========================================
// Social Report System Routes (Admin Moderation)
// ==========================================

//Social moderation dashboard stats
router.get(
  '/social/stats',
  protect,
  authorize('Admin'),
  ReportController.getSocialReportStats
);

//Social moderation queue
router.get(
  '/social/queue',
  protect,
  authorize('Admin'),
  ReportController.getSocialReportQueue
);

//Get specific social report details
router.get(
  '/social/:id',
  protect,
  authorize('Admin'),
  [param('id').notEmpty().withMessage('Report ID is required')],
  validate,
  ReportController.getSocialReportById
);

//Process social report
router.put(
  '/social/:id',
  protect,
  authorize('Admin'),
  updateReportSchema,
  validate,
  ReportController.processSocialReport
);

// ==========================================
// Academic/Facility Report Routes
// ==========================================

//Get specific report details
router.get(
  '/:id',
  protect,
  [param('id').notEmpty().withMessage('Report ID is required')],
  validate,
  ReportController.getReportById
);

//Update report status/priority
router.put(
  '/:id',
  protect,
  authorize('Admin'),
  updateReportSchema,
  validate,
  ReportController.updateReport
);

//Withdraw a report
router.delete(
  '/:id',
  protect,
  withdrawReportSchema,
  validate,
  ReportController.withdrawReport
);

export default router;
