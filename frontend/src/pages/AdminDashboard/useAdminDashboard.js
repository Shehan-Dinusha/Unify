import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  getDashboardStats,
  getPlatformGrowth,
  getContentModeration,
  getBusinessEngagement,
} from "../../services/adminDashboardService";

const fmtK = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v);
const fmtNum = (v) => v.toLocaleString();
const fmtRs = (v) => `Rs. ${v.toLocaleString()}`;

const rangeApiMap = {
  "This Month": "month",
  "Last 30 Days": "30days",
  Yearly: "yearly",
};

const formatFnMap = {
  number: { formatValue: fmtNum, formatStat: fmtNum },
  currency: { formatValue: fmtK, formatStat: fmtRs },
};

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || { name: "Admin", role: "Admin" };
  const [activeRange, setActiveRange] = useState("This Month");
  const [chartIdx, setChartIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [moderationData, setModerationData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [statsRes, moderationRes, engagementRes] = await Promise.all([
          getDashboardStats(),
          getContentModeration(),
          getBusinessEngagement(),
        ]);
        setStats(statsRes.data);
        setModerationData(moderationRes.data);
        setEngagementData(engagementRes.data?.engagement || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        const res = await getPlatformGrowth(rangeApiMap[activeRange]);
        setChartData(res.data);
      } catch (err) {
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, [activeRange]);

  const moderationTotal = moderationData
    ? moderationData.resolved + moderationData.reviewing + moderationData.pending
    : 0;

  const chartSlides = chartData?.slides?.map((slide) => ({
    ...slide,
    formatValue: formatFnMap[slide.formatType]?.formatValue || fmtNum,
    formatStat: formatFnMap[slide.formatType]?.formatStat || fmtNum,
  })) || [];

  const xLabels = chartData?.labels || [];
  const slideCount = chartSlides.length || 1;
  const realIdx = chartIdx % slideCount;

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (isHovered) return;
    autoPlayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setChartIdx((prev) => prev + 1);
    }, 5000);
  }, [isHovered]);

  useEffect(() => {
    resetAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, [resetAutoPlay]);

  const handleTransitionEnd = useCallback(() => {
    if (chartIdx >= slideCount) {
      setIsTransitioning(false);
      setChartIdx(0);
    }
  }, [chartIdx, slideCount]);

  const goTo = (idx) => {
    setIsTransitioning(true);
    setChartIdx(idx);
    resetAutoPlay();
  };

  const goPrev = () => goTo((realIdx - 1 + slideCount) % slideCount);

  const goNext = () => {
    setIsTransitioning(true);
    setChartIdx((prev) => prev + 1);
    resetAutoPlay();
  };

  const handleRangeChange = (range) => {
    setActiveRange(range);
    setIsTransitioning(false);
    setChartIdx(0);
    resetAutoPlay();
  };

  const statsTiles = stats
    ? [
        {
          iconSrc: "/icon_verified_clubs.svg",
          iconAlt: "Students",
          iconBgClass: "bg-primary-blue/20",
          title: "Total Student Users",
          value: stats.totalStudentUsersFormatted,
          subValue: stats.studentTrend,
          subValueClass: "text-state-success",
          path: "/student-management",
        },
        {
          iconSrc: "/icon_boost_controller.svg",
          iconAlt: "Revenue",
          iconBgClass: "bg-state-warning/20",
          title: "Business Boost Revenue",
          value: stats.businessBoostRevenueFormatted,
          subValue: stats.boostTrend,
          subValueClass: "text-state-success",
          path: "/revenue-overview",
        },
        {
          iconSrc: "/icon_dashboard.svg",
          iconAlt: "Businesses",
          iconBgClass: "bg-primary-accent/20",
          title: "Active Businesses",
          value: stats.activeBusinessesFormatted,
          subValue: stats.bizTrend,
          subValueClass: "text-state-success",
          path: "/active-businesses",
        },
      ]
    : [];

  const rangeOptions = ["This Month", "Last 30 Days", "Yearly"];

  return {
    user,
    loading, error,
    statsTiles,
    navigate,
    chartLoading, chartSlides, realIdx, xLabels, slideCount, chartIdx, isTransitioning, isHovered,
    setIsHovered,
    moderationData, moderationTotal,
    engagementData,
    rangeOptions, activeRange,
    goPrev, goNext, goTo, handleRangeChange,
    handleTransitionEnd,
  };
};
