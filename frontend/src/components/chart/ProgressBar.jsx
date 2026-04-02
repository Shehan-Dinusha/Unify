import React from "react";

/**
 * ProgressBar Component
 * A premium, smooth horizontal progress bar with customizable colors.
 * 
 * @param {number} value - The current progress value
 * @param {number} max - The maximum possible value
 * @param {string} color - The Tailwind hex/CSS color for the fill
 * @param {string} className - Additional CSS classes
 */
const ProgressBar = ({ value, max = 100, color = "#2B8CEE", className = "" }) => (
  <div className={`w-full h-1.5 bg-white/10 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full rounded-full transition-all duration-500 ease-out"
      style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        backgroundColor: color,
      }}
    />
  </div>
);

export default ProgressBar;
