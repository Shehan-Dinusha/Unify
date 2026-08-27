import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import { Search, AlertTriangle } from "lucide-react";
import { useActiveBusinesses } from "./useActiveBusinesses";
import BusinessStatsRow from "./BusinessStatsRow";
import BusinessFilterBar from "./BusinessFilterBar";
import BusinessTable from "./BusinessTable";
import PaginationBar from "./PaginationBar";
import MobileBusinessCard from "./MobileBusinessCard";
import MobilePagination from "./MobilePagination";

const ActiveBusinesses = () => {
  const {
    user, navigate,
    stats,
    searchQuery, setSearchQuery,
    activeFilter, setActiveFilter,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    businesses, loading, error,
    currentPage, setCurrentPage,
    totalPages, totalCount,
    startItem, endItem,
    handleResetFilters,
  } = useActiveBusinesses();

  return (
    <MainLayout user={user} pageTitle="Active Businesses">
      <BusinessStatsRow stats={stats} />

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

      <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
        <div>
          <h2 className="text-heading-small text-text-primary">Business Directory</h2>
          <p className="text-body-small text-text-secondary mt-xs">
            Monitor and manage platform-affiliated businesses.
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            placeholder="Search by business, email or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="!gap-0"
          />
        </div>
      </div>

      <BusinessFilterBar
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      <BusinessTable
        businesses={businesses}
        loading={loading}
        error={error}
        onViewProfile={(id) => navigate(`/active-businesses/${id}`)}
      />

      {!loading && !error && totalCount > 0 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          startItem={startItem}
          endItem={endItem}
          onPageChange={setCurrentPage}
        />
      )}

      <div className="grid grid-cols-1 gap-md md:hidden">
        {!loading && !error && businesses.map((biz) => (
          <MobileBusinessCard key={biz.id} biz={biz} onViewProfile={(id) => navigate(`/active-businesses/${id}`)} />
        ))}
      </div>

      {!loading && !error && totalCount > 0 && (
        <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </MainLayout>
  );
};

export default ActiveBusinesses;
