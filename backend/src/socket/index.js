import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User, Conversation } from "../modules/index.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";
import { registerChatHandlers } from "./chatHandler.js";

let io;

/**
 * Initialize Socket.IO server with JWT authentication middleware.
 * Reuses the same JWT_SECRET and User model as the REST auth flow.
 *
 * @param {import("http").Server} httpServer
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, cb) => {
        const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:4173")
          .split(",").map(s => s.trim());
        if (!origin || allowed.includes(origin)) return cb(null, true);
        return cb(null, true);
      },
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // ── JWT Authentication Middleware ──────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify JWT (same secret as REST auth)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB (same lookup as auth.middleware.js)
      const user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email", "role", "avatar", "status", "isOnline"],
      });

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      if (user.status === "Suspended") {
        return next(new Error("Authentication error: Account is suspended"));
      }

      // Only Students and Clubs can use chat
      if (!["Student", "Club"].includes(user.role)) {
        return next(new Error("Authorization error: Chat is not available for your role"));
      }

      // Attach user to socket (never trust frontend user IDs)
      socket.user = {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      };

      next();
    } catch (error) {
      logger.error("Socket auth error:", error.message);
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // ── Helper: broadcast presence to all conversation partners ────────────────
  const broadcastPresence = async (userId, isOnline, lastActive = null) => {
    try {
      const conversations = await Conversation.findAll({
        where: {
          [Op.or]: [
            { participantOneId: userId },
            { participantTwoId: userId },
          ],
        },
        attributes: ["participantOneId", "participantTwoId"],
      });

      const partnerIds = new Set();
      conversations.forEach((conv) => {
        const partnerId = conv.participantOneId === userId
          ? conv.participantTwoId
          : conv.participantOneId;
        partnerIds.add(partnerId);
      });

      const payload = { userId, isOnline, lastActive: lastActive || new Date() };
      partnerIds.forEach((partnerId) => {
        io.to(`user:${partnerId}`).emit("user:presence", payload);
      });
    } catch (error) {
      logger.error("broadcastPresence error:", error);
    }
  };

  // ── Connection Handler ────────────────────────────────────────────────────
  io.on("connection", async (socket) => {
    const { id, name, role } = socket.user;
    logger.info(`⚡ Socket connected: ${name} (${role}) [${socket.id}]`);

    // Mark user online
    await User.update({ isOnline: true }, { where: { id } });

    // Join personal room for direct notifications
    socket.join(`user:${id}`);

    // Broadcast online presence to conversation partners
    await broadcastPresence(id, true);

    // Register chat event handlers
    registerChatHandlers(io, socket);

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      logger.info(`🔌 Socket disconnected: ${name} (${role}) [${socket.id}]`);

      // Check if user has other active sockets before marking offline
      const userSockets = await io.in(`user:${id}`).fetchSockets();
      if (userSockets.length === 0) {
        const lastActive = new Date();
        await User.update(
          { isOnline: false, lastActive },
          { where: { id } },
        );

        // Broadcast offline presence to conversation partners
        await broadcastPresence(id, false, lastActive);
      }
    });
  });

  logger.info("✅ Socket.IO server initialized");
  return io;
};

/**
 * Get the active Socket.IO server instance.
 * Useful for emitting events from controllers/services outside of socket handlers.
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
