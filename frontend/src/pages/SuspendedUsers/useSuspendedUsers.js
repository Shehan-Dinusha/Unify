import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { getCurrentUser } from "../../services/authService";
import { getDashboardStatistics, getAllSuspendedUsers } from "../../services/suspensionService";

export const reasonOptions = [
  { value: "all", label: "Reason : All" },
  { value: "ToS Violation", label: "ToS Violation" },
  { value: "Payment Failure", label: "Payment Failure" },
  { value: "Suspicious Activity", label: "Suspicious Activity" },
  { value: "Harassment", label: "Harassment" },
];

export const dateOptions = [
  { value: "all", label: "Date : All Time" },
  { value: "7", label: "Date : Last 7 Days" },
  { value: "30", label: "Date : Last 30 Days" },
  { value: "90", label: "Date : Last 90 Days" },
];

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const useSuspendedUsers = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const fetchIdRef = useRef(0);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getDashboardStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      toast.error("Failed to load statistics", err.message);
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  const fetchUsers = useCallback(async (currentPage, currentSearch, currentReason, currentDate) => {
    const fetchId = ++fetchIdRef.current;
    setUsersLoading(true);
    setError(null);
    try {
      const response = await getAllSuspendedUsers({
        search: currentSearch || undefined,
        reason: currentReason,
        dateRange: currentDate,
        status: "ACTIVE",
        page: currentPage,
        limit,
      });
      if (fetchId !== fetchIdRef.current) return;
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || null);
        if (response.data.statistics && !stats) {
          setStats({
            suspendedAccounts: { count: response.data.statistics.suspendedAccountsCount, badge: "Active", change: response.data.statistics.suspendedAccountsChange },
            highSeverityCases: { count: response.data.statistics.highSeverityCasesCount, badge: "Critical", change: response.data.statistics.highSeverityCasesChange },
            reactivatedThisMonth: { count: response.data.statistics.reactivatedThisMonthCount, badge: "Restored", change: response.data.statistics.reactivatedThisMonthChange },
          });
        }
      }
    } catch (err) {
      if (fetchId !== fetchIdRef.current) return;
      setError(err.message);
      toast.error("Failed to load suspended users", err.message);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setUsersLoading(false);
      }
    }
  }, [limit, stats, toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers(page, searchQuery, reasonFilter, dateFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, reasonFilter, dateFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, searchQuery, reasonFilter, dateFilter);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setReasonFilter("all");
    setDateFilter("all");
    setPage(1);
  };

  const buildStatCards = () => {
    if (!stats) return [];
    const changePrefix = (val) => {
      if (!val) return "";
      return val.startsWith("+") || val.startsWith("-") ? `↗${val.replace(/[+-]/, "")}` : `↗${val}`;
    };
    return [
      {
        label: "Suspended Accounts",
        value: stats.suspendedAccounts?.count ?? 0,
        badge: "Active",
        badgeClass: "bg-state-error/20 text-state-error",
        change: changePrefix(stats.suspendedAccounts?.change),
        changeClass: "text-state-error",
        cardBg: "bg-gradient-to-br from-state-error/10 to-transparent",
      },
      {
        label: "High Severity Cases",
        value: stats.highSeverityCases?.count ?? 0,
        badge: "Critical",
        badgeClass: "bg-state-warning/20 text-state-warning",
        change: changePrefix(stats.highSeverityCases?.change),
        changeClass: "text-state-warning",
        cardBg: "bg-gradient-to-br from-state-warning/10 to-transparent",
      },
      {
        label: "Reactivated This Month",
        value: stats.reactivatedThisMonth?.count ?? 0,
        badge: "Restored",
        badgeClass: "bg-state-success/20 text-state-success",
        change: changePrefix(stats.reactivatedThisMonth?.change),
        changeClass: "text-state-success",
        cardBg: "bg-gradient-to-br from-state-success/10 to-transparent",
      },
    ];
  };

  const statCards = buildStatCards();

  return {
    navigate,
    user: getCurrentUser() || { name: "Admin", role: "Admin" },
    statsLoading,
    statCards,
    searchQuery, setSearchQuery,
    reasonFilter, setReasonFilter,
    dateFilter, setDateFilter,
    page, setPage,
    usersLoading, error,
    users, pagination,
    handleResetFilters,
    fetchUsers,
  };
};
