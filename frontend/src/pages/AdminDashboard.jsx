import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import StatsCard from '../components/common/StatsCard';
import { mockRequests } from '../data/mockData';

// ─── Constants ──────────────────────────────────────────────────────────────

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const yAxisLabels = ['30K', '25K', '20K', '15K', '10K', '5K', '0'];
const studentData = [8000, 9500, 11000, 12000, 14000, 15500, 17000, 18500, 21000, 19000, 18000, 17500];
const businessData = [5000, 6000, 6500, 7000, 8000, 9000, 10000, 11500, 13000, 15000, 16000, 17000];
const barData = [6000, 8000, 10000, 11000, 13000, 14000, 15500, 17000, 21000, 18500, 17000, 16500];
const MAX_VAL = 30000;
const HIGHLIGHT_IDX = 8; // Sep

const moderationData = { resolved: 115, reviewing: 30, pending: 12 };
const engagementData = [
    { label: 'Food & Cafe', value: 85, color: '#2B8CEE' },
    { label: 'Boarding', value: 62, color: '#FF6366' },
    { label: 'Self Employed', value: 45, color: '#4ADE80' },
    { label: 'Clubs & Society', value: 28, color: '#9CA3AF' },
];

// ─── Unified SVG Chart (bars + lines in one coordinate system) ───────────────

const ActivityChart = ({ barData, studentData, businessData, maxVal, highlightIdx, months }) => {
    // SVG canvas dimensions
    const W = 600;
    const H = 200;
    const padL = 0;
    const padR = 0;
    const padT = 8;
    const padB = 0; // x-axis labels are outside SVG

    const n = barData.length;
    const slotW = (W - padL - padR) / n;
    const barW = slotW * 0.45;

    // Convert a data value to SVG y coordinate
    const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);
    // Center x of slot i
    const toX = (i) => padL + i * slotW + slotW / 2;

    // Build smooth polyline points string
    const linePoints = (data) =>
        data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

    // Horizontal grid lines at each y-axis label
    const gridVals = [0, 5000, 10000, 15000, 20000, 25000, 30000];

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ height: H }}
        >
            {/* Grid lines */}
            {gridVals.map((v) => (
                <line
                    key={v}
                    x1={padL} y1={toY(v)}
                    x2={W - padR} y2={toY(v)}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />
            ))}

            {/* Bars */}
            {barData.map((v, i) => {
                const bH = (v / maxVal) * (H - padT - padB);
                const bX = toX(i) - barW / 2;
                const bY = H - padB - bH;
                const isHighlight = i === highlightIdx;
                return (
                    <rect
                        key={i}
                        x={bX} y={bY}
                        width={barW} height={bH}
                        rx="2"
                        fill={isHighlight ? '#2B8CEE' : 'rgba(43,140,238,0.35)'}
                    />
                );
            })}

            {/* Business line (purple) */}
            <polyline
                points={linePoints(businessData)}
                fill="none"
                stroke="#6A3093"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Student line (green) */}
            <polyline
                points={linePoints(studentData)}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Highlight dot on Sep for student line */}
            <circle
                cx={toX(highlightIdx)}
                cy={toY(studentData[highlightIdx])}
                r="4"
                fill="#4ADE80"
                stroke="#0D1A26"
                strokeWidth="2"
            />
        </svg>
    );
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────

