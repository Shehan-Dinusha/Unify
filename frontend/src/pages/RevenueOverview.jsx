import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { mockRequests } from '../data/mockData';

// ─── Data ───────────────────────────────────────────────────────────────────

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const yAxisLabels = ['15M', '12M', '9M', '6M', '3M', '0'];
const actualRevenue = [3, 3.5, 4.5, 5, 6, 7, 8, 9.4, 10.5, 11, 11.8, 12.8];
const projectedRevenue = [3, 3.5, 4.5, 5, 6, 7, 8, 9.4, 10, 10.5, 11, 12];
const MAX_REV = 15;
const TOOLTIP_IDX = 7; // Aug

const breakdownSegments = [
    { label: 'Club Tickets', value: 55, color: '#2B8CEE' },
    { label: 'Biz Boosts', value: 25, color: '#6A3093' },
    { label: 'Merchandise', value: 15, color: '#FBBF24' },
    { label: 'Donations', value: 5, color: '#9CA3AF' },
];

// ─── Revenue Line Chart ──────────────────────────────────────────────────────

const RevenueChart = ({ actual, projected, maxVal, tooltipIdx }) => {
    const W = 600;
    const H = 200;
    const padT = 10;
    const padB = 10;
    const padL = 0;
    const padR = 0;
    const n = actual.length;

    const toX = (i) => padL + (i / (n - 1)) * (W - padL - padR);
    const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);

    const buildPath = (data) =>
        data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

    const buildArea = (data) => {
        const line = buildPath(data);
        return `${line} L${toX(n - 1)},${H - padB} L${toX(0)},${H - padB} Z`;
    };

    // Tooltip position as percentage of SVG dimensions
    const tipX = toX(tooltipIdx);
    const tipY = toY(actual[tooltipIdx]);
    const tipXPct = `${(tipX / W) * 100}%`;
    const tipYPct = `${(tipY / H) * 100}%`;

    // Grid lines at each y label
    const gridVals = [0, 3, 6, 9, 12, 15];

    return (
        <div className="relative w-full">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full"
                style={{ height: H }}
            >
                <defs>
                    <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2B8CEE" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2B8CEE" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {gridVals.map((v) => (
                    <line
                        key={v}
                        x1={padL} y1={toY(v)}
                        x2={W - padR} y2={toY(v)}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                ))}

                {/* Area fill */}
                <path d={buildArea(actual)} fill="url(#revAreaGrad)" />

                {/* Projected dashed line */}
                <path
                    d={buildPath(projected)}
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Actual solid line */}
                <path
                    d={buildPath(actual)}
                    fill="none"
                    stroke="#2B8CEE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Tooltip dot */}
                <circle
                    cx={tipX} cy={tipY}
                    r="5"
                    fill="#2B8CEE"
                    stroke="#0D1A26"
                    strokeWidth="2"
                />
            </svg>

            {/* Tooltip — positioned relative to SVG container */}
            <div
                className="absolute pointer-events-none"
                style={{
                    left: tipXPct,
                    top: tipYPct,
                    transform: 'translate(-50%, -110%)',
                }}
            >
                <div className="bg-dark-4 border border-white/20 rounded-lg px-sm py-xs shadow-custom-shadow whitespace-nowrap">
                    <div className="text-body-extra-small text-text-secondary">Current Rev</div>
                    <div className="text-body-small-bold text-text-primary">Rs. 9.4M</div>
                </div>
            </div>
        </div>
    );
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────

