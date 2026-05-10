import express from 'express';
import * as DashboardController from '../controllers/admin/adminDashboard.controller.js';

const router = express.Router();

// [TEMPORARY] Authentication bypassed for testing parity (same pattern as businessManagement.routes.js)
const bypassAuth = (req, res, next) => next();

// ─── Dashboard Endpoints ─────────────────────────────────────────────────────
router.get('/dashboard/stats', bypassAuth, DashboardController.getDashboardStats);
router.get('/dashboard/platform-growth', bypassAuth, DashboardController.getPlatformGrowth);
router.get('/dashboard/content-moderation', bypassAuth, DashboardController.getContentModeration);
router.get('/dashboard/business-engagement', bypassAuth, DashboardController.getBusinessEngagement);

// ─── Revenue Overview Endpoints ──────────────────────────────────────────────
router.get('/revenue-overview', bypassAuth, DashboardController.getRevenueOverview);
router.get('/revenue-overview/trajectory', bypassAuth, DashboardController.getRevenueTrajectory);
router.get('/revenue-overview/breakdown', bypassAuth, DashboardController.getRevenueBreakdown);

export default router;
