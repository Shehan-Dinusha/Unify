import React, { useEffect, useState } from "react";

const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[9998] border-b px-4 py-2 text-xs sm:text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-300 ${
        isOnline
          ? "pointer-events-none opacity-0 -translate-y-full border-state-success/20 bg-state-success/10 text-state-success"
          : "opacity-100 translate-y-0 border-state-warning/30 bg-state-warning/15 text-state-warning"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-center text-center">
        {isOnline
          ? "Back online"
          : "You are offline. Changes will sync when connection returns."}
      </div>
    </div>
  );
};

export default NetworkStatusBanner;
