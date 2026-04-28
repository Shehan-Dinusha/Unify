import express from 'express';
import * as ToolsController from '../controllers/admin/adminTools.controller.js';

const router = express.Router();

// [SECURITY] In production, these must be restricted to SuperAdmins only
const bypassAuth = (req, res, next) => next();

router.post('/seed', bypassAuth, ToolsController.seedSystemData);
router.post('/fix-enums', bypassAuth, ToolsController.fixDatabaseEnums);

export default router;
