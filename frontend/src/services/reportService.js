/**
 * Report Moderation Service
 *
 * Direct API calls to the backend for Social Report Moderation.
 * Mirrors the pattern used in studentService.js — no mock data, no fallback.
 *
 * Endpoints hit: /api/v1/reports/social/*
 */

import api from './api';

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Get social report moderation dashboard stats (Total Pending, Critical Flags, Resolved Today)
 */
export const getReportStats = async () => {
  const response = await api.get('/reports/social/stats');
  return response.data;
};

/**
 * Get the social report moderation queue with optional filters
 * @param {{ type?: string, status?: string }} filters
 */
export const fetchAllReports = async (filters = {}) => {
  const params = {};
  if (filters.type && filters.type !== '') params.type = filters.type;
  if (filters.status && filters.status !== '') params.status = filters.status;

  const response = await api.get('/reports/social/queue', { params });
  return response.data;
};

/**
 * Get a single social report's full detail
 * @param {string} id - Report ID (e.g. 'R-4085')
 */
export const fetchReportById = async (id) => {
  const response = await api.get(`/reports/social/${id}`);
  return response.data;
};

/**
 * Process a social report — dismiss
 * @param {string} id
 * @param {string} reason
 * @param {string} notes
 */
export const dismissReport = async (id, reason, notes) => {
  const response = await api.put(`/reports/social/${id}`, {
    action: 'dismiss',
    reason,
    notes,
  });
  return response.data;
};

/**
 * Process a social report — resolve
 * @param {string} id
 * @param {string} notes
 */
export const resolveReport = async (id, notes) => {
  const response = await api.put(`/reports/social/${id}`, {
    action: 'resolve',
    notes,
  });
  return response.data;
};

/**
 * Process a social report — delete post
 * @param {string} id
 * @param {string} category - Violation category (e.g. 'Hate Speech')
 * @param {boolean} notifyUser
 */
export const deleteReportedContent = async (id, category, notifyUser) => {
  const response = await api.put(`/reports/social/${id}`, {
    action: 'delete_post',
    reason: category,
    notes: `Violation: ${category}. Notify user: ${notifyUser}`,
  });
  return response.data;
};

/**
 * Process a social report — suspend user
 * @param {string} id
 * @param {string} reason
 * @param {string} detail
 * @param {boolean} sendEmail
 */
export const suspendReportedUser = async (id, reason, detail, sendEmail) => {
  const response = await api.put(`/reports/social/${id}`, {
    action: 'suspend_user',
    reason,
    notes: `${detail}. Email notification: ${sendEmail}`,
  });
  return response.data;
};

/**
 * Add an internal note to a social report
 * @param {string} id
 * @param {string} notes
 */
export const addReportNote = async (id, notes) => {
  const response = await api.put(`/reports/social/${id}`, {
    action: 'add_note',
    notes,
  });
  return response.data;
};

// ═══════════════════════════════════════════════════════════════════════════
// STUDENT REPORT SYSTEM — Used by StudentSubmittedReports, StudentReportDetail,
// StudentReportIssue, StudentReportWithdrawal pages.
// Endpoints hit: /api/v1/reports/* (non-social)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all reports submitted by the logged-in student
 * @param {{ status?: string, category?: string, search?: string }} filters
 */
export const getMyReports = async (filters = {}) => {
  const params = {};
  if (filters.status && filters.status !== 'all') params.status = filters.status;
  if (filters.category && filters.category !== 'all') params.category = filters.category;
  if (filters.search) params.search = filters.search;
  const response = await api.get('/reports', { params });
  return response.data;
};

/**
 * Get a single student report by its reportId or id
 * @param {string} id
 */
export const getMyReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

/**
 * Submit a new student report
 * Automatically uses multipart/form-data when a FormData object is passed (for file uploads)
 * @param {FormData|Object} data
 */
export const submitReport = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await api.post('/reports', data, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Withdraw a student report
 * @param {string|number} id
 * @param {string} withdrawalReason
 */
export const withdrawMyReport = async (id, withdrawalReason) => {
  const response = await api.delete(`/reports/${id}`, {
    data: { withdrawalReason },
  });
  return response.data;
};
