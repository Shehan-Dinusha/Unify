import { Router } from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { requireClubVerification } from "../middlewares/verifyClub.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createConversationValidator } from "../validators/chat.validator.js";
import { uploadToS3 } from "../middlewares/s3Upload.middleware.js";
import {
  getConversations,
  getMessages,
  createConversation,
  deleteConversation,
  searchChatUsers,
  uploadChatAttachments,
  getUnreadCount,
} from "../controllers/chat/index.js";

const router = Router();

// All chat routes require authentication and Student/Club role
router.use(protect, authorize("Student", "Club"));

// GET /api/v1/chat/conversations — List user's conversations
router.get("/conversations", getConversations);

// GET /api/v1/chat/unread-count — Get total unread chat messages
router.get("/unread-count", getUnreadCount);

// GET /api/v1/chat/conversations/:id/messages — Get messages (paginated)
router.get("/conversations/:id/messages", getMessages);

// POST /api/v1/chat/conversations — Create a new conversation
router.post(
  "/conversations",
  createConversationValidator,
  validate,
  createConversation,
);

// DELETE /api/v1/chat/conversations/:id — Delete a conversation
router.delete("/conversations/:id", deleteConversation);

// GET /api/v1/chat/search-users — Search users for new chats
router.get("/search-users", searchChatUsers);

// POST /api/v1/chat/attachments — Upload chat attachments to S3
router.post(
  "/attachments",
  ...uploadToS3({ type: "array", fieldName: "attachments", folder: "chat-attachments", maxCount: 5 }),
  uploadChatAttachments,
);

export default router;

