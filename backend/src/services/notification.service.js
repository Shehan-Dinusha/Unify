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
 */

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
 * Notify a post owner that someone liked their post.
 *
 * @param {Object} params
 * @param {number} params.postOwnerId - The post author's user ID
 * @param {number} params.actorId     - The user who liked the post
 * @param {string} params.actorName   - Name of the liker
 * @param {number} params.postId      - Post ID
 * @param {string} params.postType    - Post type (normal, club-product, etc.)
 * @param {string} [params.postTitle] - Post title for context
 */
export const notifyLike = async ({
  postOwnerId,
  actorId,
  actorName,
  postId,
  postType,
  postTitle = "your post",
}) => {
  return notifyUser({
    userId: postOwnerId,
    actorId,
    type: "Like",
    title: `${actorName} liked your post`,
    content: "",
    referenceId: postId,
    referenceType: postType,
    dedupeKey: `like:${actorId}:${postType}:${postId}`,
  });
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
export const notifyComment = async ({
  postOwnerId,
  actorId,
  actorName,
  postId,
  postType,
  commentText,
  commentId,
}) => {
  const truncated =
    commentText.length > 80
      ? `${commentText.substring(0, 80)}...`
      : commentText;

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

/**
 * Notify a review author that someone found their review helpful or not helpful.
 */
export const notifyReviewFeedback = async ({ reviewAuthorId, actorId, actorName, reviewId, targetId, action }) => {
  const feedbackText = action === "helpful" ? "helpful" : "not helpful";
  return notifyUser({
    userId: reviewAuthorId,
    actorId,
    type: "General",
    title: `${actorName} found your review ${feedbackText}`,
    content: JSON.stringify({ targetId }),
    referenceId: reviewId,
    referenceType: "Review",
    dedupeKey: `review-feedback:${actorId}:${reviewId}:${action}`,
  });
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
    where.type = "Match";
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
