import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../services/authService';
import { useReportModeration } from './useReportModeration';
import ReportStatsCards from './ReportStatsCards';
import ReportFilterBar from './ReportFilterBar';
import ReportTable from './ReportTable';
import ReportMobileCards from './ReportMobileCard';

const ReportModeration = () => {
    const {
        stats, reports, loading, error,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        typeOptions, statusOptions,
        viewDetails, handleResetFilters,
    } = useReportModeration();

    return (
        <MainLayout
            user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
            pageTitle="Report Moderation"
        >
            <div className="flex flex-col gap-lg">
                <ReportStatsCards stats={stats} />

                <div>
                    <h2 className="text-heading-small text-text-primary">Report Queue</h2>
                    <p className="text-body-small text-text-secondary mt-xs">Review and manage flagged content reports.</p>
                </div>

                <ReportFilterBar
                    filterType={filterType}
                    setFilterType={setFilterType}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    typeOptions={typeOptions}
                    statusOptions={statusOptions}
                    onReset={handleResetFilters}
                />

                {error && (
                    <Card variant="container" className="border-state-error/30 bg-state-error/5">
                        <div className="flex items-center gap-md">
                            <AlertTriangle size={24} className="text-state-error shrink-0" />
                            <div>
                                <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
                                <p className="text-body-small text-text-secondary">{error}</p>
                            </div>
                        </div>
                    </Card>
                )}

                <ReportTable
                    reports={reports}
                    loading={loading}
                    error={error}
                    onViewDetails={viewDetails}
                />

                <ReportMobileCards
                    reports={reports}
                    loading={loading}
                    error={error}
                    onViewDetails={viewDetails}
                />
            </div>
        </MainLayout>
    );
};

export default ReportModeration;
