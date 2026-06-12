import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { getCurrentUser } from '../../services/authService';
import { useRevenueOverview } from './useRevenueOverview';
import RevenueStatsCards from './RevenueStatsCards';
import RevenueTrajectory from './RevenueTrajectory';
import RevenueBreakdown from './RevenueBreakdown';

const RevenueOverview = () => {
    const user = getCurrentUser() || { name: 'Admin', role: 'Admin' };
    const {
        loading, error, statsTiles,
        months, actualRevenue, projectedRevenue, MAX_REV, yAxisLabels, TOOLTIP_IDX,
        breakdownSegments, breakdownCenterLabel,
    } = useRevenueOverview();

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Revenue Overview" verificationCount={0}>
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
            <MainLayout user={user} pageTitle="Revenue Overview" verificationCount={0}>
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-md text-center">
                        <span className="text-3xl">{'\u26A0\uFE0F'}</span>
                        <p className="text-body-large-bold text-text-primary">Failed to load revenue data</p>
                        <p className="text-body-small text-text-secondary">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-lg py-sm bg-primary-blue text-text-primary rounded-xl text-body-small-bold hover:bg-primary-blue/80 transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout user={user} pageTitle="Revenue Overview" verificationCount={0}>
            <RevenueStatsCards tiles={statsTiles} />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-md">
                <RevenueTrajectory
                    months={months}
                    actualRevenue={actualRevenue}
                    projectedRevenue={projectedRevenue}
                    MAX_REV={MAX_REV}
                    yAxisLabels={yAxisLabels}
                    TOOLTIP_IDX={TOOLTIP_IDX}
                />
                <RevenueBreakdown segments={breakdownSegments} centerLabel={breakdownCenterLabel} />
            </div>
        </MainLayout>
    );
};

export default RevenueOverview;
