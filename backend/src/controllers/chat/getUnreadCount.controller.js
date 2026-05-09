import { Conversation, Message } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

/**
 * @desc    Get total unread messages count for the current user across all active conversations
 * @route   GET /api/v1/chat/unread-count
 * @access  Private (Student, Club)
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching unread count for user ${userId}`);

    // 1. Find all active conversations for the user
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
      attributes: ['id', 'participantOneId', 'participantOneClearedAt', 'participantTwoClearedAt'],
    });

    if (!conversations.length) {
      return sendResponse(res, 200, true, "Unread count fetched", { unreadCount: 0 });
    }

    // 2. Count unread messages for each conversation, respecting 'clearedAt'
    let totalUnreadCount = 0;

    await Promise.all(
      conversations.map(async (conv) => {
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

        const count = await Message.count({
          where: unreadWhere,
        });

        totalUnreadCount += count;
      })
    );

    return sendResponse(res, 200, true, "Unread count fetched", { unreadCount: totalUnreadCount });
  } catch (error) {
    logger.error("getUnreadCount error:", error);
    return sendResponse(res, 500, false, "Failed to fetch unread count");
  }
};
