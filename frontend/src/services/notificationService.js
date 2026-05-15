import api from "./api";

const notificationService = {
  /**
   * Fetch all notifications with optional filter
   * GET /notifications?filter=all|unread|match
   */
  getNotifications: async (filter = "all") => {
    try {
      const response = await api.get("/notifications", {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get unread notification count (for badge display)
   * GET /notifications/unread-count
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Mark a single notification as read
   * PATCH /notifications/:id/read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default notificationService;
