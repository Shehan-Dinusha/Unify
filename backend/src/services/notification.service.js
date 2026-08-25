/**
 * notification.service.js
 *
 * Modular notification service that can be reused across any module.
 * All notification creation flows through this service to ensure:
 *   - Deduplication via unique `dedupeKey`
 *   - Consistent structure
 *   - Self-notification prevention (actors don't notify themselves)
 *
 * Usage from any controller / service:
 *   import { notifyUser, notifyLike, notifyComment, notifyMatch } from "../services/notification.service.js";
 *
 * Aggregated helpers (like reviewFeedback / follower patterns):
 *   notifyLike, removeLikeFromNotification, buildLikeTitle
 */

import { Op } from "sequelize";
import { Notification, User } from "../modules/index.js";
import logger from "../utils/logger.js";

// ── Core Helper ──────────────────────────────────────────────────────────────

/**
 * Create a notification, skipping silently if a duplicate dedupeKey exists
 * or if the actor is the same as the recipient.
 *
 * @param {Object} params
 * @param {number}  params.userId        - Recipient user ID
 * @param {number}  [params.actorId]     - User who triggered the action
 * @param {string}  params.type          - "Reply" | "Like" | "Match" | "General"
 * @param {string}  params.title         - Notification title
 * @param {string}  [params.content]     - Notification body / description
 * @param {number}  [params.referenceId] - ID of the related entity
 * @param {string}  [params.referenceType] - Type label of the related entity
 * @param {string}  [params.dedupeKey]   - Unique key to prevent duplicates
 * @param {string}  [params.image]       - Optional thumbnail URL
 * @returns {Promise<Notification|null>} The created notification, or null if skipped
 */
export const notifyUser = async ({
  userId,
  actorId,
  type = "General",
  title,
  content = null,
  referenceId = null,
  referenceType = null,
  dedupeKey = null,
  image = null,
}) => {
  try {
    // Don't notify yourself
    if (actorId && userId === actorId) return null;

    // If a dedupeKey is provided, check for existing notification
    if (dedupeKey) {
      const existing = await Notification.findOne({ where: { dedupeKey } });
      if (existing) return null; // Duplicate — skip silently
    }

    const notification = await Notification.create({
      userId,
      actorId,
      type,
      title,
      content,
      referenceId,
      referenceType,
      dedupeKey,
      image,
    });

    return notification;
  } catch (error) {
    // If it's a unique constraint violation (race condition), skip silently
    if (error.name === "SequelizeUniqueConstraintError") {
      return null;
    }
    logger.error(`Notification service error: ${error.message}`);
    // Notifications should never break the main flow — fail silently
    return null;
  }
};

// ── Convenience Helpers ──────────────────────────────────────────────────────

/**
 * Build the title for an aggregated post-like notification.
 * Exported for unit testing.
 *
 * @param {Array<{id: number, name: string}>} users - Ordered list of likers (oldest first)
 * @returns {string}
 */
export const buildLikeTitle = (users) => {
  if (users.length === 1) return `${users[0].name} liked your post`;
  if (users.length === 2) return `${users[0].name} and ${users[1].name} liked your post`;
  return `${users[0].name}, ${users[1].name}, and ${users.length - 2} other${users.length - 2 === 1 ? "" : "s"} liked your post`;
};

/**
 * Aggregated post-like notification.
 *
 * If the post owner already has an unread like notification for the same post,
 * the new liker is appended to it (title/content updated in-place).
 * Otherwise a fresh notification is created.
 *
 * referenceType is always "PostLike" so the notification can be found
 * regardless of the underlying post type. The actual postType is stored
 * inside the content JSON so the frontend can still build deep-link URLs.
 *
 * @param {Object} params
 * @param {number} params.postOwnerId - The post author's user ID
 * @param {number} params.actorId     - The user who liked the post
 * @param {string} params.actorName   - Name of the liker
 * @param {number} params.postId      - Post ID
 * @param {string} params.postType    - Post type (normal, club-product, etc.)
 */
