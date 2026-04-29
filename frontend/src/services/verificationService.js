import api from "./api";

/**
 * Verification Service for connecting to Backend API
 */
const verificationService = {
  /**
   * Submit a new verification request
   * @param {FormData} formData - Contains document, userId, requestedRole
   */
  submitRequest: async (formData) => {
    // TEMPORARY: Hardcode userId 1 for testing since auth is not connected
    if (!formData.has("userId")) {
      formData.append("userId", "1");
    }
    const response = await api.post("/verifications/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get verification status for the current user
   */
  getStatus: async () => {
    // TEMPORARY: Append userId 1 for testing
    const response = await api.get("/verifications/status", {
      params: { userId: "1" },
    });
    return response.data;
  },

  /**
   * Remove/Withdraw a pending/declined verification request
   */
  withdrawRequest: async () => {
    // TEMPORARY: Append userId 1 for testing
    const response = await api.delete("/verifications/remove", {
      data: { userId: "1" },
    });
    return response.data;
  },

  /**
   * Self-revoke Batch Rep status (for already verified users)
   * @param {string} password - User password for security verification
   */
  revokeBatchRepStatus: async (password) => {
    // TEMPORARY: Append userId 1 for testing
    const response = await api.post("/verifications/revoke-batch-rep", {
      userId: "1",
      password,
    });
    return response.data;
  },

  /**
   * Admin: Get all pending verification requests
   */
  getPendingRequests: async (lastViewed) => {
    const response = await api.get("/verifications/pending", {
      params: { lastViewed },
    });
    return response.data;
  },

  /**
   * Admin: Get all verified entities
   */
  getVerifiedEntities: async (lastViewed) => {
    const response = await api.get("/verifications/verified", {
      params: { lastViewed },
    });
    return response.data;
  },

  /**
   * Admin: Approve a verification request
   * @param {string|number} id - Request ID
   */
  approveRequest: async (id) => {
    const response = await api.patch(`/verifications/${id}/approve`);
    return response.data;
  },

  /**
   * Admin: Reject a verification request
   * @param {string|number} id - Request ID
   * @param {string} reason - Rejection reason
   */
  rejectRequest: async (id, reason) => {
    const response = await api.patch(`/verifications/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Admin: Get document for a request
   */
  getDocument: async (id) => {
    const response = await api.get(`/verifications/${id}/document`);
    return response.data;
  },

  /**
   * Admin: Remove a verified account
   */
  removeVerifiedAccount: async (id) => {
    const response = await api.delete(`/verifications/${id}/remove-verified`);
    return response.data;
  },
};

export default verificationService;
