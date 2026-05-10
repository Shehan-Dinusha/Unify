import { Conversation, Message, User } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import { resolveAvatar } from "./utils.js";
import { Op } from "sequelize";
import logger from "../../utils/logger.js";

/**
 * @desc    Get paginated messages for a conversation
 * @route   GET /api/v1/chat/conversations/:id/messages
 * @access  Private (Student, Club)
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = parseInt(req.params.id);
    const { before, limit = 50 } = req.query;

    // Validate conversation exists and user is a participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return sendResponse(res, 404, false, "Conversation not found");
    }

    if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
      return sendResponse(res, 403, false, "Not authorized to view this conversation");
    }

    // Build query with cursor-based pagination
    const whereClause = { conversationId };
    if (before) {
      whereClause.id = { [Op.lt]: parseInt(before) };
    }

    // Only fetch messages sent after the user cleared the chat
    const clearedAt =
      conversation.participantOneId === userId
        ? conversation.participantOneClearedAt
        : conversation.participantTwoClearedAt;

    if (clearedAt) {
      whereClause.createdAt = { [Op.gt]: clearedAt };
    }

    const messages = await Message.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
    });

    // Resolve sender avatars
    const resolvedMessages = await Promise.all(
      messages.map(async (msg) => {
        const senderAvatar = await resolveAvatar(msg.sender?.avatar);

        // Resolve attachment URLs if present
        let resolvedAttachments = null;
        if (msg.attachments && Array.isArray(msg.attachments)) {
          resolvedAttachments = await Promise.all(
            msg.attachments.map(async (att) => ({
              ...att,
              url: att.key ? await resolveAvatar(att.key) : att.url,
            })),
          );
        }

        return {
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          senderName: msg.sender?.name || "Unknown",
          senderAvatar,
          text: msg.text,
          attachments: resolvedAttachments,
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        };
      }),
    );

    // Mark messages from the other user as read
    await Message.update(
      { isRead: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          isRead: false,
        },
      },
    );

    // Return in chronological order (oldest first)
    resolvedMessages.reverse();

    const hasMore = messages.length === parseInt(limit);

    return sendResponse(res, 200, true, "Messages fetched", {
      messages: resolvedMessages,
      hasMore,
      nextCursor: messages.length > 0 ? messages[messages.length - 1].id : null,
    });
  } catch (error) {
    logger.error("getMessages error:", error);
    return sendResponse(res, 500, false, "Failed to fetch messages");
  }
};
