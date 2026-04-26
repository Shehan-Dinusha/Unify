import express from 'express';
import * as StudentController from '../controllers/admin/studentManagement.controller.js';
import * as BusinessController from '../controllers/admin/businessManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// [TEMPORARY] Authentication bypassed for testing parity as per previous implementations
const bypassAuth = (req, res, next) => next();

/**
 * Student Management Routes
 */
router.get(
  '/students',
  bypassAuth,
  Validator.studentDirectoryValidator,
  validate,
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
  Validator.updateStatusValidator,
  validate,
  StudentController.updateStudentStatus
);

router.post(
  '/students/:id/notes',
  bypassAuth,
  Validator.addNoteValidator,
  validate,
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
  StudentController.getStudentProfile 
);

router.post(
  '/students/:id/warning',
  bypassAuth,
  Validator.sendWarningValidator,
  validate,
  StudentController.sendStudentWarning
);

/**
 * Business Management Routes
 */
router.get(
  '/businesses',
  bypassAuth,
  Validator.businessDirectoryValidator,
  validate,
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
  Validator.updateStatusValidator,
  validate,
  BusinessController.updateBusinessStatus
);

router.post(
  '/businesses/:id/notes',
  bypassAuth,
  Validator.addNoteValidator,
  validate,
  BusinessController.addBusinessNote
);

export default router;
