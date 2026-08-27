import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

/**
 * Real Socket.IO hook for chat.
 * Connects to the backend Socket.IO server using the JWT token from localStorage.
 * Provides methods for joining/leaving rooms, sending messages, and handling events.
 */
export const useChatSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Derive socket URL from API URL (strip /api/v1 suffix)
    const SOCKET_URL =
      (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(
        "/api/v1",
        "",
      );

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", (_reason) => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const joinRoom = useCallback(
    (conversationId) => {
      socket?.emit("chat:join", { conversationId });
    },
    [socket],
  );

  const leaveRoom = useCallback(
    (conversationId) => {
      socket?.emit("chat:leave", { conversationId });
    },
    [socket],
  );

  const sendMessage = useCallback(
    ({ conversationId, text, attachments }) => {
      socket?.emit("chat:send", { conversationId, text, attachments });
    },
    [socket],
  );

  const markRead = useCallback(
    (conversationId) => {
      socket?.emit("chat:read", { conversationId });
    },
    [socket],
  );

  const deleteMessage = useCallback(
    (conversationId, messageId) => {
      socket?.emit("chat:delete_message", { conversationId, messageId });
    },
    [socket],
  );

  const startTyping = useCallback(
    (conversationId) => {
      socket?.emit("chat:typing", { conversationId });
    },
    [socket],
  );

  const stopTyping = useCallback(
    (conversationId) => {
      socket?.emit("chat:stop_typing", { conversationId });
    },
    [socket],
  );

  return {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    markRead,
    deleteMessage,
    startTyping,
    stopTyping,
  };
};