export const notifyLike = async ({
  postOwnerId,
  actorId,
  actorName,
  postId,
  postType,
}) => {
  try {
    if (postOwnerId === actorId) return null;

    const existing = await Notification.findOne({
      where: { userId: postOwnerId, referenceType: "PostLike", referenceId: postId, isUnread: true },
      order: [["createdAt", "DESC"]],
    });

    if (existing) {
      const data = JSON.parse(existing.content || "{}");
      const list = data.users || [];
      if (!list.some((u) => u.id === actorId)) {
        list.push({ id: actorId, name: actorName });
      }
      data.users = list;
      existing.content = JSON.stringify(data);
      existing.title = buildLikeTitle(list);
      existing.actorId = actorId;
      await existing.save();
      return existing;
    }

    const data = { postType, users: [{ id: actorId, name: actorName }] };
    return notifyUser({
      userId: postOwnerId,
      actorId,
      type: "Like",
      title: buildLikeTitle(data.users),
      content: JSON.stringify(data),
      referenceId: postId,
      referenceType: "PostLike",
    });
  } catch (error) {
    logger.error(`notifyLike error: ${error.message}`);
    return null;
  }
};

/**
 * Remove a liker from ALL aggregated post-like notifications (read and unread)
 * for the given post. If any notification's user list becomes empty it is destroyed.
 *
 * @param {Object} params
 * @param {number} params.postOwnerId - The post author's user ID
 * @param {number} params.actorId     - The user who unliked
 * @param {number} params.postId      - The post ID
 */
export const removeLikeFromNotification = async ({ postOwnerId, actorId, postId }) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: postOwnerId, referenceType: "PostLike", referenceId: postId },
    });
    if (notifications.length === 0) return null;

    for (const notification of notifications) {
      const data = JSON.parse(notification.content || "{}");
      const filtered = (data.users || []).filter((u) => u.id !== actorId);
      if (filtered.length === 0) {
        await notification.destroy();
      } else {
        data.users = filtered;
        notification.content = JSON.stringify(data);
        notification.title = buildLikeTitle(filtered);
        notification.actorId = filtered[filtered.length - 1].id;
        await notification.save();
      }
    }
    return true;
  } catch (error) {
    logger.error(`removeLikeFromNotification error: ${error.message}`);
    return null;
  }
};

/**
 * Notify a post owner that someone commented on their post.
 *
 * @param {Object} params
 * @param {number} params.postOwnerId  - The post author's user ID
 * @param {number} params.actorId      - The user who commented
 * @param {string} params.actorName    - Name of the commenter
 * @param {number} params.postId       - Post ID
 * @param {string} params.postType     - Post type
 * @param {string} params.commentText  - The comment content (truncated)
 * @param {number} params.commentId    - The comment ID
 */
/**
 * Truncate a comment to 80 characters for use in notification content.
 * Exported for unit testing.
 *
 * @param {string} text
 * @returns {string}
 */
export const truncateComment = (text) =>
  text.length > 80 ? `${text.substring(0, 80)}...` : text;

export const notifyComment = async ({
  postOwnerId,
  actorId,
  actorName,
  postId,
  postType,
  commentText,
  commentId,
}) => {
  const truncated = truncateComment(commentText);

  return notifyUser({
    userId: postOwnerId,
    actorId,
    type: "Reply",
    title: `${actorName} commented on your post`,
    content: `"${truncated}"`,
    referenceId: commentId,
    referenceType: postType,
    dedupeKey: `comment:${actorId}:${postType}:${postId}:${commentId}`,
  });
};

/**
 * Notify a user about a potential Lost & Found match.
 *
 * @param {Object} params
 * @param {number} params.userId       - The user who posted the lost item
 * @param {string} params.matchTitle   - Title of the matched found item
 * @param {number} params.lostItemId   - The user's lost item ID
 * @param {number} params.foundItemId  - The found item ID
 * @param {number} [params.score]      - Match score (0 to 1)
 * @param {string} [params.image]      - Thumbnail of the found item
 */
export const notifyMatch = async ({
  userId,
  matchTitle,
  lostItemId,
  foundItemId,
  score = null,
  image = null,
}) => {
  const matchText = score !== null ? ` (${Math.round(score * 100)}% match)` : "";
  return notifyUser({
    userId,
    type: "Match",
    title: "Potential match found",
    content: `A new item "${matchTitle}" has been posted that matches your item report${matchText}.`,
    referenceId: foundItemId,
    referenceType: "LostAndFound",
    dedupeKey: `match:${userId}:${lostItemId}:${foundItemId}`,
    image,
  });
};

// ── Review Notification Helpers ───────────────────────────────────────────────

