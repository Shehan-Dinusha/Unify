//Admin Dashboard Service
import api from './api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const extractErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;
    switch (status) {
      case 400: return 'Invalid request. Please check the parameters.';
      case 401: return 'Unauthorized. Please log in again.';
      case 404: return 'The requested resource was not found.';
      case 429: return 'Too many requests. Please slow down.';
      case 500: return 'An internal server error occurred. Please try again later.';
      default:  return `Request failed with status ${status}.`;
    }
  }
  if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (error.message === 'Network Error') return 'Network error. Please check your connection.';
  return error.message || 'An unexpected error occurred.';
};

// ─── Dashboard Endpoints ────────────────────────────────────────────────────

//Get dashboard top stats (total students, boost revenue, active businesses).
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get platform growth chart data.
 * @param {'month'|'30days'|'yearly'} range
 */
export const getPlatformGrowth = async (range = 'month') => {
  try {
    const response = await api.get('/admin/dashboard/platform-growth', { params: { range } });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

//Get content moderation stats (resolved, reviewing, pending).
export const getContentModeration = async () => {
  try {
    const response = await api.get('/admin/dashboard/content-moderation');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

//Get business engagement data by category.
export const getBusinessEngagement = async () => {
  try {
    const response = await api.get('/admin/dashboard/business-engagement');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ─── Revenue Overview Endpoints ─────────────────────────────────────────────

//Get revenue overview stats (total revenue, biz boosts, avg spend, projected).
export const getRevenueOverview = async () => {
  try {
    const response = await api.get('/admin/revenue-overview');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get revenue trajectory (actual vs projected monthly data).
 * @param {number} [year] — defaults to current year
 */
export const getRevenueTrajectory = async (year) => {
  try {
    const params = {};
    if (year) params.year = year;
    const response = await api.get('/admin/revenue-overview/trajectory', { params });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

//Get revenue breakdown by category for the donut chart.
export const getRevenueBreakdown = async () => {
  try {
    const response = await api.get('/admin/revenue-overview/breakdown');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
