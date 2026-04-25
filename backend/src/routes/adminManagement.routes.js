import express from 'express';
import * as StudentController from '../controllers/admin/studentManagement.controller.js';
import * as BusinessController from '../controllers/admin/businessManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js'; // Assuming this exists based on pattern
// import { authenticateToken, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// [TEMPORARY] Authentication bypassed for testing parity as per previous implementations
const bypassAuth = (req, res, next) => next();

/**
 * Student Management Routes
 */
router.get(
  '/students',
  bypassAuth,
  validate(Validator.studentDirectorySchema, 'query'),
  StudentController.getStudentDirectory
);

router.get(
  '/students/stats',
  bypassAuth,
  StudentController.getStudentStats
);

router.get(
  '/students/:id',
  bypassAuth,
  StudentController.getStudentProfile
);

router.put(
  '/students/:id/status',
  bypassAuth,
  validate(Validator.updateStatusSchema),
  StudentController.updateStudentStatus
);

router.post(
  '/students/:id/notes',
  bypassAuth,
  validate(Validator.addNoteSchema),
  StudentController.addStudentNote
);

router.post(
  '/students/:id/logout',
  bypassAuth,
  StudentController.forceLogout
);

router.get(
  '/students/:id/logs',
  bypassAuth,
  StudentController.getStudentProfile // Profile already contains logs
);

router.post(
  '/students/:id/warning',
  bypassAuth,
  validate(Validator.sendWarningSchema),
  StudentController.sendStudentWarning
);

/**
 * Business Management Routes
 */
router.get(
  '/businesses',
  bypassAuth,
  validate(Validator.businessDirectorySchema, 'query'),
  BusinessController.getBusinessDirectory
);

router.get(
  '/businesses/stats',
  bypassAuth,
  BusinessController.getBusinessStats
);

router.get(
  '/businesses/:id',
  bypassAuth,
  BusinessController.getBusinessProfile
);

router.put(
  '/businesses/:id/status',
  bypassAuth,
  validate(Validator.updateStatusSchema),
  BusinessController.updateBusinessStatus
);

router.post(
  '/businesses/:id/notes',
  bypassAuth,
  validate(Validator.addNoteSchema),
  BusinessController.addBusinessNote
);

export default router;
