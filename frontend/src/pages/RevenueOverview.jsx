import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { LineChart, DonutChart } from '../components/chart';
import { getCurrentUser } from '../services/authService';
import {
  getRevenueOverview,
  getRevenueTrajectory,
  getRevenueBreakdown,
} from '../services/adminDashboardService';

// ─── Main Page ────────────────────────────────────────────────────────────────

const RevenueOverview = () => {
    const user = getCurrentUser() || { name: 'Admin', role: 'Admin' };
    // ─── API State ──────────────────────────────────────────────────────────
    const [stats, setStats] = useState(null);
    const [trajectory, setTrajectory] = useState(null);
    const [breakdown, setBreakdown] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, trajRes, breakdownRes] = await Promise.all([
                    getRevenueOverview(),
                    getRevenueTrajectory(),
                    getRevenueBreakdown(),
                ]);
                setStats(statsRes.data);
                setTrajectory(trajRes.data);
                setBreakdown(breakdownRes.data);
            } catch (err) {
                console.error('Revenue overview fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ─── Derived values ──────────────────────────────────────────────────
    const months = trajectory?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const actualRevenue = trajectory?.actual || [];
    const projectedRevenue = trajectory?.projected || [];
    const MAX_REV = trajectory?.maxVal || 15;
    const yAxisLabels = trajectory?.yAxisLabels || ['15M', '12M', '9M', '6M', '3M', '0'];

    // Find the peak month for tooltip
    const TOOLTIP_IDX = actualRevenue.length > 0
        ? actualRevenue.indexOf(Math.max(...actualRevenue))
        : 7;

    const breakdownSegments = breakdown?.segments || [];
    const breakdownCenterLabel = breakdown?.totalRevenueFormatted || '0';

    // ─── Stats tiles (from API) ──────────────────────────────────────────
    const statsTiles = stats ? [
        {
            title: 'Total Revenue',
            subtitle: `Academic Year ${new Date().getFullYear()}`,
            value: stats.totalRevenueFormatted,
            change: stats.totalRevenueTrend,
            changeClass: stats.totalRevenueTrendClass,
            icon: '🏛',
            iconBg: 'bg-state-error/20',
        },
        {
            title: 'Biz Boosts',
            subtitle: 'From Campus Partners',
            value: stats.bizBoostsFormatted,
            change: stats.bizBoostsTrend,
            changeClass: stats.bizBoostsTrendClass,
            icon: '🏢',
            iconBg: 'bg-primary-blue/20',
        },
        {
            title: 'Avg. Spend',
            subtitle: 'Per Active Student',
            value: stats.avgSpendFormatted,
            change: stats.avgSpendTrend,
            changeClass: stats.avgSpendTrendClass,
            icon: '💳',
            iconBg: 'bg-state-success/20',
        },
        {
            title: 'Projected Annual',
            subtitle: 'Based on Q1 & Q2 trends',
            value: stats.projectedAnnualFormatted,
            change: stats.projectedAnnualTrend,
            changeClass: stats.projectedAnnualTrendClass,
            icon: '📊',
            iconBg: 'bg-primary-accent/20',
        },
    ] : [];

    // ─── Loading / Error States ──────────────────────────────────────────
    if (loading) {
        return (
            <MainLayout
                user={user}
                pageTitle="Revenue Overview"
                verificationCount={0}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-md">
                        <div className="w-10 h-10 border-3 border-primary-blue border-t-transparent rounded-full animate-spin" />
                        <p className="text-body-small text-text-secondary">Loading revenue data...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout
                user={user}
                pageTitle="Revenue Overview"
                verificationCount={0}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-md text-center">
                        <span className="text-3xl">⚠️</span>
                        <p className="text-body-large-bold text-text-primary">Failed to load revenue data</p>
                        <p className="text-body-small text-text-secondary">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-lg py-sm bg-primary-blue text-text-primary rounded-xl text-body-small-bold hover:bg-primary-blue/80 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout
            user={user}
            pageTitle="Revenue Overview"
            verificationCount={0}
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
                                centerLabel={breakdownCenterLabel}
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
