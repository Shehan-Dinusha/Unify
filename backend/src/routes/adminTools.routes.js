import express from 'express';
import * as ToolsController from '../controllers/admin/adminTools.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Admin tools require Admin authentication — sensitive system operations
router.post('/seed', protect, authorize('Admin'), ToolsController.seedSystemData);
router.post('/fix-enums', protect, authorize('Admin'), ToolsController.fixDatabaseEnums);

export default router;

