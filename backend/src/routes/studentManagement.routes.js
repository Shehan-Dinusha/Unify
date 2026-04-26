import express from 'express';
import * as StudentController from '../controllers/admin/studentManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// [TEMPORARY] Authentication bypassed for testing parity
const bypassAuth = (req, res, next) => next();

router.get('/', bypassAuth, Validator.studentDirectoryValidator, validate, StudentController.getStudentDirectory);
router.get('/stats', bypassAuth, StudentController.getStudentStats);
router.get('/:id', bypassAuth, StudentController.getStudentProfile);
router.put('/:id/status', bypassAuth, Validator.updateStatusValidator, validate, StudentController.updateStudentStatus);
router.post('/:id/notes', bypassAuth, Validator.addNoteValidator, validate, StudentController.addStudentNote);
router.post('/:id/logout', bypassAuth, StudentController.forceLogout);
router.post('/:id/warning', bypassAuth, Validator.sendWarningValidator, validate, StudentController.sendStudentWarning);

export default router;
