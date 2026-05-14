/**
 * Business Management Service
 *
 * Direct API calls to the backend. No mock data fallback.
 * If the backend fails, the system fails — this is a real project.
 *
 * When real auth is implemented, ONLY api.js needs to change — not this file.
 */

import api from './api';

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Get business dashboard stats
 */
export const getBusinessStats = async () => {
  const response = await api.get('/admin/businesses/stats');
  return response.data;
};

/**
 * Get filtered business directory
 * @param {{ search?: string, status?: string, category?: string }} filters
 */
export const getBusinessDirectory = async (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
  }
  if (filters.category && filters.category !== 'all') {
    if (filters.category === 'Self Employee') params.category = 'SELF_EMPLOYED';
    else if (filters.category === 'Food & Cafe') params.category = 'FOOD';
    else if (filters.category === 'Boarding') params.category = 'BOARDING';
    else params.category = filters.category;
  }
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await api.get('/admin/businesses', { params });
  return response.data;
};

/**
 * Get a single business's full profile
 * @param {string|number} id
 */
export const getBusinessProfile = async (id) => {
  const response = await api.get(`/admin/businesses/${id}`);
  return response.data;
};

/**
 * Update business status (Suspend / Activate)
 * @param {string|number} id
 * @param {{ status: string, reason?: string, suspensionCategory?: string, sendEmail?: boolean }} data
 */
export const updateBusinessStatus = async (id, data) => {
  const response = await api.put(`/admin/businesses/${id}/status`, data);
  return response.data;
};

/**
 * Add an internal admin note to a business profile
 * @param {string|number} id
 * @param {{ text: string }} data
 */
export const addBusinessNote = async (id, data) => {
  const response = await api.post(`/admin/businesses/${id}/notes`, data);
  return response.data;
};
