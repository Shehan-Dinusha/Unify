import express from 'express';
import * as BusinessController from '../controllers/admin/businessManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All business management routes require Admin authentication
router.get('/', protect, authorize('Admin'), Validator.businessDirectoryValidator, validate, BusinessController.getBusinessDirectory);
router.get('/stats', protect, authorize('Admin'), BusinessController.getBusinessStats);
router.get('/:id', protect, authorize('Admin'), BusinessController.getBusinessProfile);
router.put('/:id/status', protect, authorize('Admin'), Validator.updateStatusValidator, validate, BusinessController.updateBusinessStatus);
router.post('/:id/notes', protect, authorize('Admin'), Validator.addNoteValidator, validate, BusinessController.addBusinessNote);

export default router;

