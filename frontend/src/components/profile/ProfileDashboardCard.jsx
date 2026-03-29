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
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (path) navigate(path);
  };

  return (
    <Card
      variant="container"
      className="cursor-pointer hover:border-primary-blue/30 hover:bg-white/10 transition-all duration-200 group h-full min-h-[140px]"
      padding="p-md"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-sm h-full">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg} flex-shrink-0`}
        >
          <span className="text-lg">{icon}</span>
        </div>
        {/* Text */}
        <div className="flex flex-col gap-xs">
          <h3 className="text-body-medium-bold text-text-primary group-hover:text-white transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-body-extra-small text-text-secondary leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileDashboardCard;
