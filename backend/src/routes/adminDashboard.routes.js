import express from 'express';
import * as DashboardController from '../controllers/admin/adminDashboard.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ─── Dashboard Endpoints — Admin only ────────────────────────────────────────
router.get('/dashboard/stats', protect, authorize('Admin'), DashboardController.getDashboardStats);
router.get('/dashboard/platform-growth', protect, authorize('Admin'), DashboardController.getPlatformGrowth);
router.get('/dashboard/content-moderation', protect, authorize('Admin'), DashboardController.getContentModeration);
router.get('/dashboard/business-engagement', protect, authorize('Admin'), DashboardController.getBusinessEngagement);

// ─── Revenue Overview Endpoints — Admin only ─────────────────────────────────
router.get('/revenue-overview', protect, authorize('Admin'), DashboardController.getRevenueOverview);
router.get('/revenue-overview/trajectory', protect, authorize('Admin'), DashboardController.getRevenueTrajectory);
router.get('/revenue-overview/breakdown', protect, authorize('Admin'), DashboardController.getRevenueBreakdown);

export default router;

