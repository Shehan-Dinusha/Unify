import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { LineChart, DonutChart } from '../components/chart';
import { mockRequests } from '../data/mockData';

// ─── Data ───────────────────────────────────────────────────────────────────

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const yAxisLabels = ['15M', '12M', '9M', '6M', '3M', '0'];
const actualRevenue = [2.1, 3.2, 4.8, 5.5, 7.2, 8.8, 9.5, 9.4, 10.5, 11.8, 12.5, 12.8];
const projectedRevenue = [2.0, 3.0, 4.2, 5.8, 7.5, 9.2, 10.5, 11.2, 12.0, 12.8, 13.5, 14.5];
const MAX_REV = 15;
const TOOLTIP_IDX = 7; // Aug

const breakdownSegments = [
    { label: 'Club Tickets', value: 55, color: '#2B8CEE' },
    { label: 'Biz Boosts', value: 25, color: '#6A3093' },
    { label: 'Merchandise', value: 15, color: '#FBBF24' },
    { label: 'Donations', value: 5, color: '#9CA3AF' },
];

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                {statsTiles.map((tile, i) => (
                    <Card
                        key={i}
                        variant="container"
                        className="hover:border-primary-blue/30 transition-colors h-auto md:h-44 md:relative"
                    >
                        {/* Desktop: absolute positioned (original) */}
                        <div className="hidden md:block">
                            <div className={`absolute top-lg left-lg w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                                <span className="text-lg">{tile.icon}</span>
                            </div>
                            <div className="absolute top-[72px] left-lg right-lg">
                                <p className="text-body-small-bold text-text-secondary truncate">{tile.title}</p>
                            </div>
                            <div className="absolute top-[94px] left-lg right-lg">
                                <p className="text-heading-medium text-text-primary">{tile.value}</p>
                                <p className={`text-body-extra-small mt-xs ${tile.changeClass} truncate`}>{tile.change}</p>
                            </div>
                        </div>
                        {/* Mobile: flex-based layout */}
                        <div className="flex flex-col gap-sm md:hidden">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                                <span className="text-lg">{tile.icon}</span>
                            </div>
                            <p className="text-body-small-bold text-text-secondary">{tile.title}</p>
                            <div>
                                <p className="text-lg font-bold text-text-primary whitespace-nowrap">{tile.value}</p>
                                <p className={`text-body-extra-small mt-xs ${tile.changeClass}`}>{tile.change}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Charts Row ────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-md">

                {/* Revenue Trajectory — 3 cols */}
                <div className="col-span-1 md:col-span-3">
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
                            {/* Y-axis labels */}
                            <div
                                className="flex flex-col justify-between text-body-extra-small text-text-secondary text-right shrink-0 pb-6"
                                style={{ height: 340 }}
                            >
                                {yAxisLabels.map((l) => (
                                    <span key={l}>{l}</span>
                                ))}
                            </div>

                            {/* Chart + X-axis */}
                            <div className="flex-1 min-w-0">
                                <LineChart
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
                <div className="col-span-1 md:col-span-2">
                    <Card variant="container" className="h-full">
                        <h3 className="text-body-large-bold text-text-primary">Revenue Breakdown</h3>
                        <p className="text-body-extra-small text-text-secondary mt-xs mb-lg">
                            Distribution by source category
                        </p>

                        <div className="flex flex-col items-center">
                            <DonutChart
                                segments={breakdownSegments}
                                size={160}
                                strokeWidth={22}
                                centerLabel="12.8K"
                                centerSubLabel="Total LKR"
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
