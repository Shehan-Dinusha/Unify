import React, { useState } from "react";
import Button from "./Button";
import Card from "./Card";

const ModalBackdrop = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
    {children}
  </div>
);

export const VerificationConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <Card
        variant="card"
        padding="p-0"
        className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary-blue/5">
            <div className="w-8 h-8 flex items-center justify-center text-primary-blue">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0L0 5.33333V12C0 18.6667 5.10667 24.8933 12 26.6667C18.8933 24.8933 24 18.6667 24 12V5.33333L12 0ZM9.33333 20L4 14.6667L5.88 12.7867L9.33333 16.2267L18.12 7.44L20 9.33333L9.33333 20Z"
                  fill="currentColor"
                />
              </svg>
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
        variant="card"
        className="w-full max-w-[440px] !p-0 overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
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
        variant="card"
        padding="p-0"
        className="w-full max-w-[440px] h-[500px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center text-state-error">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  fill="currentColor"
                />
              </svg>
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
                selectedReason === "Other (Specify below)" &&
                !customReason.trim()
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
        variant="card"
        padding="p-0"
        className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center ring-4 ring-state-error/10">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"
                  fill="#F87171"
                />
              </svg>
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
