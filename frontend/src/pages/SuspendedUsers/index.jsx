import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useSuspendedUsers } from "./useSuspendedUsers";
import StatCardSkeleton from "./StatCardSkeleton";
import SuspendedFilterBar from "./SuspendedFilterBar";
import SuspendedTable from "./SuspendedTable";
import SuspendedPagination from "./SuspendedPagination";
import SuspendedMobileCard from "./SuspendedMobileCard";

const SuspendedUsers = () => {
  const {
    navigate,
    user,
    statsLoading, statCards,
    searchQuery, setSearchQuery,
    reasonFilter, setReasonFilter,
    dateFilter, setDateFilter,
    page, setPage,
    usersLoading, error,
    users, pagination,
    handleResetFilters,
    fetchUsers,
  } = useSuspendedUsers();

  return (
    <MainLayout user={user} pageTitle="Suspended Users" verificationCount={0}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        {statsLoading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : statCards.map((stat, i) => (
          <Card key={i} variant="container" className={`${stat.cardBg} h-auto`}>
            <div className="flex items-start justify-between mb-sm">
              <span className="text-body-small text-text-secondary font-inter">{stat.label}</span>
              <span className={`text-body-extra-small-bold px-sm py-xs rounded-lg ${stat.badgeClass}`}>{stat.badge}</span>
            </div>
            <div className="flex items-end gap-sm">
              <span className="text-heading-medium text-text-primary font-inter">{stat.value}</span>
              <span className={`text-body-small-bold font-inter ${stat.changeClass}`}>{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-lg">
        <h1 className="text-heading-medium md:text-heading-large text-text-primary font-inter font-bold">
          Suspended Users
        </h1>
        <p className="text-body-small text-text-secondary mt-xs max-w-2xl">
          Manage access for restricted accounts, review pending appeals, and reactivate users who have resolved their issues.
        </p>
      </div>

      <SuspendedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        reasonFilter={reasonFilter}
        onReasonChange={(v) => { setReasonFilter(v); setPage(1); }}
        dateFilter={dateFilter}
        onDateChange={(v) => { setDateFilter(v); setPage(1); }}
        onReset={handleResetFilters}
      />

      {error && !usersLoading && (
        <div className="mb-lg rounded-2xl border border-state-error/30 bg-state-error/10 backdrop-blur-sm px-lg py-md flex items-center gap-md">
          <AlertTriangle size={18} className="text-state-error shrink-0" />
          <div className="flex-1">
            <p className="text-body-small-bold text-state-error font-inter">Failed to load data</p>
            <p className="text-body-extra-small text-text-secondary font-inter">{error}</p>
          </div>
          <button
            onClick={() => fetchUsers(page, searchQuery, reasonFilter, dateFilter)}
            className="text-body-extra-small-bold text-primary-blue hover:text-primary-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <SuspendedTable
        users={users}
        usersLoading={usersLoading}
        error={error}
        onViewProfile={(id) => navigate(`/suspended-users/${id}`)}
      />

      <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
        {usersLoading && (
          <div className="flex items-center justify-center py-xl">
            <Loader2 size={24} className="text-primary-blue animate-spin" />
            <span className="ml-md text-body-small text-text-secondary">Loading...</span>
          </div>
        )}
        {!usersLoading && users.map((u) => (
          <SuspendedMobileCard key={u.id} user={u} onViewProfile={(id) => navigate(`/suspended-users/${id}`)} />
        ))}
      </div>

      <SuspendedPagination pagination={pagination} onPageChange={setPage} />
    </MainLayout>
  );
};

export default SuspendedUsers;
