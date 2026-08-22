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
  loading = false,
}) => {
  return (
    <Card variant="container" className="h-24 md:h-40 relative group transition-colors">
      <div
        className={`absolute top-3 left-3 md:top-lg md:left-lg w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}
      >
        <img src={iconSrc} alt={iconAlt} className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="hidden md:block absolute top-[80px] left-lg">
        <p className="text-body-small-bold text-text-secondary">{title}</p>
      </div>
      <div className="absolute top-[52px] md:top-[100px] left-3 md:left-lg right-3 md:right-lg min-w-0">
        {loading ? (
          <div className="h-6 md:h-8 w-10 md:w-16 bg-white/5 animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className="text-heading-small md:text-heading-medium text-text-primary truncate">
              {value}
            </span>
            {subValue && (
              <span className={`text-body-extra-small truncate ${subValueClass}`}>
                {subValue}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
