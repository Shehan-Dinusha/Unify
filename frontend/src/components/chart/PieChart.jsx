import React from "react";
import DonutChart from "./DonutChart";

/**
 * PieChart Component
 * A variation of the DonutChart that fills the center to create a solid pie chart.
 * 
 * @param {Array<{value: number, color: string}>} segments - Data segments
 * @param {number} size - Square size of the chart in px
 * @param {string} className - Additional CSS classes
 */
const PieChart = ({ segments, size = 140, className = "" }) => {
  // To create a pie chart from a donut, the strokeWidth should equal the radius (size / 2)
  return (
    <DonutChart 
      segments={segments} 
      size={size} 
      strokeWidth={size / 2} 
      className={className} 
      centerLabel={null} // No labels for pie charts usually
    />
  );
};

export default PieChart;
