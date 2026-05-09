import { Conversation, Message } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

/**
 * @desc    Delete a conversation and all its messages
 * @route   DELETE /api/v1/chat/conversations/:id
 * @access  Private (Student, Club)
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = parseInt(req.params.id);

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return sendResponse(res, 404, false, "Conversation not found");
    }

    if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
      return sendResponse(res, 403, false, "Not authorized to delete this conversation");
    }

    if (conversation.participantOneId === userId) {
      conversation.deletedByParticipantOne = true;
      conversation.participantOneClearedAt = new Date();
    } else {
      conversation.deletedByParticipantTwo = true;
      conversation.participantTwoClearedAt = new Date();
    }

    // Check if both participants have deleted the conversation
    if (conversation.deletedByParticipantOne && conversation.deletedByParticipantTwo) {
      // Hard-delete all messages and the conversation
      await Message.destroy({ where: { conversationId } });
      await conversation.destroy();
    } else {
      // Otherwise just save the updated flag
      await conversation.save();
    }

    return sendResponse(res, 200, true, "Conversation deleted");
  } catch (error) {
    logger.error("deleteConversation error:", error);
    return sendResponse(res, 500, false, "Failed to delete conversation");
  }
};
