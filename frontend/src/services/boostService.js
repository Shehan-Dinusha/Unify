//Boost API Service
import api from './api';

// ─── Helpers ────────────────────────────────────────────────────────────────

//Extract a user-friendly error message from an axios error.
const extractErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;

    switch (status) {
      case 400: return 'Invalid request. Please check the submitted data.';
      case 401: return 'Unauthorized. Please log in again.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A conflict occurred. The package may already exist.';
      case 500: return 'An internal server error occurred. Please try again later.';
      default:  return `Request failed with status ${status}.`;
    }
  }

  if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  if (error.message === 'Network Error') return 'Network error. Please check your connection.';

  return error.message || 'An unexpected error occurred.';
};

// ─── Package CRUD ───────────────────────────────────────────────────────────

/**
 * Get all boost packages (live only by default).
 * @param {boolean} includeArchived - If true, include archived packages
 * @returns {{ packages: Array }}
 */
export const getPackages = async (includeArchived = false) => {
  try {
    const params = {};
    if (includeArchived) params.includeArchived = 'true';
    const response = await api.get('/boosts/packages', { params });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get a single boost package by its ID.
 * @param {string} id
 */
export const getPackageById = async (id) => {
  try {
    const response = await api.get(`/boosts/packages/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Create a new boost package (admin only).
 * @param {{ name, price, durationValue, durationUnit, description, badge, features }} data
 */
export const createPackage = async (data) => {
  try {
    const response = await api.post('/boosts/packages', data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Update an existing boost package (admin only).
 * @param {string} id
 * @param {object} data
 */
export const updatePackage = async (id, data) => {
  try {
    const response = await api.put(`/boosts/packages/${encodeURIComponent(id)}`, data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Delete (archive) a boost package (admin only).
 * @param {string} id
 */
export const deletePackage = async (id) => {
  try {
    const response = await api.delete(`/boosts/packages/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ─── Admin Stats ───────────────────────────────────────────────────────────

/**
 * Get admin boost dashboard stats (DB-driven).
 * @returns {{ stats: { activePackages, monthlyRevenue, revenueChange, totalBoosts30d, boostsChange, avgDurationDays } }}
 */
export const getAdminStats = async () => {
  try {
    const response = await api.get('/boosts/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ─── Purchase ───────────────────────────────────────────────────────────────

/**
 * Purchase a boost for a post.
 * @param {string} packageId
 * @param {number|null} postId
 * @param {string} postType
 */
export const purchaseBoost = async (packageId, postId = null, postType = 'normal') => {
  try {
    const response = await api.post('/boosts/purchase', { packageId, postId, postType });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Create a Stripe checkout session for a boost purchase.
 * @param {object} data - { packageId, postId, postType, amount, packageName, durationDays }
 */
export const createBoostCheckoutSession = async (data) => {
  try {
    const response = await api.post('/boosts/create-checkout-session', data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Confirm a boost payment after Stripe redirect.
 * @param {string} sessionId
 */
export const confirmBoostPayment = async (sessionId) => {
  try {
    const response = await api.post('/boosts/confirm-payment', { sessionId });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get current user's active boosts (expiryDate > now).
 */
export const getMyBoosts = async () => {
  try {
    const response = await api.get('/boosts/my-boosts');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ─── Logs ───────────────────────────────────────────────────────────────────

/**
 * Get boost configuration logs (admin only).
 * @param {{ page?: number, limit?: number, type?: string }} filters
 */
export const getBoostLogs = async (filters = {}) => {
  try {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.type) params.type = filters.type;
    const response = await api.get('/boosts/admin/logs', { params });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ─── Campaigns (existing) ──────────────────────────────────────────────────

/**
 * Create a boost campaign.
 * @param {object} data
 */
export const createCampaign = async (data) => {
  try {
    const response = await api.post('/boosts/campaigns', data);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get all campaigns for the current user.
 */
export const getCampaigns = async () => {
  try {
    const response = await api.get('/boosts/campaigns');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get a specific campaign by ID.
 * @param {string} id
 */
export const getCampaignById = async (id) => {
  try {
    const response = await api.get(`/boosts/campaigns/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};



/**
 * Get interactions for a specific campaign.
 * @param {string} id
 */
export const getCampaignInteractions = async (id) => {
  try {
    const response = await api.get(`/boosts/campaigns/${encodeURIComponent(id)}/interactions`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Get boost analytics by BoostPurchase ID (for business users viewing from My Posts).
 * @param {number|string} purchaseId
 */
export const getBoostAnalyticsByPurchase = async (purchaseId) => {
  try {
    const response = await api.get(`/boosts/purchase/${encodeURIComponent(purchaseId)}/analytics`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
