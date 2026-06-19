import { useState, useEffect } from 'react';
import { getRevenueOverview, getRevenueTrajectory, getRevenueBreakdown } from '../../services/adminDashboardService';

export const useRevenueOverview = () => {
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

    const months = trajectory?.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const actualRevenue = trajectory?.actual || [];
    const projectedRevenue = trajectory?.projected || [];
    const MAX_REV = trajectory?.maxVal || 15;
    const yAxisLabels = trajectory?.yAxisLabels || ['15M', '12M', '9M', '6M', '3M', '0'];
    const TOOLTIP_IDX = actualRevenue.length > 0 ? actualRevenue.indexOf(Math.max(...actualRevenue)) : 7;
    const breakdownSegments = breakdown?.segments || [];
    const breakdownCenterLabel = breakdown?.totalRevenueFormatted || '0';

    const statsTiles = stats ? [
        { title: 'Total Revenue', subtitle: `Academic Year ${new Date().getFullYear()}`, value: stats.totalRevenueFormatted, change: stats.totalRevenueTrend, changeClass: stats.totalRevenueTrendClass, icon: '\uD83C\uDFDB', iconBg: 'bg-state-error/20' },
        { title: 'Biz Boosts', subtitle: 'From Campus Partners', value: stats.bizBoostsFormatted, change: stats.bizBoostsTrend, changeClass: stats.bizBoostsTrendClass, icon: '\uD83C\uDFE2', iconBg: 'bg-primary-blue/20' },
        { title: 'Avg. Spend', subtitle: 'Per Active Student', value: stats.avgSpendFormatted, change: stats.avgSpendTrend, changeClass: stats.avgSpendTrendClass, icon: '\uD83D\uDCB3', iconBg: 'bg-state-success/20' },
        { title: 'Projected Annual', subtitle: 'Based on Q1 & Q2 trends', value: stats.projectedAnnualFormatted, change: stats.projectedAnnualTrend, changeClass: stats.projectedAnnualTrendClass, icon: '\uD83D\uDCCA', iconBg: 'bg-primary-accent/20' },
    ] : [];

    return {
        loading, error, statsTiles,
        months, actualRevenue, projectedRevenue, MAX_REV, yAxisLabels, TOOLTIP_IDX,
        breakdownSegments, breakdownCenterLabel,
    };
};
