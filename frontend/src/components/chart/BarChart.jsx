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
  const H = 260;
  const padL = 48; // Room for Y-axis labels on left
  const padR = 10;
  const padT = 36;
  const padB = 32; // Room for X-axis labels on bottom

  const n = data.length;
  const slotW = (W - padL - padR) / n;
  const barW = slotW * 0.55;

  const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);
  const toX = (i) => padL + i * slotW + slotW / 2;

  // Stats calculation
  const total = data.reduce((a, b) => a + b, 0);
  const avg = total / n;
  const peak = data[peakIdx];

  return (
    <div className={`${className} overflow-x-auto pb-2 no-scrollbar hide-scrollbar`}>
      <div className="w-full min-w-[550px]">
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

          {/* Horizontal Grid lines and Y-axis labels */}
          {yVals.map((v, idx) => (
            <g key={v}>
              {/* Y-axis Text */}
              <text
                x={padL - 12}
                y={toY(v) + 5}
                textAnchor="end"
                fill="rgba(255,255,255,0.45)"
                fontWeight="500"
                fontFamily="Inter, sans-serif"
                fontSize="12"
              >
                {yLabels[idx]}
              </text>
              {/* Grid Line */}
              <line
                x1={padL}
                y1={toY(v)}
                x2={W - padR}
                y2={toY(v)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </g>
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
                  y={bY - 8}
                  textAnchor="middle"
                  fill={isPeak ? "#60B8FF" : "rgba(255,255,255,0.5)"}
                  fontWeight={isPeak ? "700" : "600"}
                  fontFamily="Inter, sans-serif"
                  fontSize={isPeak ? "14" : "11"}
                >
                  {formatValue(v)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {labels.map((m, i) => (
            m ? (
              <text
                key={i}
                x={toX(i)}
                y={H - 6}
                textAnchor="middle"
                fill={i === peakIdx ? "#2B8CEE" : "rgba(255,255,255,0.6)"}
                fontWeight={i === peakIdx ? "700" : "500"}
                fontFamily="Inter, sans-serif"
                fontSize="12"
              >
                {m}
              </text>
            ) : null
          ))}
        </svg>
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
          <span className="text-[11px] text-text-secondary">Today ({labels[peakIdx] || `Day ${peakIdx + 1}`}):</span>
          <span className="text-[13px] font-bold text-primary-blue">{formatStat(peak)}</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
