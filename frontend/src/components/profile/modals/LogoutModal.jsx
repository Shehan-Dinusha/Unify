import React from "react";
import { LogOut, X } from "lucide-react";
import Button from "../../common/Button";
import Card from "../../common/Card";

/**
 * LogoutModal — confirmation dialog before logging out.
 * Props:
 *  onClose: function
 *  onConfirm: function
 */
const LogoutModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-1/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card - Forcing solid dark background and removing all glassmorphic effects to match 3rd screenshot */}
      <Card
        variant="card"
        className="w-full max-w-[400px] !bg-dark-2 !backdrop-blur-none !border-white/10 !shadow-2xl animate-in zoom-in-95 duration-200"
        padding="p-xl"
      >
        {/* Close Button - Optional based on screenshot, but good for UX */}
        <button
          onClick={onClose}
          className="absolute top-lg right-lg text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Dynamic Icon Center */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-lg">
            <LogOut size={32} className="text-state-error translate-x-0.5" />
          </div>

          <h2 className="text-heading-small text-text-primary font-bold mb-sm">
            Log Out
          </h2>
          <p className="text-body-small text-text-secondary leading-relaxed mb-xl px-2">
            Are you sure you want to log out of your account? You will need to
            log in again to access your information.
          </p>
        </div>

        {/* Actions - Side by Side */}
        <div className="flex items-center gap-md">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            className="rounded-2xl py-3"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={onConfirm}
            className="rounded-2xl py-3 shadow-lg shadow-primary-blue/20"
          >
            Confirm Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LogoutModal;
