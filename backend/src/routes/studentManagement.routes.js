import express from 'express';
import * as StudentController from '../controllers/admin/studentManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All student management routes require Admin authentication
router.get('/', protect, authorize('Admin'), Validator.studentDirectoryValidator, validate, StudentController.getStudentDirectory);
router.get('/stats', protect, authorize('Admin'), StudentController.getStudentStats);
router.get('/:id', protect, authorize('Admin'), StudentController.getStudentProfile);
router.put('/:id/status', protect, authorize('Admin'), Validator.updateStatusValidator, validate, StudentController.updateStudentStatus);
router.post('/:id/notes', protect, authorize('Admin'), Validator.addNoteValidator, validate, StudentController.addStudentNote);
router.post('/:id/logout', protect, authorize('Admin'), StudentController.forceLogout);
router.post('/:id/warning', protect, authorize('Admin'), Validator.sendWarningValidator, validate, StudentController.sendStudentWarning);

export default router;

