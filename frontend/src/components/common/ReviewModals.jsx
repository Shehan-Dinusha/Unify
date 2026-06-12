import React from "react";
import Card from "./Card";
import Button from "./Button";
import Overlay from "./Overlay";
import { CheckIcon } from "./Icons";
import { Trash2 } from "lucide-react";
import StatusIcon from "./StatusIcon";

export const DeleteReviewModal = ({ onClose, onConfirm }) => {
  return (
    <Overlay open={true} onClose={onClose}>
      <Card
        variant="modal" padding="p-0"
        className="animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <StatusIcon variant="error" size="lg" icon={<Trash2 className="w-8 h-8 text-state-error" />} />

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
    </Overlay>
  );
};

export const ReviewDeletedModal = ({ onClose }) => {
  return (
    <Overlay open={true} onClose={onClose}>
      <Card
        variant="modal" padding="p-0"
        className="animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <StatusIcon variant="success" size="lg" icon={<CheckIcon className="w-8 h-8 text-state-success" />} />

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
    </Overlay>
  );
};
