import React, { useState } from "react";
import { Trash2, X, Eye, EyeOff, Lock } from "lucide-react";
import Button from "../../common/Button";
import Card from "../../common/Card";

/**
 * DeleteAccountModal — confirmation dialog for permanent account deletion.
 * Requires password confirmation before proceeding.
 * Props:
 *  onClose: function
 *  onConfirm: function(password) — receives the entered password
 */
const DeleteAccountModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("Please enter your password to continue");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err.message || "Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" />

      {/* Modal */}
      <Card
        variant="card"
        className="w-full max-w-md !bg-dark-2 !backdrop-blur-none !border-white/10 !shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        padding="p-xl"
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
        <div className="text-center flex flex-col gap-sm mb-lg">
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

        {/* Password Field */}
        <div className="mb-lg">
          <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider mb-2 block">
            Confirm your password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              placeholder="Enter your password"
              className="w-full h-[52px] rounded-2xl bg-white/5 border border-white/10 pl-11 pr-12 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-state-error/50 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <p className="text-state-error text-body-extra-small mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <Button
            variant="danger"
            fullWidth
            onClick={handleConfirm}
            disabled={!password.trim() || loading}
          >
            {loading ? "Deleting..." : "Yes, Delete My Account"}
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DeleteAccountModal;