/**
 * Notify a business owner that someone reviewed their business.
 */
export const notifyNewReview = async ({ businessOwnerId, actorId, actorName, reviewId, reviewContent }) => {
  return notifyUser({
    userId: businessOwnerId,
    actorId,
    type: "General",
    title: `${actorName} reviewed your business`,
    content: reviewContent ? `"${reviewContent.substring(0, 80)}"` : null,
    referenceId: reviewId,
    referenceType: "Review",
    dedupeKey: `review:${reviewId}`,
  });
};

/**
 * Notify a review author that the business owner replied to their review.
 */
export const notifyReviewReply = async ({ reviewAuthorId, actorId, actorName, reviewId, targetId }) => {
  return notifyUser({
    userId: reviewAuthorId,
    actorId,
    type: "General",
    title: `${actorName} replied to your review`,
    content: JSON.stringify({ targetId }),
    referenceId: reviewId,
    referenceType: "Review",
    dedupeKey: `review-reply:${reviewId}`,
  });
};

/**
 * Notify a review author that the business owner liked their review.
 */
export const notifyOwnerLikeReview = async ({ reviewAuthorId, actorId, actorName, reviewId, targetId }) => {
  return notifyUser({
    userId: reviewAuthorId,
    actorId,
    type: "General",
    title: `${actorName} liked your review`,
    content: JSON.stringify({ targetId }),
    referenceId: reviewId,
    referenceType: "Review",
    dedupeKey: `review-like:${actorId}:${reviewId}`,
  });
};

export const buildReviewFeedbackTitle = (users, action) => {
  const actionText = action === "helpful"
    ? "found your review helpful"
    : "found your review not helpful";
  if (users.length === 1) return `${users[0].name} ${actionText}`;
  if (users.length === 2) return `${users[0].name} and ${users[1].name} ${actionText}`;
  return `${users[0].name}, ${users[1].name}, and ${users.length - 2} others ${actionText}`;
};

/**
 * Aggregated review feedback notification.
 *
 * If the review author already has an unread notification for the same
 * review+action, the new user is appended to it (title/content updated).
 * Otherwise a fresh notification is created.
 */
export const notifyReviewFeedback = async ({ reviewAuthorId, actorId, actorName, reviewId, targetId, action }) => {
  try {
    if (reviewAuthorId === actorId) return null;

    const existing = await Notification.findOne({
      where: { userId: reviewAuthorId, referenceType: "ReviewFeedback", referenceId: reviewId, isUnread: true },
      order: [["createdAt", "DESC"]],
    });

    if (existing) {
      const data = JSON.parse(existing.content || "{}");
      if (data.action === action) {
        const list = data.users || [];
        if (!list.some((u) => u.id === actorId)) {
          list.push({ id: actorId, name: actorName });
        }
        data.users = list;
        existing.content = JSON.stringify(data);
        existing.title = buildReviewFeedbackTitle(list, action);
        existing.actorId = actorId;
        await existing.save();
        return existing;
      }
    }

    const data = { targetId, action, users: [{ id: actorId, name: actorName }] };
    return notifyUser({
      userId: reviewAuthorId,
      actorId,
      type: "General",
      title: buildReviewFeedbackTitle(data.users, action),
      content: JSON.stringify(data),
      referenceId: reviewId,
      referenceType: "ReviewFeedback",
    });
  } catch (error) {
    logger.error(`notifyReviewFeedback error: ${error.message}`);
    return null;
  }
};

/**
 * Remove a user from ALL aggregated review feedback notifications (read and unread)
 * for the given review. If any notification's user list becomes empty, it is destroyed.
 */
export const removeReviewFeedbackFromNotification = async ({ reviewAuthorId, actorId, reviewId }) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: reviewAuthorId, referenceType: "ReviewFeedback", referenceId: reviewId },
    });
    if (notifications.length === 0) return null;

    for (const notification of notifications) {
      const data = JSON.parse(notification.content || "{}");
      const filtered = (data.users || []).filter((u) => u.id !== actorId);
      if (filtered.length === 0) {
        await notification.destroy();
      } else {
        data.users = filtered;
        notification.content = JSON.stringify(data);
        notification.title = buildReviewFeedbackTitle(filtered, data.action);
        notification.actorId = filtered[filtered.length - 1].id;
        await notification.save();
      }
    }
    return true;
  } catch (error) {
    logger.error(`removeReviewFeedbackFromNotification error: ${error.message}`);
    return null;
  }
};

