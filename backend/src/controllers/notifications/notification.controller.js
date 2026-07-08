/**
 * notification.controller.js
 *
 * Handles all notification-related HTTP endpoints.
 */

import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../services/notification.service.js";
import { formatRelativeDate } from "../../utils/date.js";
import s3Service from "../../services/s3.service.js";
import logger from "../../utils/logger.js";

/**
 * GET /notifications
 * Query params: filter (all | unread | match), limit, offset
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { filter = "all", limit = 50, offset = 0 } = req.query;

    const { total, notifications } = await getUserNotifications(userId, {
      filter,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Format each notification for the frontend
    const formatted = await Promise.all(notifications.map(async (n) => {
      const json = n.toJSON();
      
      let signedImage = json.image;
      if (signedImage && !signedImage.startsWith("http")) {
        try {
          signedImage = await s3Service.getFileUrl(signedImage);
        } catch (err) {
          logger.error("Failed to sign notification image URL:", err);
        }
      }

      return {
        ...json,
        time: formatRelativeDate(json.createdAt),
        // Map actor info into the shape the frontend expects
        avatar: json.actor?.avatar || null,
        actorName: json.actor?.name || null,
        image: signedImage,
      };
    }));

    return res.status(200).json({
      success: true,
      total,
      notifications: formatted,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /notifications/unread-count
 */
export const getNotificationUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const count = await getUnreadCount(userId);

    return res.status(200).json({ success: true, unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /notifications/:id/read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { id } = req.params;

    const notification = await markAsRead(parseInt(id, 10), userId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    return res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PATCH /notifications/read-all
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const affectedCount = await markAllAsRead(userId);

    return res.status(200).json({ success: true, markedCount: affectedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /notifications/:id
 */
export const removeNotification = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { id } = req.params;

    const result = await deleteNotification(parseInt(id, 10), userId);

    if (!result) {
      return res.status(404).json({ error: "Notification not found." });
    }

    return res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
