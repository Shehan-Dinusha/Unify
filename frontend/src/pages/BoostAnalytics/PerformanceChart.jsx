import React from 'react';

const PerformanceChart = ({ performanceData }) => {
  const { labels, boostedReach, organicReach } = performanceData;
  if (!labels || labels.length === 0) {
    return <p className="text-body-small text-text-secondary font-inter text-center py-xl">No performance data available yet.</p>;
  }

  const maxVal = Math.max(...boostedReach, ...organicReach, 1);
  const width = 600;
  const height = 200;
  const padX = 50;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const toX = (i) => {
    const divisor = labels.length > 1 ? labels.length - 1 : 1;
    return padX + (i / divisor) * chartW;
  };
  const toY = (v) => padY + chartH - (v / maxVal) * chartH;

  const boostedPath = boostedReach
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`)
    .join(' ');
  const organicPath = organicReach
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`)
    .join(' ');
  const boostedAreaPath = `${boostedPath} L${toX(labels.length - 1)},${padY + chartH} L${toX(0)},${padY + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="boostedGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B8CEE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2B8CEE" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={padX} y1={padY + chartH * (1 - f)} x2={width - padX} y2={padY + chartH * (1 - f)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      <path d={boostedAreaPath} fill="url(#boostedGradient)" />
      <path d={organicPath} fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={boostedPath} fill="none" stroke="#2B8CEE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {boostedReach.map((v, i) => (<circle key={`b${i}`} cx={toX(i)} cy={toY(v)} r="3.5" fill="#2B8CEE" stroke="#0D1A26" strokeWidth="2" />))}
      {organicReach.map((v, i) => (<circle key={`o${i}`} cx={toX(i)} cy={toY(v)} r="3" fill="#4ADE80" stroke="#0D1A26" strokeWidth="2" />))}
      {labels.map((label, i) => (
        <text key={i} x={toX(i)} y={height + 15} textAnchor="middle" className="fill-text-secondary" fontSize="11" fontFamily="Inter">
          {label}
        </text>
      ))}
    </svg>
  );
};

export default PerformanceChart;
