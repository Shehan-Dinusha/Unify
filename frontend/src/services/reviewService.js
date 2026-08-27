import api from "./api";

/**
 * Fetch all reviews for a specific target user.
 *
 * @param {number|string} targetId - ID of the target user (e.g., Business or Boarding owner)
 */
export const getTargetReviews = async (targetId) => {
  const response = await api.get(`/reviews/target/${targetId}`);
  return response.data.data; // Return { reviews, summary }
};

/**
 * Submit a new review for a target user.
 *
 * @param {Object} payload - { targetId, rating, review, isAnonymous }
 */
export const submitReview = async (payload) => {
  const response = await api.post("/reviews/submit", payload);
  return response.data.data; // Return the new review object
};

/**
 * Delete a review by ID.
 *
 * @param {number|string} reviewId - ID of the review
 */
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Toggle "Helpful" or "Not Helpful" feedback on a review.
 *
 * @param {number|string} reviewId - ID of the review
 * @param {string} action - "helpful" | "not_helpful"
 */
export const toggleReviewFeedback = async (reviewId, action) => {
  const response = await api.post(`/reviews/${reviewId}/feedback`, { action });
  return response.data.data;
};

/**
 * Fetch all reviews created by the currently logged in user.
 */
export const getMyReviews = async () => {
  const response = await api.get("/reviews/me");
  return response.data.data; // Return { reviews, summary }
};

/**
 * Fetch all reviews received by the currently logged in business.
 */
export const getReceivedReviews = async () => {
  const response = await api.get("/reviews/received");
  return response.data.data; // Return { reviews, summary }
};

/**
 * Toggle the business owner's like on a review.
 *
 * @param {number|string} reviewId - ID of the review
 */
export const toggleOwnerLike = async (reviewId) => {
  const response = await api.post(`/reviews/${reviewId}/owner-like`);
  return response.data.data;
};

/**
 * Reply to a review as the business owner.
 *
 * @param {number|string} reviewId - ID of the review
 * @param {string} content - The reply text
 */
export const replyToReview = async (reviewId, content) => {
  const response = await api.post(`/reviews/${reviewId}/reply`, { content });
  return response.data.data;
};
