import api from "./api";

/**
 * Chat REST API service.
 * Handles non-realtime operations (fetching data, creating conversations).
 */

/**
 * Get all conversations for the current user.
 */
export const getConversations = async () => {
  const res = await api.get("/chat/conversations");
  return res.data;
};

/**
 * Get paginated messages for a conversation.
 * @param {number} conversationId
 * @param {number|null} beforeId - Cursor for pagination (load older messages)
 */
export const getMessages = async (conversationId, beforeId = null) => {
  const params = {};
  if (beforeId) params.before = beforeId;
  const res = await api.get(`/chat/conversations/${conversationId}/messages`, { params });
  return res.data;
};

/**
 * Create a new conversation with a target user.
 * @param {number} targetUserId
 */
export const createConversation = async (targetUserId) => {
  const res = await api.post("/chat/conversations", { targetUserId });
  return res.data;
};

/**
 * Delete a conversation and all its messages.
 * @param {number} conversationId
 */
export const deleteConversation = async (conversationId) => {
  const res = await api.delete(`/chat/conversations/${conversationId}`);
  return res.data;
};

/**
 * Search users available for chat (Students and Clubs).
 * @param {string} query
 */
export const searchChatUsers = async (query) => {
  const res = await api.get("/chat/search-users", { params: { q: query } });
  return res.data;
};

/**
 * Upload chat attachments to S3.
 * @param {File[]} files - Array of File objects from input
 * @returns {Promise<{success: boolean, data: Array<{key, name, type, size, isImage}>}>}
 */
export const uploadChatAttachments = async (files) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("attachments", f));
  const res = await api.post("/chat/attachments", formData);
  return res.data;
};

export default {
  getConversations,
  getMessages,
  createConversation,
  deleteConversation,
  searchChatUsers,
  uploadChatAttachments,
};
