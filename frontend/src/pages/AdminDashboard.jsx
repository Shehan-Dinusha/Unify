import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import StatsCard from '../components/common/StatsCard';
import { mockRequests } from '../data/mockData';

// ─── Constants ──────────────────────────────────────────────────────────────

// ─── Carousel Chart Data (per range) ─────────────────────────────────────────

const fmtK = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v;
const fmtNum = (v) => v.toLocaleString();
const fmtRs = (v) => `Rs. ${v.toLocaleString()}`;

const chartDataByRange = {
    'This Month': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        slides: [
            {
                title: 'Platform Growth',
                description: 'Weekly new user registrations this month',
                legend: 'Registrations',
                data: [320, 410, 385, 305],
                maxVal: 500,
                peakIdx: 1,
                yLabels: ['500', '400', '300', '200', '0'],
                yVals: [500, 400, 300, 200, 0],
                statLabel: 'Total Users',
                formatValue: fmtNum, formatStat: fmtNum,
            },
            {
                title: 'Revenue Growth',
                description: 'Weekly platform revenue this month',
                legend: 'Weekly Revenue',
                data: [2800, 3400, 3100, 3600],
                maxVal: 4500,
                peakIdx: 3,
                yLabels: ['4.5K', '3K', '1.5K', '0'],
                yVals: [4500, 3000, 1500, 0],
                statLabel: 'Total Revenue',
                formatValue: fmtK, formatStat: fmtRs,
            },
            {
                title: 'Business Growth',
                description: 'Weekly new business registrations this month',
                legend: 'New Businesses',
                data: [12, 18, 15, 21],
                maxVal: 30,
                peakIdx: 3,
                yLabels: ['30', '20', '10', '0'],
                yVals: [30, 20, 10, 0],
                statLabel: 'Total Businesses',
                formatValue: fmtNum, formatStat: fmtNum,
            },
        ],
    },
    'Last 30 Days': {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        slides: [
            {
                title: 'Platform Growth',
                description: 'Weekly new user registrations over the last 30 days',
                legend: 'Registrations',
                data: [280, 350, 420, 390, 310],
                maxVal: 500,
                peakIdx: 2,
                yLabels: ['500', '400', '300', '200', '0'],
                yVals: [500, 400, 300, 200, 0],
                statLabel: 'Total Users',
                formatValue: fmtNum, formatStat: fmtNum,
            },
            {
                title: 'Revenue Growth',
                description: 'Weekly platform revenue over the last 30 days',
                legend: 'Weekly Revenue',
                data: [2500, 3100, 3800, 3200, 2900],
                maxVal: 4500,
                peakIdx: 2,
                yLabels: ['4.5K', '3K', '1.5K', '0'],
                yVals: [4500, 3000, 1500, 0],
                statLabel: 'Total Revenue',
                formatValue: fmtK, formatStat: fmtRs,
            },
            {
                title: 'Business Growth',
                description: 'Weekly new business registrations over the last 30 days',
                legend: 'New Businesses',
                data: [10, 14, 22, 17, 13],
                maxVal: 30,
                peakIdx: 2,
                yLabels: ['30', '20', '10', '0'],
                yVals: [30, 20, 10, 0],
                statLabel: 'Total Businesses',
                formatValue: fmtNum, formatStat: fmtNum,
            },
        ],
    },
    'Yearly': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        slides: [
            {
                title: 'Platform Growth',
                description: 'Monthly new user registrations across the platform',
                legend: 'Total Registrations',
                data: [365, 1010, 495, 340, 425, 515, 930, 1130, 1420, 845, 500, 380],
                maxVal: 1600,
                peakIdx: 8,
                yLabels: ['1.6K', '1.2K', '800', '400', '0'],
                yVals: [1600, 1200, 800, 400, 0],
                statLabel: 'Total Users',
                formatValue: fmtK, formatStat: fmtNum,
            },
            {
                title: 'Revenue Growth',
                description: 'Monthly platform revenue for the fiscal year',
                legend: 'Monthly Revenue',
                data: [2100, 3200, 4800, 5500, 7200, 8800, 9500, 9400, 10500, 11800, 12500, 12800],
                maxVal: 15000,
                peakIdx: 11,
                yLabels: ['15K', '12K', '9K', '6K', '3K', '0'],
                yVals: [15000, 12000, 9000, 6000, 3000, 0],
                statLabel: 'Total Revenue',
                formatValue: fmtK, formatStat: fmtRs,
            },
            {
                title: 'Business Growth',
                description: 'Monthly new business registrations on the platform',
                legend: 'New Businesses',
                data: [45, 120, 85, 60, 75, 95, 150, 180, 220, 165, 110, 70],
                maxVal: 260,
                peakIdx: 8,
                yLabels: ['260', '200', '140', '80', '0'],
                yVals: [260, 200, 140, 80, 0],
                statLabel: 'Total Businesses',
                formatValue: fmtNum, formatStat: fmtNum,
            },
        ],
    },
};

