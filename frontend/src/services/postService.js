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
};

export default postService;
