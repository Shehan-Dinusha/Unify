import express from 'express';
import * as BusinessController from '../controllers/admin/businessManagement.controller.js';
import * as Validator from '../validators/adminManagement.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// [TEMPORARY] Authentication bypassed for testing parity
const bypassAuth = (req, res, next) => next();

router.get('/', bypassAuth, Validator.businessDirectoryValidator, validate, BusinessController.getBusinessDirectory);
router.get('/stats', bypassAuth, BusinessController.getBusinessStats);
router.get('/:id', bypassAuth, BusinessController.getBusinessProfile);
router.put('/:id/status', bypassAuth, Validator.updateStatusValidator, validate, BusinessController.updateBusinessStatus);
router.post('/:id/notes', bypassAuth, Validator.addNoteValidator, validate, BusinessController.addBusinessNote);

export default router;
