import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";

// Check for a new deployment every hour while the app stays open.
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      setInterval(() => {
        if (navigator.onLine) registration.update();
      }, UPDATE_CHECK_INTERVAL);
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[9999] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-white/10 bg-dark-4 px-4 py-3 text-sm text-white shadow-2xl"
      role="alert"
    >
      <RefreshCw className="h-5 w-5 shrink-0 text-primary-blue" aria-hidden="true" />
      <span className="flex-1">A new version of Unify is available.</span>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        className="rounded-lg bg-primary-blue px-3 py-1.5 font-medium text-white hover:bg-primary-blue/90"
      >
        Reload
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="rounded-lg p-1 text-white/60 hover:text-white"
        aria-label="Dismiss update notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PWAUpdatePrompt;
