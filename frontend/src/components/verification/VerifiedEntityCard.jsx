import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Avatar from "../common/Avatar";

const VerifiedEntityCard = ({ entity, onRemoveVerification, onViewDocument }) => {
  return (
    <Card
      variant="container"
      className="h-full relative overflow-hidden group hover:bg-white/5 transition-colors"
    >
      <div className="flex flex-col gap-lg h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-sm items-center">
            <Avatar
              src={entity.avatar}
              name={entity.name}
              className="w-12 h-12 rounded-full border border-white/10"
            />
            <div>
              <h3 className="text-body-medium-bold text-text-primary">
                {entity.name}
              </h3>
              <div className="flex items-center gap-sm mt-1">
                <span
                  className={`px-sm py-xs rounded text-body-extra-small-bold font-inter ${
                    entity.type === "Club"
                      ? "bg-indigo-900/30 text-indigo-300"
                      : "bg-purple-900/30 text-purple-300"
                  }`}
                >
                  {entity.type}
                </span>
                <span className="text-text-secondary text-body-extra-small font-normal">
                  • {entity.verifiedDate}
                </span>
              </div>
            </div>
          </div>
          <div className="p-xs bg-blue-500/10 rounded flex items-center justify-center">
            <img
              src="/icon_verified_badge.svg"
              alt="Verified"
              className="w-3 h-3"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-sm bg-dark-4 rounded-lg border border-white/10 flex flex-col justify-center gap-1">
          <div className="flex justify-between items-center">
            <p className="text-body-small-bold text-text-secondary">
              Verified Since
            </p>
            <p className="text-body-small text-text-primary">
              {entity.verifiedDate}
            </p>
          </div>
          {/* Batch Rep Specific Details */}
          {entity.type === "Batch Rep" && (
            <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/5">
              <p className="text-body-small-bold text-text-secondary">
                {entity.degree}
              </p>
              <p className="text-body-small text-text-primary">
                {entity.batch}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-sm mt-auto">
          <Button
            variant="secondary"
            className="h-[42px] bg-dark-2 hover:bg-dark-3 border border-white/10 text-text-secondary"
            onClick={() => onViewDocument && onViewDocument(entity)}
          >
            View Doc
          </Button>
          <Button
            variant="dangerOutline"
            className="h-[42px] border-state-error/30 text-state-error hover:bg-state-error/10 hover:border-state-error/50"
            onClick={() => onRemoveVerification(entity)}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VerifiedEntityCard;
