import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import chatService from "../services/chatService";
import { isAuthenticated, getCurrentUser, logout } from "../services/authService";
import { io } from "socket.io-client";

const ChatContext = createContext({
  unreadMessageCount: 0,
  refreshUnreadCount: () => {},
  socket: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);

const REFRESH_INTERVAL_MS = 60_000; // fallback poll every 60 seconds

export const ChatProvider = ({ children }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) return;

    // Only fetch for roles that can use chat — prevents 403 for Admin/Business
    const user = getCurrentUser();
    const role = user?.role?.toLowerCase();
    if (role !== "student" && role !== "club") return;

    try {
      const data = await chatService.getUnreadCount();
      if (data.success) {
        setUnreadMessageCount(data.data.unreadCount ?? 0);
      }
    } catch {
      // Silently ignore — unread count stays at 0
    }
  }, []);

  // Socket Connection Logic
  useEffect(() => {
    if (!isAuthenticated()) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        socketRef.current = null;
      }
      return;
    }

    // Only connect socket for roles that use chat
    const user = getCurrentUser();
    const role = user?.role?.toLowerCase();
    if (role !== "student" && role !== "club") return;

    if (socketRef.current) return;

    const token = localStorage.getItem("token");
    const SOCKET_URL = (
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
    ).replace("/api/v1", "");

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      refreshUnreadCount();
    });

    newSocket.on("chat:new_conversation_message", () => {
      refreshUnreadCount();
    });

    newSocket.on("chat:unread_count_update", () => {
      refreshUnreadCount();
    });

    newSocket.on("chat:read_receipt", () => {
      refreshUnreadCount();
    });

    // ── Admin force-logout: clear session and redirect to login ──────
    newSocket.on("auth:force_logout", () => {
      logout().catch(() => {});
      window.location.href = "/login";
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [refreshUnreadCount]);

  // Initial fetch + polling fallback
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <ChatContext.Provider
      value={{ unreadMessageCount, refreshUnreadCount, socket }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
