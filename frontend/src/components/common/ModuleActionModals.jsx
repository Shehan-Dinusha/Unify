import React from "react";
import Button from "./Button";
import Card from "./Card";

const ModalBackdrop = ({ children }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
    {children}
  </div>
);

export const ModuleActionSuccessModal = ({
  isOpen,
  onClose,
  moduleName,
  isDelete = false,
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
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ${
              isDelete
                ? "bg-state-error/10 ring-state-error/5 text-state-error"
                : "bg-state-success/10 ring-state-success/5 text-state-success"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {isDelete ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
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
              )}
            </div>
          </div>

          {/* Text */}
          <h2 className="text-xl font-bold text-white mb-3">
            {isDelete ? "Module Deleted" : "Module Saved Successfully!"}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            {isDelete ? (
              <>
                The module{" "}
                <span className="text-white font-semibold">{moduleName}</span>{" "}
                has been completely removed alongside its files.
              </>
            ) : (
              <>
                Changes to{" "}
                <span className="text-white font-semibold">{moduleName}</span>{" "}
                have been saved successfully.
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className={`h-11 shadow-lg font-semibold ${isDelete ? "shadow-state-error/20 bg-state-error hover:bg-red-500" : "shadow-primary-blue/20"}`}
          >
            {isDelete ? "Close" : "Continue"}
          </Button>
        </div>
      </Card>
    </ModalBackdrop>
  );
};
