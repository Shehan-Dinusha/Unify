import api from "./api";

const postService = {
  /**
   * Fetch posts for the feed based on type
   * @param {string} type - 'all', 'club', 'boarding', 'food-cafe', 'services', 'marketplace', 'event', 'popular'
   */
  getFeed: async (type = "all") => {
    try {
      const response = await api.get(`/posts/feed?type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch filtered boarding feed
   * @param {Object} filters - { minPrice, maxPrice, gender }
   */
  getFilteredBoardingFeed: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);
      if (filters.gender) params.append('gender', filters.gender);
      
      const response = await api.get(`/posts/boarding/filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch a single post by type and ID
   * @param {string} type - 'normal', 'club-product', 'club-event', 'boarding'
   * @param {number|string} id - Post ID
   */
  getPost: async (type, id) => {
    try {
      const response = await api.get(`/posts/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new post
   * @param {string} type - 'normal', 'club-product', 'club-event', 'boarding'
   * @param {FormData} formData - Post data including files
   */
  createPost: async (type, formData) => {
    try {
      const response = await api.post(`/posts/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  /**
   * Fetch all posts created by the current user
   */
  getMyPosts: async () => {
    try {
      const response = await api.get(`/posts/my-posts?type=my-posts`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch posts for a specific user (public profiles)
   * @param {number|string} userId - Target user ID
   */
  getUserPosts: async (userId) => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a post by type and ID
   * @param {string} type - 'normal', 'club-product', 'club-event', 'boarding'
   * @param {number|string} id - Post ID
   */
  deletePost: async (type, id) => {
    try {
      const response = await api.delete(`/posts/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default postService;
