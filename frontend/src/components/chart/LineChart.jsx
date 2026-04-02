import React from "react";

/**
 * LineChart Component
 * A premium SVG line chart that supports multiple data series and tooltips.
 * 
 * @param {Array<number>} actual - Primary data series
 * @param {Array<number>} projected - Baseline/projected data series
 * @param {number} maxVal - Max value for scaling
 * @param {number} tooltipIdx - Index to highlight with a dot and tooltip
 * @param {string} tooltipLabel - Label for the tooltip
 * @param {string} tooltipValue - Value to show in the tooltip
 * @param {string} className - Additional CSS classes
 */
const LineChart = ({
  actual,
  projected = [],
  maxVal,
  tooltipIdx,
  tooltipLabel = "Value",
  tooltipValue = "",
  className = ""
}) => {
  const W = 600;
  const H = 340;
  const padT = 10;
  const padB = 10;
  const padL = 0;
  const padR = 0;
  const n = actual.length;

  const toX = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);

  const buildPath = (data) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");

  const buildArea = (data) => {
    const line = buildPath(data);
    return `${line} L${toX(n - 1)},${H - padB} L${toX(0)},${H - padB} Z`;
  };

  const tipX = toX(tooltipIdx);
  const tipY = toY(actual[tooltipIdx]);
  const tipXPct = `${(tipX / W) * 100}%`;
  const tipYPct = `${(tipY / H) * 100}%`;

  const gridLines = [0, 0.2, 0.4, 0.6, 0.8, 1].map(p => p * maxVal);

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ height: 340 }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B8CEE" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2B8CEE" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid */}
        {gridLines.map((v) => (
          <line
            key={v}
            x1={padL} y1={toY(v)}
            x2={W - padR} y2={toY(v)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Projected Line */}
        {projected.length > 0 && (
          <path
            d={buildPath(projected)}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="opacity-50"
          />
        )}

        {/* Area Fill */}
        <path d={buildArea(actual)} fill="url(#areaGrad)" />

        {/* Actual Line */}
        <path
          d={buildPath(actual)}
          fill="none"
          stroke="#2B8CEE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg shadow-primary-blue/30"
        />

        {/* Highlight Dot */}
        <circle
          cx={tipX} cy={tipY}
          r="5"
          fill="#2B8CEE"
          stroke="#0D1A26"
          strokeWidth="2"
        />
      </svg>

      {/* Interactive Tooltip Card */}
      {tooltipIdx !== undefined && (
        <div
          className="absolute pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: tipXPct,
            top: tipYPct,
            transform: "translate(-50%, -115%)",
          }}
        >
          <div className="bg-dark-4 border border-white/20 rounded-lg px-3 py-1.5 shadow-custom-shadow whitespace-nowrap">
            <div className="text-[10px] text-text-secondary leading-tight">{tooltipLabel}</div>
            <div className="text-[13px] font-bold text-text-primary leading-tight font-inter">
              {tooltipValue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
