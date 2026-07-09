import express from "express";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
} from "../controllers/notifications/index.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all notifications (with optional filter: all, unread, match)
router.get("/", protect, getNotifications);

// Get unread count (lightweight endpoint for badge display)
router.get("/unread-count", protect, getNotificationUnreadCount);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsRead);

// Mark a single notification as read
router.patch("/:id/read", protect, markNotificationRead);

// Delete a single notification
router.delete("/:id", protect, removeNotification);

export default router;
