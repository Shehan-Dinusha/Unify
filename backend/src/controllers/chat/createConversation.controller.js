import { Conversation, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { resolveAvatar } from "./utils.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Create a new conversation
 * @route   POST /api/v1/chat/conversations
 * @access  Private (Student, Club)
 */
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.body;

    if (userId === targetUserId) {
      return sendResponse(res, 400, false, "Cannot start a conversation with yourself");
    }

    // Validate target user exists and has a valid chat role
    const targetUser = await User.findByPk(targetUserId, {
      attributes: ["id", "name", "avatar", "role", "isOnline", "lastActive", "status"],
    });

    if (!targetUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Cross-role only: Students can only chat with Clubs and vice versa
    const allowedTargetRole = req.user.role === "Student" ? "Club" : "Student";
    if (targetUser.role !== allowedTargetRole) {
      return sendResponse(res, 400, false, "Conversations are only allowed between Students and Clubs");
    }

    if (targetUser.status === "Suspended") {
      return sendResponse(res, 400, false, "This user's account is suspended");
    }

    // Canonical ordering to prevent duplicate conversations
    const participantOneId = Math.min(userId, targetUserId);
    const participantTwoId = Math.max(userId, targetUserId);

    // Find or create
    const [conversation, created] = await Conversation.findOrCreate({
      where: { participantOneId, participantTwoId },
      defaults: {
        participantOneId,
        participantTwoId,
        lastMessageAt: new Date(),
      },
    });

    const otherAvatar = await resolveAvatar(targetUser.avatar);

    const result = {
      id: conversation.id,
      isNew: created,
      otherUser: {
        id: targetUser.id,
        name: targetUser.name,
        avatar: otherAvatar,
        role: targetUser.role,
        isOnline: targetUser.isOnline,
        lastActive: targetUser.lastActive,
      },
      lastMessageText: conversation.lastMessageText,
      lastMessageAt: conversation.lastMessageAt,
      status: conversation.status,
      unreadCount: 0,
      createdAt: conversation.createdAt,
    };

    return sendResponse(
      res,
      created ? 201 : 200,
      true,
      created ? "Conversation created" : "Conversation already exists",
      result,
    );
  } catch (error) {
    logger.error("createConversation error:", error);
    return sendResponse(res, 500, false, "Failed to create conversation");
  }
};
