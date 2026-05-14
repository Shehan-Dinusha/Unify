/**
 * Student Management Service
 *
 * Direct API calls to the backend. No mock data fallback.
 * If the backend fails, the system fails — this is a real project.
 *
 * When real auth is implemented, ONLY api.js needs to change — not this file.
 */

import api from './api';

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Get student dashboard stats (Activity Rate, Verified Identities, Flagged Sessions)
 */
export const getStudentStats = async () => {
  const response = await api.get('/admin/students/stats');
  return response.data;
};

/**
 * Get filtered student directory
 * @param {{ search?: string, status?: string, faculty?: string }} filters
 */
export const getStudentDirectory = async (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
  }
  if (filters.faculty && filters.faculty !== 'all') params.faculty = filters.faculty;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const response = await api.get('/admin/students', { params });
  return response.data;
};

/**
 * Get a single student's full profile
 * @param {string|number} id
 */
export const getStudentProfile = async (id) => {
  const response = await api.get(`/admin/students/${id}`);
  return response.data;
};

/**
 * Update student status (Suspend / Activate)
 * @param {string|number} id
 * @param {{ status: string, reason?: string, suspensionCategory?: string, sendEmail?: boolean }} data
 */
export const updateStudentStatus = async (id, data) => {
  const response = await api.put(`/admin/students/${id}/status`, data);
  return response.data;
};

/**
 * Force logout a student
 * @param {string|number} id
 */
export const forceLogoutStudent = async (id) => {
  const response = await api.post(`/admin/students/${id}/logout`);
  return response.data;
};

/**
 * Send an official warning to a student
 * @param {string|number} id
 * @param {{ category: string, severity: string, message: string }} data
 */
export const sendStudentWarning = async (id, data) => {
  const response = await api.post(`/admin/students/${id}/warning`, data);
  return response.data;
};

/**
 * Add an internal admin note to a student's profile
 * @param {string|number} id
 * @param {{ text: string }} data
 */
export const addStudentNote = async (id, data) => {
  const response = await api.post(`/admin/students/${id}/notes`, data);
  return response.data;
};
