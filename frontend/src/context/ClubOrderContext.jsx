import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import orderService from "../services/orderService";
import { getCurrentUser, isAuthenticated } from "../services/authService";

const ClubOrderContext = createContext({
  unconfirmedOrderCount: 0,
  refreshUnconfirmedOrderCount: () => {},
});

export const useClubOrders = () => useContext(ClubOrderContext);

const POLL_INTERVAL_MS = 30_000;

export const ClubOrderProvider = ({ children }) => {
  const [unconfirmedOrderCount, setUnconfirmedOrderCount] = useState(0);

  const refreshUnconfirmedOrderCount = useCallback(async () => {
    const user = getCurrentUser();
    const role = user?.role?.toLowerCase();
    const isClub = role === "club" || role === "club_society";

    if (!isAuthenticated() || !isClub || !user?.id) {
      setUnconfirmedOrderCount(0);
      return;
    }

    try {
      const response = await orderService.getClubOrderStats(user.id);
      if (response.success) {
        setUnconfirmedOrderCount(response.data?.unconfirmedOrderCount || 0);
      }
    } catch {
      // The badge is non-critical; keep the rest of the app available.
    }
  }, []);

  useEffect(() => {
    refreshUnconfirmedOrderCount();
    const intervalId = window.setInterval(refreshUnconfirmedOrderCount, POLL_INTERVAL_MS);

    window.addEventListener("auth-changed", refreshUnconfirmedOrderCount);
    window.addEventListener("club-orders-updated", refreshUnconfirmedOrderCount);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("auth-changed", refreshUnconfirmedOrderCount);
      window.removeEventListener("club-orders-updated", refreshUnconfirmedOrderCount);
    };
  }, [refreshUnconfirmedOrderCount]);

  return (
    <ClubOrderContext.Provider
      value={{ unconfirmedOrderCount, refreshUnconfirmedOrderCount }}
    >
      {children}
    </ClubOrderContext.Provider>
  );
};

export default ClubOrderContext;
