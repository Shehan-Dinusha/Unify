import React from "react";
import Button from "./Button";
import Card from "./Card";
import Overlay from "./Overlay";
import { CheckIcon, TrashIcon } from "./Icons";
import StatusIcon from "./StatusIcon";

export const ModuleActionSuccessModal = ({
  isOpen,
  onClose,
  moduleName,
  isDelete = false,
}) => {
  return (
    <Overlay open={isOpen} onClose={onClose} zIndex="z-[150]">
      <Card
        variant="modal" padding="p-0"
        className="max-w-sm"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <StatusIcon
            variant={isDelete ? "error" : "success"}
            size="lg"
            icon={
              <div className="w-8 h-8 flex items-center justify-center">
                {isDelete ? <TrashIcon className="text-state-error" /> : <CheckIcon className="text-state-success" />}
              </div>
            }
          />

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
    </Overlay>
  );
};
