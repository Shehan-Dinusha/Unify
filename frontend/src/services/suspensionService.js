//User Suspension Service

import api from './api';

// ─── Helpers ────────────────────────────────────────────────────────────────

//Extract a user-friendly error message from an axios error.
const extractErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    // Use the server-supplied message when available
    if (data?.message) return data.message;

    switch (status) {
      case 400: return 'Invalid request. Please check the submitted data.';
      case 401: return 'Unauthorized. Please log in again.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A conflict occurred. The action may already have been performed.';
      case 422: return 'Validation failed. Please ensure all required checks are completed.';
      case 500: return 'An internal server error occurred. Please try again later.';
      default:  return `Request failed with status ${status}.`;
    }
  }

  if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (error.message === 'Network Error') return 'Network error. Please check your connection.';

  return error.message || 'An unexpected error occurred.';
};

// ─── Service Functions ──────────────────────────────────────────────────────

//Get dashboard statistics for the suspended users overview.
export const getDashboardStatistics = async () => {
  try {
    const response = await api.get('/admin/suspended-users/stats/dashboard');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get paginated list of suspended users with optional filters.
 * @param {{ search?: string, reason?: string, dateRange?: string, status?: string, page?: number, limit?: number }} filters
 * Returns: { users, statistics, pagination }
 */
export const getAllSuspendedUsers = async (filters = {}) => {
  try {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.reason && filters.reason !== 'all') params.reason = filters.reason;
    if (filters.dateRange && filters.dateRange !== 'all') params.dateRange = filters.dateRange;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await api.get('/admin/suspended-users', { params });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get a single suspended user's full details by their User ID.
 * Returns: { user, suspension, validations }
 * @param {string|number} userId
 */
export const getSuspendedUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/suspended-users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Create a new suspension record for a user.
 * @param {{ userId: number, reason: string, reasonTag: string, severity: string, effectiveDate: string, adminNotes: string }} data
 */
export const createSuspension = async (data) => {
  try {
    const response = await api.post('/admin/suspended-users', data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Reactivate a suspended user account.
 * @param {string|number} userId
 * @param {{ identityVerificationComplete: boolean, securityAuditPassed: boolean, reactivationNotes?: string }} data
 */
export const reactivateUser = async (userId, data) => {
  try {
    const response = await api.post(`/admin/suspended-users/${userId}/reactivate`, data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
