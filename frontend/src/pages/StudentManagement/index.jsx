import React from 'react';
import { AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../services/authService';
import { useStudentManagement } from './useStudentManagement';
import StudentStatsCards from './StudentStatsCards';
import StudentFilterBar from './StudentFilterBar';
import StudentTable from './StudentTable';
import StudentMobileCards from './StudentMobileCards';

const StudentManagement = () => {
  const {
    stats, students, loading, error,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    facultyFilter, setFacultyFilter,
    statusFilter, setStatusFilter,
    currentPage, setCurrentPage,
    totalPages, totalCount, PAGE_LIMIT,
    handleResetFilters,
  } = useStudentManagement();

  return (
    <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Student Management">
      <StudentStatsCards stats={stats} />

      <StudentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        facultyFilter={facultyFilter}
        onFacultyChange={setFacultyFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      {error && (
        <Card variant="container" className="mb-lg border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
              <p className="text-body-small text-text-secondary">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <StudentTable
        students={students}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageLimit={PAGE_LIMIT}
        onPageChange={setCurrentPage}
      />

      <StudentMobileCards
        students={students}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageLimit={PAGE_LIMIT}
        onPageChange={setCurrentPage}
      />
    </MainLayout>
  );
};

export default StudentManagement;
