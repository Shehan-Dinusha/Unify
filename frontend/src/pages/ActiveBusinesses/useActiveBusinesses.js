import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { getBusinessDirectory, getBusinessStats } from "../../services/businessService";
import { getCurrentUser } from "../../services/authService";

const businessStatsDefault = [
  { title: "Verified Businesses", value: "—", change: "Loading...", changeClass: "text-text-secondary", icon: "✅", iconBg: "bg-state-success/20" },
  { title: "Pending Approvals", value: "—", change: "⏳ Loading...", changeClass: "text-state-warning", icon: "📋", iconBg: "bg-state-error/20" },
  { title: "Avg. Subscription", value: "—", change: "Loading...", changeClass: "text-text-secondary", icon: "💰", iconBg: "bg-state-success/20" },
  { title: "Retention Rate", value: "—", change: "Loading...", changeClass: "text-text-secondary", icon: "📈", iconBg: "bg-primary-blue/20" },
];

export const useActiveBusinesses = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const PAGE_LIMIT = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Businesses");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(businessStatsDefault);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getBusinessStats();
        const d = result.data || {};
        setStats([
          { value: String(d.verifiedBusinesses ?? 0), title: "Verified Businesses", change: d.verifiedTrend || "0% this month", changeClass: "text-state-success", icon: "✅", iconBg: "bg-gradient-to-br from-primary-blue/10 to-transparent" },
          { value: String(d.pendingApprovals ?? 0), title: "Awaiting Review", change: "⏳ Awaiting Review", changeClass: "text-state-warning", icon: "⏳", iconBg: "bg-gradient-to-br from-state-warning/10 to-transparent" },
          { value: d.avgSubscription || "Rs. 0", title: "Avg. Subscription", change: d.avgSubscriptionTrend || "Stable", changeClass: "text-state-success", icon: "💰", iconBg: "bg-gradient-to-br from-state-success/10 to-transparent" },
          { value: d.retentionRate || "N/A", title: "Retention Rate", change: `💎 ${d.retentionLabel || "N/A"}`, changeClass: "text-primary-accent", icon: "📈", iconBg: "bg-gradient-to-br from-primary-accent/10 to-transparent" },
        ]);
      } catch (err) {
        toast.error("Connection Error", "Failed to load business stats.");
      }
    };
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBusinessDirectory({
          search: searchQuery,
          status: statusFilter,
          category: categoryFilter,
          page: currentPage,
          limit: PAGE_LIMIT,
        });
        const data = result.data || {};
        setBusinesses(data.businesses || []);
        setTotalCount(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / PAGE_LIMIT));
      } catch (err) {
        setError("Failed to connect to the server. Please check backend.");
        toast.error("Connection Error", "Failed to load business directory.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter("All Businesses");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(currentPage * PAGE_LIMIT, totalCount);

  return {
    user: getCurrentUser() || { name: "Admin", role: "Admin" },
    navigate,
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
    PAGE_LIMIT,
  };
};
