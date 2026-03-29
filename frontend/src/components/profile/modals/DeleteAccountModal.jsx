import React from "react";
import { Trash2, X } from "lucide-react";
import Button from "../../common/Button";

/**
 * DeleteAccountModal — confirmation dialog for permanent account deletion.
 * Props:
 *  onClose: function
 *  onConfirm: function
 */
const DeleteAccountModal = ({ onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-dark-2 border border-white/10 rounded-3xl p-xl shadow-custom-shadow animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-md right-md text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-state-error/10 flex items-center justify-center mb-lg mx-auto">
          <Trash2 size={28} className="text-state-error" />
        </div>

        {/* Content */}
        <div className="text-center flex flex-col gap-sm mb-xl">
          <h2 className="text-heading-small text-text-primary font-bold">
            Delete Account
          </h2>
          <p className="text-body-small text-text-secondary leading-relaxed">
            Are you sure you want to permanently delete your account? This
            action{" "}
            <strong className="text-state-error">cannot be undone</strong> and
            all your data will be lost.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <Button variant="danger" fullWidth onClick={onConfirm}>
            Yes, Delete My Account
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
