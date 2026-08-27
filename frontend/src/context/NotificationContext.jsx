import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import notificationService from "../services/notificationService";
import { isAuthenticated, getCurrentUser } from "../services/authService";

const NotificationContext = createContext({ unreadCount: 0, refreshUnreadCount: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);

const POLL_INTERVAL_MS = 30_000; // poll every 30 seconds

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Tracks the userId that was active when the most recent fetch was dispatched.
  // Responses that arrive after a subsequent account switch carry a stale userId
  // and must be discarded to prevent the old count from overwriting the new one
  // (race condition during rapid switching: Nethmi → AIESEC → Nethmi).
  const activeUserIdRef = useRef(getCurrentUser()?.id ?? null);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated()) {
      setUnreadCount(0);
      return;
    }
    // Snapshot the current userId at dispatch time before the async call.
    const userId = getCurrentUser()?.id ?? null;
    activeUserIdRef.current = userId;
    try {
      const data = await notificationService.getUnreadCount();
      // If the active account changed while this request was in-flight,
      // discard the response — it belongs to the previous account.
      if (activeUserIdRef.current !== userId) return;
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // Silently ignore — badge is non-critical
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  // Re-fetch immediately on any auth change (login, logout, account switch).
  // Zeroing first ensures the previous account's badge count is never shown
  // for the new account, even momentarily — mirrors ClubOrderContext behavior.
  useEffect(() => {
    const handleAuthChange = () => {
      setUnreadCount(0);
      refreshUnreadCount();
    };
    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
