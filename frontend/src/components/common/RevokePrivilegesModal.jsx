import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Lock,
  CheckCircle,
  BadgeX,
  FileX,
} from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";

const RevokePrivilegesModal = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState("confirm"); // 'confirm' | 'success'
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    // In real app, validate password via API
    setStep("success");
    if (onConfirm) onConfirm();
  };

  const handleClose = () => {
    setStep("confirm");
    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      {step === "confirm" && (
        <Card
          variant="card"
          padding="p-0"
          className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
              <AlertTriangle className="w-8 h-8 text-state-error" />
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Revoke Privileges?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              You are about to remove your{" "}
              <span className="text-white font-bold">Batch Representative</span>{" "}
              status. You will immediately{" "}
              <span className="text-state-error font-bold">lose access</span> to
              the rep dashboard, student verification tools, and club management
              features.
            </p>

            <div className="w-full text-left">
              <label className="text-text-secondary text-sm font-bold block mb-2">
                Enter Password to Confirm
              </label>
              <Input
                icon={Lock}
                type="password"
                placeholder="Account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6 pt-2 bg-transparent flex gap-4">
            <Button
              onClick={handleClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="danger"
              className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
              disabled={!password}
            >
              Confirm Removal
            </Button>
          </div>

          <div className="px-6 py-3 bg-dark-3/50 border-t border-white/5 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-text-secondary" />
            <span className="text-text-secondary text-xs">
              Requires Admin approval to reinstate
            </span>
          </div>
        </Card>
      )}

      {step === "success" && (
        <Card
          variant="card"
          padding="p-0"
          className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
        >
          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
              <CheckCircle className="w-8 h-8 text-state-success" />
            </div>

            <h2 className="text-xl font-bold text-white mb-3">Role Removed</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              You have successfully removed yourself as a Batch Representative.
            </p>

            <div className="w-full p-4 bg-dark-4 rounded-xl border border-white/5 flex flex-col gap-3 text-left">
              <p className="text-white text-sm font-bold">Access Changes</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-3">
                  <BadgeX className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="text-text-secondary text-sm">
                    Representative badge removed from profile
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="text-text-secondary text-sm">
                    Administrative tools access revoked
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FileX className="w-4 h-4 text-text-secondary shrink-0" />
                  <span className="text-text-secondary text-sm">
                    Document management disabled
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 pt-2 w-full">
            <Button
              variant="primary"
              fullWidth
              className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RevokePrivilegesModal;
