import React from "react";
import Card from "./Card";
import Button from "./Button";
import { Trash2 } from "lucide-react";

export const DeleteReviewModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[440px] !p-0 overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/10">
            <div className="w-8 h-8 flex items-center justify-center text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">Delete Review</h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Are you sure you want to delete this review?{" "}
            <span className="font-bold text-gray-300">
              This action cannot be undone.
            </span>
          </div>
        </div>

        <div className="p-6 pt-2 bg-transparent flex gap-4 w-full">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-11 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 font-semibold text-white border-none"
          >
            Delete Review
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const ReviewDeletedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[440px] !p-0 overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
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

          <h2 className="text-xl font-bold text-white mb-3">Review Deleted</h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Your review has been successfully deleted.
          </div>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};
