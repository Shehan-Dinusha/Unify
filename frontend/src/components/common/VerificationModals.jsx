import React, { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import { CheckIcon, CloseIcon, MinusCircleIcon, ShieldCheckFilledIcon, WarningIcon } from "./Icons";

const ModalBackdrop = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
    {children}
  </div>
);

export const ActionErrorModal = ({
  isOpen,
  onClose,
  title = "Action Failed",
  message,
}) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-error">
              <WarningIcon />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-6">
            {message || "Something went wrong. Please try again."}
          </div>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Try Again
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const WithdrawalSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <CheckIcon />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            Application Withdrawn
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Your verification application has been withdrawn and all submitted
            documents have been removed.
          </p>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Back to Profile
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const RevocationSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <CheckIcon />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            Status Revoked
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Your Batch Rep status has been revoked successfully. Administrative
            privileges have been removed.
          </p>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Back to Profile
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const VerificationConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary-blue/5">
            <div className="w-8 h-8 flex items-center justify-center text-primary-blue">
              <ShieldCheckFilledIcon />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-white mb-3">
            Confirm Verification
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Are you sure you want to verify this request? This action will grant
            the requested permissions and notify the user.
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 bg-transparent flex gap-4">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className="flex-1 h-11 shadow-lg shadow-primary-blue/20 font-semibold"
            disabled={loading}
          >
            Confirm Verification
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const VerificationSuccessModal = ({
  isOpen,
  onClose,
  clubName = "Robotics Club",
}) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <CheckIcon />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-white mb-3">
            Successfully Verified!
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            The <span className="text-white font-semibold">{clubName}</span> has
            been officially verified and the account owner has been notified.
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Back to Queue
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const VerificationRejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  clubName = "Robotics Club",
  requestType = "Club",
  loading,
}) => {
  const [selectedReason, setSelectedReason] = useState("Incomplete Documents");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const reasons = [
    "Incomplete Documents",
    "Incorrect Information",
    "Expired Proof/Validity",
    "Other (Specify below)",
  ];

  const recipientRole =
    requestType === "Club" ? "club representative" : "batch representative";

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className="h-[500px]"
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center text-state-error">
                <WarningIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-body-large-bold text-text-primary leading-tight">
                  Reject Verification
                </h3>
                <p className="text-body-small-bold text-text-secondary">
                  Request from: {clubName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 pt-0 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Reason Select */}
            <div>
              <h4 className="text-body-small-bold text-text-soft mb-3">
                Select Standard Rejection Reason
              </h4>
              <div className="space-y-3">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedReason === reason
                        ? "bg-blue-600/5 border-primary-blue/30"
                        : "bg-transparent border-white/5 hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        selectedReason === reason
                          ? "border-primary-blue bg-primary-blue"
                          : "border-text-secondary bg-transparent"
                      }`}
                    >
                      {selectedReason === reason && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-body-small ${selectedReason === reason ? "text-text-primary" : "text-text-secondary"}`}
                    >
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Message (Conditional) */}
            {selectedReason === "Other (Specify below)" && (
              <div className="animate-in slide-in-from-top-2 duration-300 fade-in">
                <h4 className="text-body-small-bold text-text-soft mb-2">
                  Custom Message to User
                </h4>
                <div className="bg-dark-4 border border-white/10 rounded-xl overflow-hidden">
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Provide a detailed explanation of why this request was rejected..."
                    className="w-full h-32 bg-transparent p-4 text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-2 bg-transparent flex gap-4 flex-shrink-0">
            <Button
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(selectedReason, customReason)}
              variant="danger"
              className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                (selectedReason === "Other (Specify below)" &&
                  !customReason.trim())
              }
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

export const VerificationRejectedSuccessModal = ({
  isOpen,
  onClose,
  clubName = "Robotics Club",
  reason = "Incomplete Documents",
}) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="modal"
        padding="p-0"
        className=""
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center ring-4 ring-state-error/10">
              <MinusCircleIcon className="w-9 h-9 text-red-400" />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-heading-small text-text-primary mb-2">
            Verification Rejected
          </h2>
          <div className="text-body-small text-text-secondary leading-relaxed mb-6">
            The request from{" "}
            <span className="text-text-primary font-bold">{clubName}</span> has
            been declined.
            <br />
            The user has been notified with the reason:
            <br />
            <span className="text-primary-blue font-bold block mt-1">
              {reason}
            </span>
          </div>

          {/* Button */}
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20"
          >
            Back to Queue
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};

