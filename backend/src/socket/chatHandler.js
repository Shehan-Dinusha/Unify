import { Conversation, Message, User } from "../modules/index.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";

/**
 * Register all chat-related socket event handlers.
 *
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 */
export const registerChatHandlers = (io, socket) => {
  const userId = socket.user.id;

  // ── chat:join — Join a conversation room ──────────────────────────────────
  socket.on("chat:join", async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        return socket.emit("chat:error", { error: "Conversation not found" });
      }

      // Validate user is a participant
      if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
        return socket.emit("chat:error", { error: "Not authorized to join this conversation" });
      }

      socket.join(`chat:${conversationId}`);
      logger.info(`User ${userId} joined room chat:${conversationId}`);
    } catch (error) {
      logger.error("chat:join error:", error);
      socket.emit("chat:error", { error: "Failed to join conversation" });
    }
  });

  // ── chat:leave — Leave a conversation room ────────────────────────────────
  socket.on("chat:leave", ({ conversationId }) => {
    socket.leave(`chat:${conversationId}`);
  });

  // ── chat:send — Send a message ────────────────────────────────────────────
  socket.on("chat:send", async ({ conversationId, text, attachments }) => {
    try {
      if (!conversationId) {
        return socket.emit("chat:error", { error: "conversationId is required" });
      }

      if (!text?.trim() && (!attachments || attachments.length === 0)) {
        return socket.emit("chat:error", { error: "Message cannot be empty" });
      }

      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        return socket.emit("chat:error", { error: "Conversation not found" });
      }

      // Validate sender is a participant
      if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
        return socket.emit("chat:error", { error: "Not authorized to send in this conversation" });
      }

      // Save message to DB
      const message = await Message.create({
        conversationId,
        senderId: userId,
        text: text?.trim() || null,
        attachments: attachments || null,
        isRead: false,
      });

      // Update conversation metadata for list performance
      const previewText = text?.trim()
        ? text.trim().substring(0, 255)
        : "Sent an attachment";

      await conversation.update({
        lastMessageAt: message.createdAt,
        lastMessageText: previewText,
        status: "delivered",
        deletedByParticipantOne: false,
        deletedByParticipantTwo: false,
      });

      let resolvedAttachments = message.attachments;
      if (resolvedAttachments && Array.isArray(resolvedAttachments)) {
        resolvedAttachments = await Promise.all(
          resolvedAttachments.map(async (att) => {
            let url = att.url;
            if (att.key && !url) {
               try {
                 const { getFileUrl } = await import("../services/s3.service.js");
                 url = await getFileUrl(att.key);
               } catch (e) {
                 logger.error("Failed to resolve attachment S3 URL", e);
               }
            }
            return { ...att, url };
          })
        );
      }

      // Build response payload with sender info
      const messagePayload = {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: socket.user.name,
        senderAvatar: socket.user.avatar,
        text: message.text,
        attachments: resolvedAttachments,
        isRead: message.isRead,
        createdAt: message.createdAt,
      };

      // Emit to all users in the room (including sender for confirmation)
      io.to(`chat:${conversationId}`).emit("chat:receive", {
        message: messagePayload,
        conversationId,
      });

      // Also notify the other participant's personal room (for conversation list update)
      const otherUserId = conversation.participantOneId === userId
        ? conversation.participantTwoId
        : conversation.participantOneId;

      io.to(`user:${otherUserId}`).emit("chat:new_conversation_message", {
        conversationId,
        lastMessageText: previewText,
        lastMessageAt: message.createdAt,
        senderId: userId,
        senderName: socket.user.name,
      });
    } catch (error) {
      logger.error("chat:send error:", error);
      socket.emit("chat:error", { error: "Failed to send message" });
    }
  });

  // ── chat:read — Mark messages as read ─────────────────────────────────────
  socket.on("chat:read", async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) return;

      if (conversation.participantOneId !== userId && conversation.participantTwoId !== userId) {
        return;
      }

      // Mark all unread messages from the OTHER user as read
      const [updatedCount] = await Message.update(
        { isRead: true },
        {
          where: {
            conversationId,
            senderId: { [Op.ne]: userId },
            isRead: false,
          },
        },
      );

      if (updatedCount > 0) {
        // Update conversation status
        await conversation.update({ status: "seen" });

        // Notify the room about read receipt
        io.to(`chat:${conversationId}`).emit("chat:read_receipt", {
          conversationId,
          readBy: userId,
          readAt: new Date(),
        });
      }
    } catch (error) {
      logger.error("chat:read error:", error);
    }
  });

  // ── chat:delete_message — Hard-delete a message ───────────────────────────
  socket.on("chat:delete_message", async ({ conversationId, messageId }) => {
    try {
      const message = await Message.findOne({
        where: { id: messageId, conversationId },
      });

      if (!message) {
        return socket.emit("chat:error", { error: "Message not found" });
      }

      // Only the sender can delete their own message
      if (message.senderId !== userId) {
        return socket.emit("chat:error", { error: "You can only delete your own messages" });
      }

      // Hard-delete from DB
      await message.destroy();

      // Notify all in room
      io.to(`chat:${conversationId}`).emit("chat:message_deleted", {
        conversationId,
        messageId,
      });

      // Update conversation last message if the deleted message was the latest
      const latestMessage = await Message.findOne({
        where: { conversationId },
        order: [["createdAt", "DESC"]],
      });

      let newLastMessageText = null;
      let newLastMessageAt = new Date();

      if (latestMessage) {
        newLastMessageText = latestMessage.text?.substring(0, 255) || "Sent an attachment";
        newLastMessageAt = latestMessage.createdAt;
      }

      await Conversation.update(
        { lastMessageText: newLastMessageText, lastMessageAt: newLastMessageAt },
        { where: { id: conversationId } }
      );

      // Emit to personal rooms to ensure sidebar updates
      const conversation = await Conversation.findByPk(conversationId);
      if (conversation) {
        io.to(`user:${conversation.participantOneId}`).emit("chat:conversation_updated", {
          conversationId,
          lastMessageText: newLastMessageText,
          lastMessageAt: newLastMessageAt
        });
        io.to(`user:${conversation.participantTwoId}`).emit("chat:conversation_updated", {
          conversationId,
          lastMessageText: newLastMessageText,
          lastMessageAt: newLastMessageAt
        });
      }
    } catch (error) {
      logger.error("chat:delete_message error:", error);
      socket.emit("chat:error", { error: "Failed to delete message" });
    }
  });

  // ── chat:typing — Typing indicator ────────────────────────────────────────
  socket.on("chat:typing", ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit("chat:user_typing", {
      conversationId,
      userId,
      userName: socket.user.name,
    });
  });

  socket.on("chat:stop_typing", ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit("chat:user_stop_typing", {
      conversationId,
      userId,
    });
  });
};