const moderationData = { resolved: 115, reviewing: 30, pending: 12 };
const engagementData = [
    { label: 'Food & Cafe', value: 85, color: '#2B8CEE' },
    { label: 'Boarding', value: 62, color: '#FF6366' },
    { label: 'Self Employed', value: 45, color: '#4ADE80' },
    { label: 'Clubs & Society', value: 28, color: '#9CA3AF' },
];

// ─── Premium Bar Chart ───────────────────────────────────────────────────────

const RegistrationChart = ({ data, maxVal, peakIdx, labels, yLabels, yVals, formatValue, formatStat, statLabel }) => {
    const W = 600;
    const H = 280;
    const padT = 28;
    const padB = 0;

    const n = data.length;
    const slotW = W / n;
    const barW = slotW * 0.55;

    const toY = (v) => padT + (1 - v / maxVal) * (H - padT - padB);
    const toX = (i) => i * slotW + slotW / 2;

    // Stats
    const total = data.reduce((a, b) => a + b, 0);
    const avg = total / n;
    const peak = data[peakIdx];

    return (
        <div>
            <div className="flex gap-sm items-stretch">
                {/* Y-axis */}
                <div className="flex flex-col justify-between text-body-extra-small text-text-secondary text-right shrink-0 pb-6" style={{ height: H }}>
                    {yLabels.map((l) => (
                        <span key={l}>{l}</span>
                    ))}
                </div>

                {/* Chart + X-axis */}
                <div className="flex-1 min-w-0">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full" style={{ height: H }}>
                        <defs>
                            {/* Normal bar gradient — cool blue */}
                            <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#1a5276" />
                                <stop offset="100%" stopColor="#2B8CEE" />
                            </linearGradient>
                            {/* Peak bar gradient — bright accent */}
                            <linearGradient id="peakGrad" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#2B8CEE" />
                                <stop offset="100%" stopColor="#60B8FF" />
                            </linearGradient>
                            {/* Peak glow */}
                            <filter id="peakGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Grid lines */}
                        {yVals.map((v) => (
                            <line key={v} x1={0} y1={toY(v)} x2={W} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        ))}

                        {/* Bars + value labels */}
                        {data.map((v, i) => {
                            const barH = (v / maxVal) * (H - padT - padB);
                            const bX = toX(i) - barW / 2;
                            const bY = H - padB - barH;
                            const isPeak = i === peakIdx;

                            return (
                                <g key={i}>
                                    {/* Bar */}
                                    <rect
                                        x={bX} y={bY}
                                        width={barW} height={barH}
                                        rx="5" ry="5"
                                        fill={isPeak ? 'url(#peakGrad)' : 'url(#barGrad)'}
                                        filter={isPeak ? 'url(#peakGlow)' : undefined}
                                        opacity={isPeak ? 1 : 0.85}
                                    />
                                    {/* Value label above bar */}
                                    <text
                                        x={toX(i)}
                                        y={bY - 6}
                                        textAnchor="middle"
                                        fill={isPeak ? '#60B8FF' : 'rgba(255,255,255,0.5)'}
                                        fontSize={isPeak ? '11' : '9'}
                                        fontWeight={isPeak ? '700' : '500'}
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
                                <span className={`text-body-extra-small ${i === peakIdx ? 'text-primary-blue font-bold' : 'text-text-secondary'}`}>
                                    {m}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary stats row */}
            <div className="flex items-center gap-lg mt-md pt-md border-t border-white/5">
                <div className="flex items-center gap-xs">
                    <span className="text-body-extra-small text-text-secondary">{statLabel}:</span>
                    <span className="text-body-small-bold text-text-primary">{formatStat(total)}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-xs">
                    <span className="text-body-extra-small text-text-secondary">Monthly Avg:</span>
                    <span className="text-body-small-bold text-text-primary">{formatStat(Math.round(avg))}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-xs">
                    <span className="text-body-extra-small text-text-secondary">Peak ({labels[peakIdx]}):</span>
                    <span className="text-body-small-bold text-primary-blue">{formatStat(peak)}</span>
                </div>
            </div>
        </div>
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
    const [chartIdx, setChartIdx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const autoPlayRef = useRef(null);
    const moderationTotal = moderationData.resolved + moderationData.reviewing + moderationData.pending;

    // Derive slides and labels from active range
    const { slides: chartSlides, labels: xLabels } = chartDataByRange[activeRange];
    const slideCount = chartSlides.length;
    const realIdx = chartIdx % slideCount;

    // Auto-play: advance chart every 5 seconds
    const resetAutoPlay = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        if (isHovered) return; // Don't start interval if hovering

        autoPlayRef.current = setInterval(() => {
            setIsTransitioning(true);
            setChartIdx((prev) => prev + 1);
        }, 5000);
    }, [isHovered]);

    useEffect(() => {
        resetAutoPlay();
        return () => clearInterval(autoPlayRef.current);
    }, [resetAutoPlay]);

    // When we land on the ghost slide (index === slideCount), snap back to 0 instantly
    const handleTransitionEnd = useCallback(() => {
        if (chartIdx >= slideCount) {
            setIsTransitioning(false);
            setChartIdx(0);
        }
    }, [chartIdx, slideCount]);

    const goTo = (idx) => {
        setIsTransitioning(true);
        setChartIdx(idx);
        resetAutoPlay();
    };
    const goPrev = () => goTo((realIdx - 1 + slideCount) % slideCount);
    const goNext = () => {
        setIsTransitioning(true);
        setChartIdx((prev) => prev + 1);
        resetAutoPlay();
    };
    const handleRangeChange = (range) => {
        setActiveRange(range);
        setIsTransitioning(false);
        setChartIdx(0);
        resetAutoPlay();
    };

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
                            onClick={() => handleRangeChange(opt)}
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

                {/* ── Left: Chart Carousel (2 cols) ────── */}
                <div
                    className="col-span-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Card variant="container">
                        {/* Header with arrows */}
                        <div className="flex items-start justify-between mb-md">
                            <div className="flex items-center gap-sm">
                                {/* Left arrow */}
                                <button
                                    onClick={goPrev}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <div>
                                    <h3 className="text-body-large-bold text-text-primary">{chartSlides[realIdx].title}</h3>
                                    <p className="text-body-extra-small text-text-secondary mt-xs">
                                        {chartSlides[realIdx].description}
                                    </p>
                                </div>
                                {/* Right arrow */}
                                <button
                                    onClick={goNext}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-md shrink-0 ml-md">
                                {/* Legend */}
                                <div className="flex items-center gap-xs">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                                    <span className="text-body-extra-small text-text-secondary">{chartSlides[realIdx].legend}</span>
                                </div>
                                {/* Dot indicators */}
                                <div className="flex items-center gap-xs">
                                    {chartSlides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${i === realIdx ? 'bg-primary-blue scale-125' : 'bg-white/20 hover:bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sliding chart body — infinite forward loop */}
                        <div className="overflow-hidden">
                            <div
                                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                style={{ transform: `translateX(-${chartIdx * 100}%)` }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {/* Real slides + ghost clone of first slide at end */}
                                {[...chartSlides, chartSlides[0]].map((slide, i) => (
                                    <div key={i} className="w-full shrink-0">
                                        <RegistrationChart
                                            data={slide.data}
                                            maxVal={slide.maxVal}
                                            peakIdx={slide.peakIdx}
                                            labels={xLabels}
                                            yLabels={slide.yLabels}
                                            yVals={slide.yVals}
                                            formatValue={slide.formatValue}
                                            formatStat={slide.formatStat}
                                            statLabel={slide.statLabel}
                                        />
                                    </div>
                                ))}
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
