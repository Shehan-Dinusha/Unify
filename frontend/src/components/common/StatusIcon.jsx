import React from "react";

const variantMap = {
  success: { bg: "bg-state-success/10", ring: "ring-state-success/5" },
  error: { bg: "bg-state-error/10", ring: "ring-state-error/5" },
  info: { bg: "bg-primary-blue/10", ring: "ring-primary-blue/5" },
};

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-16 h-16",
};

const StatusIcon = ({ variant = "info", size = "lg", icon, className = "" }) => {
  const colors = variantMap[variant] || variantMap.info;
  const dimensions = sizeMap[size] || sizeMap.lg;

  return (
    <div
      className={`${dimensions} ${colors.bg} rounded-full flex items-center justify-center ring-4 ${colors.ring} mb-6 ${className}`}
    >
      {icon}
    </div>
  );
};

export default StatusIcon;
