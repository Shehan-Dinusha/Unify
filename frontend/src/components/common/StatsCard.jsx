import React from "react";
import Card from "./Card";

const StatsCard = ({
  iconSrc,
  iconAlt,
  iconBgClass,
  title,
  value,
  subValue,
  subValueClass = "text-state-success",
}) => {
  return (
    <Card
      variant="container"
      className="h-[100px] md:h-40 relative group transition-colors md:p-0 overflow-hidden"
    >
      {/* Mobile View (Side-by-side scaled down) */}
      <div className="flex flex-col h-full items-center justify-center md:hidden p-2">
        <div className="flex flex-col items-center w-full">
          <p className="text-[10px] font-bold text-text-secondary leading-tight line-clamp-2 text-center min-h-[24px] flex items-center">
            {title}
          </p>
          <div className="flex items-baseline justify-center gap-1 mt-0.5">
            <span className="text-xl font-bold text-text-primary leading-none">
              {value}
            </span>
          </div>
        </div>
      </div>

      {/* PC View (Original absolute positioning) */}
      <div className="hidden md:block">
        <div
          className={`absolute top-lg left-lg w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}
        >
          <img src={iconSrc} alt={iconAlt} className="w-6 h-6" />
        </div>
        <div className="absolute top-[80px] left-lg">
          <p className="text-body-small-bold text-text-secondary">{title}</p>
        </div>
        <div className="absolute top-[100px] left-lg flex items-end gap-sm">
          <span className="text-heading-medium text-text-primary">{value}</span>
          {subValue && (
            <span className={`text-body-small-bold pb-xs ${subValueClass}`}>
              {subValue}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
