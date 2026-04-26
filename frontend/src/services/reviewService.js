import api from "./api";

/**
 * Fetch all reviews for a specific target user.
 *
 * @param {number|string} targetId - ID of the target user (e.g., Business or Boarding owner)
 */
export const getTargetReviews = async (targetId) => {
  try {
    const response = await api.get(`/reviews/target/${targetId}`);
    return response.data.data; // Return { reviews, summary }
  } catch (error) {
    console.error("Error fetching target reviews:", error);
    throw error;
  }
};

/**
 * Submit a new review for a target user.
 *
 * @param {Object} payload - { targetId, rating, review, isAnonymous }
 */
export const submitReview = async (payload) => {
  try {
    const response = await api.post("/reviews/submit", payload);
    return response.data.data; // Return the new review object
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

/**
 * Delete a review by ID.
 *
 * @param {number|string} reviewId - ID of the review
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

/**
 * Toggle "Helpful" or "Not Helpful" feedback on a review.
 *
 * @param {number|string} reviewId - ID of the review
 * @param {string} action - "helpful" | "not_helpful"
 */
export const toggleReviewFeedback = async (reviewId, action) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/feedback`, { action });
    return response.data.data;
  } catch (error) {
    console.error("Error toggling review feedback:", error);
    throw error;
  }
};

/**
 * Fetch all reviews created by the currently logged in user.
 */
export const getMyReviews = async () => {
  try {
    const response = await api.get("/reviews/me");
    return response.data.data; // Return { reviews, summary }
  } catch (error) {
    console.error("Error fetching my reviews:", error);
    throw error;
  }
};

/**
 * Fetch all reviews received by the currently logged in business.
 */
export const getReceivedReviews = async () => {
  try {
    const response = await api.get("/reviews/received");
    return response.data.data; // Return { reviews, summary }
  } catch (error) {
    console.error("Error fetching received reviews:", error);
    throw error;
  }
};

/**
 * Toggle the business owner's like on a review.
 *
 * @param {number|string} reviewId - ID of the review
 */
export const toggleOwnerLike = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/owner-like`);
    return response.data.data;
  } catch (error) {
    console.error("Error toggling owner like:", error);
    throw error;
  }
};

/**
 * Reply to a review as the business owner.
 *
 * @param {number|string} reviewId - ID of the review
 * @param {string} content - The reply text
 */
export const replyToReview = async (reviewId, content) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/reply`, { content });
    return response.data.data;
  } catch (error) {
    console.error("Error replying to review:", error);
    throw error;
  }
};
