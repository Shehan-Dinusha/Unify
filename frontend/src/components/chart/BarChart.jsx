import React from "react";

/**
 * BarChart Component
 * A premium SVG-based bar chart with highlighting, grids, and legend.
 * 
 * @param {Array<number>} data - Values to display
 * @param {Array<string>} labels - X-axis labels
 * @param {number} maxVal - Maximum possible value for the scale
 * @param {number} peakIdx - Highlight the bar at this index
 * @param {Array<string>} yLabels - Y-axis tick labels
 * @param {Array<number>} yVals - Y-axis tick values (for grid lines)
 * @param {function} formatValue - Function to format label text
 * @param {function} formatStat - Function to format summary statistics
 * @param {string} statLabel - Legend for the total statistic
 * @param {string} className - Additional CSS classes
 */
const BarChart = ({
  data,
  labels,
  maxVal,
  peakIdx,
  yLabels,
  yVals,
  formatValue = (v) => v,
  formatStat = (v) => v,
  statLabel = "Total",
  className = ""
}) => {
  const W = 600;
  const H = 280;
  const padT = 28;
  const padB = 0;

  const n = data.length;
  const slotW = W / n;
  const barW = slotW * 0.55;

  const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);
  const toX = (i) => i * slotW + slotW / 2;

  // Stats calculation
  const total = data.reduce((a, b) => a + b, 0);
  const avg = total / n;
  const peak = data[peakIdx];

  return (
    <div className={className}>
      <div className="flex gap-4 items-stretch">
        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between text-[11px] text-text-secondary text-right shrink-0 pb-6"
          style={{ minHeight: 180 }}
        >
          {yLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        {/* Chart + X-axis container */}
        <div className="flex-1 min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ aspectRatio: `${W}/${H}` }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1a5276" />
                <stop offset="100%" stopColor="#2B8CEE" />
              </linearGradient>
              <linearGradient id="peakGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#2B8CEE" />
                <stop offset="100%" stopColor="#60B8FF" />
              </linearGradient>
              <filter id="peakGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {yVals.map((v) => (
              <line
                key={v}
                x1={0}
                y1={toY(v)}
                x2={W}
                y2={toY(v)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Bars */}
            {data.map((v, i) => {
              const barH = (v / maxVal) * (H - padT - padB);
              const bX = toX(i) - barW / 2;
              const bY = H - padB - barH;
              const isPeak = i === peakIdx;

              return (
                <g key={i}>
                  <rect
                    x={bX}
                    y={bY}
                    width={barW}
                    height={barH}
                    rx="5"
                    ry="5"
                    fill={isPeak ? "url(#peakGrad)" : "url(#barGrad)"}
                    filter={isPeak ? "url(#peakGlow)" : undefined}
                    opacity={isPeak ? 1 : 0.85}
                    className="transition-all duration-300"
                  />
                  <text
                    x={toX(i)}
                    y={bY - 6}
                    textAnchor="middle"
                    fill={isPeak ? "#60B8FF" : "rgba(255,255,255,0.5)"}
                    fontSize={isPeak ? "11" : "9"}
                    fontWeight={isPeak ? "700" : "500"}
                    fontFamily="Inter, sans-serif"
                  >
                    {formatValue(v)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex mt-1">
            {labels.map((m, i) => (
              <div key={m} className="flex-1 text-center">
                <span
                  className={`text-[11px] font-inter ${i === peakIdx ? "text-primary-blue font-bold" : "text-text-secondary"}`}
                >
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats footer */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-secondary">{statLabel}:</span>
          <span className="text-[13px] font-bold text-text-primary">{formatStat(total)}</span>
        </div>
        <div className="w-px h-4 bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-secondary">Avg:</span>
          <span className="text-[13px] font-bold text-text-primary">{formatStat(Math.round(avg))}</span>
        </div>
        <div className="w-px h-4 bg-white/10 hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-secondary">Peak ({labels[peakIdx]}):</span>
          <span className="text-[13px] font-bold text-primary-blue">{formatStat(peak)}</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
