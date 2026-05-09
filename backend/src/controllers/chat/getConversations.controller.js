import { Conversation, Message, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { resolveAvatar } from "./utils.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

/**
 * @desc    Get all conversations for the current user
 * @route   GET /api/v1/chat/conversations
 * @access  Private (Student, Club)
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { 
            participantOneId: userId, 
            deletedByParticipantOne: { [Op.or]: [false, null] } 
          },
          { 
            participantTwoId: userId, 
            deletedByParticipantTwo: { [Op.or]: [false, null] } 
          },
        ],
      },
      include: [
        {
          model: User,
          as: "participantOne",
          attributes: ["id", "name", "avatar", "role", "isOnline", "lastActive"],
        },
        {
          model: User,
          as: "participantTwo",
          attributes: ["id", "name", "avatar", "role", "isOnline", "lastActive"],
        },
      ],
      order: [["lastMessageAt", "DESC"]],
    });

    // Build response with unread counts and resolved avatars
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser =
          conv.participantOneId === userId ? conv.participantTwo : conv.participantOne;

        const clearedAt =
          conv.participantOneId === userId
            ? conv.participantOneClearedAt
            : conv.participantTwoClearedAt;

        const unreadWhere = {
          conversationId: conv.id,
          senderId: { [Op.ne]: userId },
          isRead: false,
        };

        if (clearedAt) {
          unreadWhere.createdAt = { [Op.gt]: clearedAt };
        }

        // Count unread messages from the other user
        const unreadCount = await Message.count({
          where: unreadWhere,
        });

        const otherAvatar = await resolveAvatar(otherUser.avatar);

        return {
          id: conv.id,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            avatar: otherAvatar,
            role: otherUser.role,
            isOnline: otherUser.isOnline,
            lastActive: otherUser.lastActive,
          },
          lastMessageText: conv.lastMessageText,
          lastMessageAt: conv.lastMessageAt,
          status: conv.status,
          unreadCount,
          createdAt: conv.createdAt,
        };
      }),
    );

    return sendResponse(res, 200, true, "Conversations fetched", result);
  } catch (error) {
    logger.error("getConversations error:", error);
    return sendResponse(res, 500, false, "Failed to fetch conversations");
  }
};
