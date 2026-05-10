import AdminDashboardService from '../../services/adminDashboard.service.js';
import { sendResponse } from '../../utils/response.js';
import logger from '../../utils/logger.js';

/**
 * GET /api/v1/admin/dashboard/stats
 * Returns top-level admin dashboard statistics (student count, boost revenue, active businesses).
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await AdminDashboardService.getDashboardStats();
    return sendResponse(res, 200, true, 'Dashboard stats retrieved', {
      ...stats,
      timestamp: new Date().toISOString(),
      meta: { lastUpdated: stats.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getDashboardStats: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/dashboard/platform-growth?range={month|30days|yearly}
 * Returns weekly/monthly registration, revenue, and business growth data for chart carousel.
 */
export const getPlatformGrowth = async (req, res, next) => {
  try {
    const { range = 'month' } = req.query;
    const validRanges = ['month', '30days', 'yearly'];
    if (!validRanges.includes(range)) {
      return sendResponse(res, 400, false, `Invalid range. Must be one of: ${validRanges.join(', ')}`);
    }

    const data = await AdminDashboardService.getPlatformGrowth(range);
    return sendResponse(res, 200, true, 'Platform growth data retrieved', {
      ...data,
      timestamp: new Date().toISOString(),
      meta: { range, lastUpdated: data.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getPlatformGrowth: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/dashboard/content-moderation
 * Returns report moderation status breakdown (resolved, reviewing, pending).
 */
export const getContentModeration = async (req, res, next) => {
  try {
    const data = await AdminDashboardService.getContentModeration();
    return sendResponse(res, 200, true, 'Content moderation data retrieved', {
      ...data,
      timestamp: new Date().toISOString(),
      meta: { lastUpdated: data.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getContentModeration: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/dashboard/business-engagement
 * Returns active business counts by category for the engagement progress bars.
 */
export const getBusinessEngagement = async (req, res, next) => {
  try {
    const data = await AdminDashboardService.getBusinessEngagement();
    return sendResponse(res, 200, true, 'Business engagement data retrieved', {
      engagement: data,
      timestamp: new Date().toISOString(),
      meta: { lastUpdated: new Date().toISOString() },
    });
  } catch (error) {
    logger.error(`Error in getBusinessEngagement: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/revenue-overview
 * Returns revenue overview stats (total, boosts, avg spend, projected annual).
 */
export const getRevenueOverview = async (req, res, next) => {
  try {
    const data = await AdminDashboardService.getRevenueOverviewStats();
    return sendResponse(res, 200, true, 'Revenue overview retrieved', {
      ...data,
      timestamp: new Date().toISOString(),
      meta: { lastUpdated: data.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getRevenueOverview: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/revenue-overview/trajectory?year={YYYY}
 * Returns monthly actual vs projected revenue for the line chart.
 */
export const getRevenueTrajectory = async (req, res, next) => {
  try {
    const { year } = req.query;
    if (year && (isNaN(year) || year < 2020 || year > 2100)) {
      return sendResponse(res, 400, false, 'Invalid year. Must be between 2020 and 2100.');
    }

    const data = await AdminDashboardService.getRevenueTrajectory(year ? parseInt(year) : undefined);
    return sendResponse(res, 200, true, 'Revenue trajectory retrieved', {
      ...data,
      timestamp: new Date().toISOString(),
      meta: { year: year || new Date().getFullYear(), lastUpdated: data.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getRevenueTrajectory: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/v1/admin/revenue-overview/breakdown
 * Returns revenue breakdown by category for the donut chart.
 */
export const getRevenueBreakdown = async (req, res, next) => {
  try {
    const data = await AdminDashboardService.getRevenueBreakdown();
    return sendResponse(res, 200, true, 'Revenue breakdown retrieved', {
      ...data,
      timestamp: new Date().toISOString(),
      meta: { lastUpdated: data.lastUpdated },
    });
  } catch (error) {
    logger.error(`Error in getRevenueBreakdown: ${error.message}`);
    next(error);
  }
};