// ── Follower Notification Helpers ─────────────────────────────────────────────

export const buildFollowerTitle = (followers) => {
  if (followers.length === 1) {
    return `${followers[0].name} started following you`;
  }
  if (followers.length === 2) {
    return `${followers[0].name} and ${followers[1].name} started following you`;
  }
  return `${followers[0].name}, ${followers[1].name}, and ${followers.length - 2} others started following you`;
};

/**
 * Aggregated follower notification.
 *
 * If the club has an unread follower notification, the new follower is appended
 * to it (title updates). Otherwise a fresh notification is created.
 */
export const notifyNewFollower = async ({ clubId, actorId, actorName }) => {
  try {
    // Don't notify yourself
    if (clubId === actorId) return null;

    const existing = await Notification.findOne({
      where: { userId: clubId, referenceType: "Follower", isUnread: true },
      order: [["createdAt", "DESC"]],
    });

    if (existing) {
      const list = JSON.parse(existing.content || "[]");
      if (!list.some((f) => f.id === actorId)) {
        list.push({ id: actorId, name: actorName });
      }
      existing.content = JSON.stringify(list);
      existing.title = buildFollowerTitle(list);
      existing.actorId = actorId;
      await existing.save();
      return existing;
    }

    const list = [{ id: actorId, name: actorName }];
    return notifyUser({
      userId: clubId,
      actorId,
      type: "General",
      title: buildFollowerTitle(list),
      content: JSON.stringify(list),
      referenceId: clubId,
      referenceType: "Follower",
    });
  } catch (error) {
    logger.error(`notifyNewFollower error: ${error.message}`);
    return null;
  }
};

/**
 * Remove a follower from ALL aggregated follower notifications (read and unread).
 * If any notification's follower list becomes empty, it is destroyed.
 */
export const removeFollowerFromNotification = async ({ clubId, followerId }) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: clubId, referenceType: "Follower" },
    });
    if (notifications.length === 0) return null;

    for (const notification of notifications) {
      const list = JSON.parse(notification.content || "[]");
      const filtered = list.filter((f) => f.id !== followerId);
      if (filtered.length === 0) {
        await notification.destroy();
      } else {
        notification.content = JSON.stringify(filtered);
        notification.title = buildFollowerTitle(filtered);
        notification.actorId = filtered[filtered.length - 1].id;
        await notification.save();
      }
    }
    return true;
  } catch (error) {
    logger.error(`removeFollowerFromNotification error: ${error.message}`);
    return null;
  }
};

// ── Query Helpers (used by controllers) ──────────────────────────────────────

/**
 * Get notifications for a user with optional filtering.
 */
export const getUserNotifications = async (userId, { filter = "all", limit = 50, offset = 0 } = {}) => {
  const where = { userId };

  if (filter === "unread") {
    where.isUnread = true;
  } else if (filter === "match") {
    // Include auto-match notifications (type='Match') AND
    // claim/found-item notifications sent by claimItem controller (referenceType='LostAndFound')
    where[Op.or] = [
      { type: "Match" },
      { referenceType: "LostAndFound" },
    ];
  }

  const { count, rows } = await Notification.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "actor",
        attributes: ["id", "name", "email", "avatar"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { total: count, notifications: rows };
};

/**
 * Get the count of unread notifications for a user.
 */
export const getUnreadCount = async (userId) => {
  return Notification.count({ where: { userId, isUnread: true } });
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId },
  });

  if (!notification) return null;

  notification.isUnread = false;
  await notification.save();
  return notification;
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
  const [affectedCount] = await Notification.update(
    { isUnread: false },
    { where: { userId, isUnread: true } },
  );
  return affectedCount;
};

/**
 * Delete a single notification.
 */
export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId },
  });

  if (!notification) return null;

  await notification.destroy();
  return true;
};

/**
 * Delete a notification by its dedupeKey. Fails silently (never throws).
 */
export const deleteByDedupeKey = async (dedupeKey) => {
  try {
    const notification = await Notification.findOne({ where: { dedupeKey } });
    if (!notification) return null;
    await notification.destroy();
    return true;
  } catch (error) {
    logger.error(`Error deleting notification by dedupeKey: ${error.message}`);
    return null;
  }
};
