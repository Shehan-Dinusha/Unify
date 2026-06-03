import React from "react";
import Card from "./Card";
import Button from "./Button";
import { CheckIcon } from "./Icons";
import { Trash2 } from "lucide-react";

export const DeleteReviewModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="modal" padding="p-0"
        className="animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-error">
              <Trash2 className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">Delete Review?</h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Are you sure you want to delete this review? This action cannot be undone.
          </div>
        </div>

        <div className="p-6 pt-2 flex gap-4 w-full">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
          >
            Delete
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
        variant="modal" padding="p-0"
        className="animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <CheckIcon />
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
