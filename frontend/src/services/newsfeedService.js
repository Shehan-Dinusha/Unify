import api from "./api";

const newsfeedService = {
  /**
   * Fetch events happening today
   * GET /newsfeed/events-today
   */
  getEventsToday: async () => {
    try {
      const response = await api.get("/newsfeed/events-today");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch new marketplace items added today
   * GET /newsfeed/marketplace-items
   */
  getMarketplaceItemsToday: async () => {
    try {
      const response = await api.get("/newsfeed/marketplace-items");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch new announcements added today
   * GET /newsfeed/new-announcements
   */
  getNewAnnouncements: async () => {
    try {
      const response = await api.get("/newsfeed/new-announcements");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Toggle like on a post
   * POST /posts/:type/:id/like
   */
  toggleLike: async (postType, postId) => {
    try {
      const response = await api.post(`/posts/${postType}/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Toggle save on a post
   * POST /posts/:type/:id/save
   */
  toggleSave: async (postType, postId) => {
    try {
      const response = await api.post(`/posts/${postType}/${postId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get saved posts for the current user
   * GET /posts/saved
   */
  getSavedPosts: async () => {
    try {
      const response = await api.get("/posts/saved");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a comment to a post
   * POST /posts/:type/:id/comments
   */
  addComment: async (postType, postId, content) => {
    try {
      const response = await api.post(`/posts/${postType}/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get comments for a post
   * GET /posts/:type/:id/comments
   */
  getComments: async (postType, postId) => {
    try {
      const response = await api.get(`/posts/${postType}/${postId}/comments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default newsfeedService;
