import React from "react";

/**
 * DonutChart Component
 * A high-performance SVG-based donut chart with customizable segments and sizes.
 * 
 * @param {Array<{value: number, color: string}>} segments - Data segments
 * @param {number} size - Square size of the chart in px
 * @param {number} strokeWidth - Width of the donut ring
 * @param {string|number} centerLabel - Primary text in the center
 * @param {string} centerSubLabel - Secondary text in the center
 * @param {string} className - Additional CSS classes
 */
const DonutChart = ({ 
  segments, 
  size = 140, 
  strokeWidth = 18, 
  centerLabel = null, 
  centerSubLabel = "Total",
  className = ""
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalValue = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  // Render centered labels if provided
  const renderCenter = () => {
    if (centerLabel === null) return null;
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-heading-small text-text-primary leading-none">
          {centerLabel}
        </span>
        {centerSubLabel && (
          <span className="text-body-extra-small text-text-secondary mt-1">
            {centerSubLabel}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const dash = (seg.value / totalValue) * circumference;
          const gap = circumference - dash;
          const cur = offset;
          offset += dash;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-cur}
              strokeLinecap="round"
              className="transition-all duration-700 ease-in-out"
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
          );
        })}
      </svg>
      {renderCenter()}
    </div>
  );
};

export default DonutChart;
