import React from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useStudentSubmittedReports } from './useStudentSubmittedReports';
import ReportFilterBar from './ReportFilterBar';
import ReportTable from './ReportTable';
import ReportMobileCard from './ReportMobileCard';

const StudentSubmittedReports = () => {
  const {
    reports, loading, error, user,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    handleResetFilters, navigate,
  } = useStudentSubmittedReports();

  return (
    <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
      <ReportFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      <div className="mb-md flex justify-start">
        <Button onClick={() => navigate('/student/report-issue')} variant="gradient" size="medium" className="h-11 gap-2">
          <Plus size={18} /> Submit New Report
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40 text-text-secondary text-body-small">Loading your reports...</div>
      )}

      {error && !loading && (
        <Card variant="container" className="border-state-error/30 bg-state-error/5 mb-lg">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
              <p className="text-body-small text-text-secondary">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {!loading && !error && (
        <>
          <ReportTable reports={reports} loading={loading} error={error} onViewDetails={(id) => navigate(`/student/reports/${id}`)} />
          <ReportMobileCard reports={reports} loading={loading} error={error} onViewDetails={(id) => navigate(`/student/reports/${id}`)} />
        </>
      )}
    </MainLayout>
  );
};

export default StudentSubmittedReports;
