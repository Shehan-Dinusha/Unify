import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import notificationService from "../services/notificationService";
import { isAuthenticated } from "../services/authService";

const NotificationContext = createContext({ unreadCount: 0, refreshUnreadCount: () => {} });

export const useNotifications = () => useContext(NotificationContext);

const POLL_INTERVAL_MS = 30_000; // poll every 30 seconds

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    // Only fetch if the user is logged in
    if (!isAuthenticated()) return;
    try {
      const data = await notificationService.getUnreadCount();
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

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
