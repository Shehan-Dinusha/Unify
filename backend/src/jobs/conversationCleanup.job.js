import cron from "node-cron";
import { Op } from "sequelize";
import { Conversation, Message } from "../modules/index.js";
import logger from "../utils/logger.js";

/**
 * Conversation Cleanup Cron Job
 *
 * Runs once daily at 3:00 AM and permanently deletes conversations
 * (and their messages) that have been soft-deleted by both participants
 * and whose retention period has expired.
 *
 * The retention period is configurable via the CONVERSATION_RETENTION_DAYS
 * environment variable (defaults to 30 days).
 *
 * Safety guard: only purges conversations where both deletedByParticipant
 * flags are still true, so conversations revived by a new message
 * (chatHandler resets both flags to false) are never accidentally deleted.
 */
export const startConversationCleanupJob = () => {
  cron.schedule("0 3 * * *", async () => {
    try {
      const now = new Date();

      const expiredConversations = await Conversation.findAll({
        where: {
          scheduledDeletionAt: { [Op.lte]: now },
          deletedByParticipantOne: true,
          deletedByParticipantTwo: true,
        },
        attributes: ["id"],
      });

      if (expiredConversations.length === 0) return;

      const conversationIds = expiredConversations.map((c) => c.id);

      // Delete all messages belonging to expired conversations
      const deletedMessages = await Message.destroy({
        where: { conversationId: { [Op.in]: conversationIds } },
      });

      // Delete the conversations themselves
      const deletedConversations = await Conversation.destroy({
        where: { id: { [Op.in]: conversationIds } },
      });

      logger.info(
        `[Conversation Cleanup] Purged ${deletedConversations} conversation(s) and ${deletedMessages} message(s).`
      );
    } catch (err) {
      logger.error("[Conversation Cleanup] Cron job failed:", err);
    }
  });

  logger.info("✅ Conversation cleanup cron job scheduled (daily at 3:00 AM).");
};