const DonutChart = ({ segments, size = 140, strokeWidth = 18 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    let offset = 0;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const dash = (seg.value / total) * circumference;
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
    );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ value, max, color }) => (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
        />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeRange, setActiveRange] = useState('This Month');
    const moderationTotal = moderationData.resolved + moderationData.reviewing + moderationData.pending;

    const statsTiles = [
        {
            iconSrc: '/icon_verified_clubs.svg',
            iconAlt: 'Students',
            iconBgClass: 'bg-primary-blue/20',
            title: 'Total Student Users',
            value: '1,500',
            subValue: '↗ +12% vs last semester',
            subValueClass: 'text-state-success',
            path: '/student-management',
        },
        {
            iconSrc: '/icon_boost_controller.svg',
            iconAlt: 'Revenue',
            iconBgClass: 'bg-state-warning/20',
            title: 'Business Boost Revenue',
            value: 'Rs. 2000',
            subValue: '↑ +4% this month',
            subValueClass: 'text-state-success',
            path: '/revenue-overview',
        },
        {
            iconSrc: '/icon_dashboard.svg',
            iconAlt: 'Businesses',
            iconBgClass: 'bg-primary-accent/20',
            title: 'Active Businesses',
            value: '50',
            subValue: '↗ +2% this year',
            subValueClass: 'text-state-success',
            path: '/active-businesses',
        },
    ];

    const rangeOptions = ['This Month', 'Last 30 Days', 'Yearly'];

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Admin Dashboard"
            verificationCount={mockRequests.length}
        >
            {/* ── Top Stats Row ─────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-md mb-lg">
                {statsTiles.map((tile, i) => (
                    <div
                        key={i}
                        className="cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => navigate(tile.path)}
                    >
                        <StatsCard
                            iconSrc={tile.iconSrc}
                            iconAlt={tile.iconAlt}
                            iconBgClass={tile.iconBgClass}
                            title={tile.title}
                            value={tile.value}
                            subValue={tile.subValue}
                            subValueClass={tile.subValueClass}
                        />
                    </div>
                ))}
            </div>

            {/* ── Platform Insights Header ──────────────────────── */}
            <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-sm">
                    <span className="text-xl">✨</span>
                    <div>
                        <h2 className="text-heading-small text-text-primary">Platform Insights Summary</h2>
                        <p className="text-body-small text-text-secondary">
                            Real-time data visualization for Sri Lankan university ecosystem.
                        </p>
                    </div>
                </div>

                {/* Range Toggle */}
                <div className="flex bg-white/5 p-xs rounded-2xl border border-white/10">
                    {rangeOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setActiveRange(opt)}
                            className={`px-lg py-sm rounded-xl text-body-small-bold font-inter transition-all ${activeRange === opt
                                    ? 'bg-primary-blue text-text-primary shadow-custom'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Charts Row ────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-md">

                {/* ── Left: Main Activity Chart (2 cols) ─────────── */}
                <div className="col-span-2">
                    <Card variant="container">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-md">
                            <div>
                                <h3 className="text-body-large-bold text-text-primary">Overall User Activity & Growth</h3>
                                <p className="text-body-extra-small text-text-secondary mt-xs">
                                    Student vs Business registration trends across universities
                                </p>
                            </div>
                            <div className="flex items-center gap-lg shrink-0 ml-md">
                                <div className="flex items-center gap-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-state-success" />
                                    <span className="text-body-extra-small text-text-secondary">Students</span>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6A3093' }} />
                                    <span className="text-body-extra-small text-text-secondary">Businesses</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart body: Y-axis labels + SVG */}
                        <div className="flex gap-sm items-stretch">
                            {/* Y-axis labels */}
                            <div className="flex flex-col justify-between text-body-extra-small text-text-secondary text-right shrink-0 pb-6" style={{ height: 200 }}>
                                {yAxisLabels.map((l) => (
                                    <span key={l}>{l}</span>
                                ))}
                            </div>

                            {/* Chart + X-axis */}
                            <div className="flex-1 min-w-0">
                                <ActivityChart
                                    barData={barData}
                                    studentData={studentData}
                                    businessData={businessData}
                                    maxVal={MAX_VAL}
                                    highlightIdx={HIGHLIGHT_IDX}
                                    months={months}
                                />
                                {/* X-axis labels — same slot widths as SVG */}
                                <div className="flex mt-1">
                                    {months.map((m, i) => (
                                        <div key={m} className="flex-1 text-center">
                                            <span className={`text-body-extra-small ${i === HIGHLIGHT_IDX ? 'text-primary-blue font-bold' : 'text-text-secondary'}`}>
                                                {m}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ── Right Column ───────────────────────────────── */}
                <div className="flex flex-col gap-md">

                    {/* Content Moderation */}
                    <Card variant="container" className="flex-1">
                        <h3 className="text-body-large-bold text-text-primary mb-md">Content Moderation</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative" style={{ width: 140, height: 140 }}>
                                <DonutChart
                                    segments={[
                                        { value: moderationData.resolved, color: '#4ADE80' },
                                        { value: moderationData.reviewing, color: '#FBBF24' },
                                        { value: moderationData.pending, color: '#FF6366' },
                                    ]}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-heading-medium text-text-primary leading-none">{moderationTotal}</span>
                                    <span className="text-body-extra-small text-text-secondary">Total</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-sm w-full mt-md">
                                {[
                                    { label: 'Resolved', value: moderationData.resolved, color: 'bg-state-success' },
                                    { label: 'Reviewing', value: moderationData.reviewing, color: 'bg-state-warning' },
                                    { label: 'Pending', value: moderationData.pending, color: 'bg-state-error' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-sm">
                                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                            <span className="text-body-small text-text-secondary">{item.label}</span>
                                        </div>
                                        <span className="text-body-small-bold text-text-primary">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Business Engagement */}
                    <Card variant="container" className="flex-1">
                        <div className="flex items-center justify-between mb-xs">
                            <div>
                                <h3 className="text-body-large-bold text-text-primary">Business Engagement</h3>
                                <p className="text-body-extra-small text-text-secondary mt-xs">
                                    Boost purchases by University zone
                                </p>
                            </div>
                            <button className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none">
                                •••
                            </button>
                        </div>

                        <div className="flex flex-col gap-md mt-md">
                            {engagementData.map((item) => (
                                <div key={item.label} className="flex flex-col gap-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-body-small text-text-secondary">{item.label}</span>
                                        <span className="text-body-small-bold" style={{ color: item.color }}>
                                            {item.value} Active
                                        </span>
                                    </div>
                                    <ProgressBar value={item.value} max={100} color={item.color} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
