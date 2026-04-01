import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";

/**
 * ProfileDashboardCard — clickable dashboard card for profile views.
 * Props:
 *  icon: string (emoji or icon component)
 *  iconBg: string (tailwind bg color class)
 *  title: string
 *  description: string
 *  path: string (optional navigation path)
 *  onClick: function (optional click handler, overrides path)
 */
const ProfileDashboardCard = ({
  icon,
  iconBg = "bg-primary-blue/20",
  title,
  description,
  path,
  onClick,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) return onClick();
    if (path) navigate(path);
  };

  return (
    <Card
      variant="container"
      className={`transition-all duration-200 group h-full min-h-0 md:min-h-[140px] ${
        disabled
          ? "opacity-40 grayscale-[0.2] pointer-events-none cursor-not-allowed"
          : "cursor-pointer hover:border-primary-blue/30 hover:bg-white/10"
      }`}
      padding="p-3 md:p-md"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2.5 md:gap-sm h-full text-start">
        {/* Icon */}
        <div
          className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0 transition-transform group-hover:scale-110`}
        >
          <span className="text-base md:text-lg">{icon}</span>
        </div>
        {/* Text */}
        <div className="flex flex-col gap-1 md:gap-xs">
          <h3 className="text-sm md:text-body-medium-bold text-text-primary group-hover:text-white transition-colors leading-tight">
            {title}
          </h3>
          {description && (
            <p className="hidden md:block text-[11px] md:text-body-extra-small text-text-secondary leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileDashboardCard;
