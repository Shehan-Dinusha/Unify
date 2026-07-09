import React from "react";
import ReactDOM from "react-dom";
import Button from "../common/Button";
import Card from "../common/Card";
import { CheckIcon } from "../common/Icons";
import StatusIcon from "../common/StatusIcon";

const VisibilitySuccessModal = ({ isOpen, onClose, semesterName, notifyStudents }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-dark-1/80 backdrop-blur-md px-4">
      <Card variant="modal" padding="p-0" className="max-w-sm w-full">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <StatusIcon variant="success" size="lg" icon={<CheckIcon className="w-8 h-8 text-state-success" />} />

          <h2 className="text-xl font-bold text-white mb-3">
            Visibility Updated
          </h2>

          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Visibility settings for{" "}
            <span className="text-white font-semibold">{semesterName}</span>{" "}
            have been updated successfully.
            {notifyStudents && (
              <>
                <br />
                <br />
                Affected students have been notified.
              </>
            )}
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

  return ReactDOM.createPortal(modalContent, document.body);
};

export default VisibilitySuccessModal;
