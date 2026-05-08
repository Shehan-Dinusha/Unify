import express from "express";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
} from "../controllers/notifications/index.js";

const router = express.Router();

// Get all notifications (with optional filter: all, unread, match)
router.get("/", getNotifications);

// Get unread count (lightweight endpoint for badge display)
router.get("/unread-count", getNotificationUnreadCount);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsRead);

// Mark a single notification as read
router.patch("/:id/read", markNotificationRead);

// Delete a single notification
router.delete("/:id", removeNotification);

export default router;