const DonutChart = ({ segments, size = 160, strokeWidth = 22, total, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((seg, i) => {
                    const dash = (seg.value / 100) * circumference;
                    const gap = circumference - dash;
                    const cur = offset;
                    offset += dash;
                    return (
                        <circle
                            key={i}
                            cx={size / 2} cy={size / 2} r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-cur}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-heading-small text-text-primary leading-none">{total}</span>
                <span className="text-body-extra-small text-text-secondary">Total LKR</span>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const RevenueOverview = () => {
    const statsTiles = [
        {
            title: 'Total Revenue',
            subtitle: 'Academic Year 2024',
            value: 'Rs. 12.8K',
            change: '↘ 18.2% vs last semester',
            changeClass: 'text-state-error',
            icon: '🏛',
            iconBg: 'bg-state-error/20',
        },
        {
            title: 'Biz Boosts',
            subtitle: 'From Campus Partners',
            value: 'Rs. 1000',
            change: '↘ 12.4% vs last month',
            changeClass: 'text-state-error',
            icon: '🏢',
            iconBg: 'bg-primary-blue/20',
        },
        {
            title: 'Avg. Spend',
            subtitle: 'Per Active Student',
            value: 'Rs. 250',
            change: '— 0.0% stable',
            changeClass: 'text-text-secondary',
            icon: '💳',
            iconBg: 'bg-state-success/20',
        },
        {
            title: 'Projected Annual',
            subtitle: 'Based on Q1 & Q2 trends',
            value: 'Rs. 100K',
            change: '🌱 Growth — Exceeding targets',
            changeClass: 'text-state-success',
            icon: '📊',
            iconBg: 'bg-primary-accent/20',
        },
    ];

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Revenue Overview"
            verificationCount={mockRequests.length}
        >
            {/* ── Stats Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-md mb-lg">
                {statsTiles.map((tile, i) => (
                    <Card
                        key={i}
                        variant="container"
                        className="hover:border-primary-blue/30 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-sm">
                            <div>
                                <p className="text-body-small-bold text-text-secondary">{tile.title}</p>
                                <p className="text-body-extra-small text-text-secondary">{tile.subtitle}</p>
                            </div>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                                <span className="text-lg">{tile.icon}</span>
                            </div>
                        </div>
                        <p className="text-heading-medium text-text-primary mt-sm">{tile.value}</p>
                        <p className={`text-body-extra-small mt-xs ${tile.changeClass}`}>{tile.change}</p>
                    </Card>
                ))}
            </div>

            {/* ── Charts Row ────────────────────────────────────── */}
            <div className="grid grid-cols-5 gap-md">

                {/* Revenue Trajectory — 3 cols */}
                <div className="col-span-3">
                    <Card variant="container">
                        {/* Title + Legend */}
                        <div className="flex items-start justify-between mb-sm">
                            <div>
                                <h3 className="text-body-large-bold text-text-primary">Revenue Trajectory</h3>
                                <p className="text-body-extra-small text-text-secondary mt-xs">
                                    Comparing actual revenue vs AI-driven projections for the fiscal year
                                </p>
                            </div>
                            <div className="flex items-center gap-lg shrink-0 ml-md">
                                <div className="flex items-center gap-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                                    <span className="text-body-extra-small text-text-secondary">Actual</span>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-text-secondary" />
                                    <span className="text-body-extra-small text-text-secondary">Projected</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart body */}
                        <div className="flex gap-sm items-stretch mt-md">
                            {/* Y-axis labels — height matches SVG */}
                            <div
                                className="flex flex-col justify-between text-body-extra-small text-text-secondary text-right shrink-0 pb-6"
                                style={{ height: 200 }}
                            >
                                {yAxisLabels.map((l) => (
                                    <span key={l}>{l}</span>
                                ))}
                            </div>

                            {/* Chart + X-axis */}
                            <div className="flex-1 min-w-0">
                                <RevenueChart
                                    actual={actualRevenue}
                                    projected={projectedRevenue}
                                    maxVal={MAX_REV}
                                    tooltipIdx={TOOLTIP_IDX}
                                />
                                {/* X-axis labels */}
                                <div className="flex mt-1">
                                    {months.map((m, i) => (
                                        <div key={m} className="flex-1 text-center">
                                            <span className={`text-body-extra-small ${i === TOOLTIP_IDX ? 'text-primary-blue font-bold' : 'text-text-secondary'}`}>
                                                {m}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Revenue Breakdown — 2 cols */}
                <div className="col-span-2">
                    <Card variant="container" className="h-full">
                        <h3 className="text-body-large-bold text-text-primary">Revenue Breakdown</h3>
                        <p className="text-body-extra-small text-text-secondary mt-xs mb-lg">
                            Distribution by source category
                        </p>

                        <div className="flex flex-col items-center">
                            <DonutChart
                                segments={breakdownSegments}
                                total="12.8K"
                                label="Total LKR"
                            />

                            <div className="grid grid-cols-2 gap-x-lg gap-y-sm w-full mt-lg">
                                {breakdownSegments.map((seg) => (
                                    <div key={seg.label} className="flex flex-col gap-xs">
                                        <div className="flex items-center gap-xs">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                            <span className="text-body-extra-small text-text-secondary truncate">{seg.label}</span>
                                        </div>
                                        <span className="text-body-small-bold text-text-primary pl-[18px]">{seg.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default RevenueOverview;
