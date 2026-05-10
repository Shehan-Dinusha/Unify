import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import StatsCard from "../components/common/StatsCard";
import { BarChart, DonutChart, ProgressBar } from "../components/chart";
import { mockRequests } from "../data/mockData";
import {
  getDashboardStats,
  getPlatformGrowth,
  getContentModeration,
  getBusinessEngagement,
} from "../services/adminDashboardService";

// ─── Constants ──────────────────────────────────────────────────────────────

const fmtK = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v);
const fmtNum = (v) => v.toLocaleString();
const fmtRs = (v) => `Rs. ${v.toLocaleString()}`;

// Range key → API param mapping
const rangeApiMap = {
  "This Month": "month",
  "Last 30 Days": "30days",
  Yearly: "yearly",
};

// Build format functions based on backend formatType
const formatFnMap = {
  number: { formatValue: fmtNum, formatStat: fmtNum },
  currency: { formatValue: fmtK, formatStat: fmtRs },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState("This Month");
  const [chartIdx, setChartIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  // ─── API State ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [moderationData, setModerationData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch dashboard stats, moderation, engagement (once) ───────────
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
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // ─── Fetch chart data whenever range changes ────────────────────────
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        const res = await getPlatformGrowth(rangeApiMap[activeRange]);
        setChartData(res.data);
      } catch (err) {
        console.error("Chart fetch error:", err);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, [activeRange]);

  // ─── Derived values ──────────────────────────────────────────────────
  const moderationTotal = moderationData
    ? moderationData.resolved + moderationData.reviewing + moderationData.pending
    : 0;

  // Build chart slides from API data, attaching JS format functions
  const chartSlides = chartData?.slides?.map((slide) => ({
    ...slide,
    formatValue: formatFnMap[slide.formatType]?.formatValue || fmtNum,
    formatStat: formatFnMap[slide.formatType]?.formatStat || fmtNum,
  })) || [];

  const xLabels = chartData?.labels || [];
  const slideCount = chartSlides.length || 1;
  const realIdx = chartIdx % slideCount;

  // ─── Auto-play carousel ─────────────────────────────────────────────
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

  // ─── Stats tiles (from API) ─────────────────────────────────────────
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

  // ─── Loading / Error States ─────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout
        user={{ name: "Alex Johnson", role: "admin" }}
        pageTitle="Admin Dashboard"
        verificationCount={mockRequests.length}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-md">
            <div className="w-10 h-10 border-3 border-primary-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-body-small text-text-secondary">Loading dashboard data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout
        user={{ name: "Alex Johnson", role: "admin" }}
        pageTitle="Admin Dashboard"
        verificationCount={mockRequests.length}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-md text-center">
            <span className="text-3xl">⚠️</span>
            <p className="text-body-large-bold text-text-primary">Failed to load dashboard</p>
            <p className="text-body-small text-text-secondary">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-lg py-sm bg-primary-blue text-text-primary rounded-xl text-body-small-bold hover:bg-primary-blue/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={{ name: "Alex Johnson", role: "admin" }}
      pageTitle="Admin Dashboard"
      verificationCount={mockRequests.length}
    >
      {/* ── Top Stats Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        {statsTiles.map((tile, i) => (
          <div
            key={i}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => navigate(tile.path)}
          >
            <StatsCard
              iconSrc={tile.iconSrc}
              iconAlt={tile.iconAlt}
              iconBgClass={tile.iconBgClass}
              title={tile.title}
              value={tile.value}
              subValue={tile.subValue}
              subValueClass={tile.subValueClass}
            />
          </div>
        ))}
      </div>

      {/* ── Platform Insights Header ──────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md mb-md">
        <div className="flex items-center gap-sm">
          <span className="text-xl">✨</span>
          <div>
            <h2 className="text-heading-small text-text-primary">
              Platform Insights Summary
            </h2>
            <p className="text-body-small text-text-secondary">
              Real-time data visualization for Sri Lankan university ecosystem.
            </p>
          </div>
        </div>

        {/* Range Toggle */}
        <div className="flex bg-white/5 p-xs rounded-2xl border border-white/10">
          {rangeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => handleRangeChange(opt)}
              className={`px-lg py-sm rounded-xl text-body-small-bold font-inter transition-all ${
                activeRange === opt
                  ? "bg-primary-blue text-text-primary shadow-custom"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* ── Left: Chart Carousel (2 cols) ────── */}
        <div
          className="col-span-1 md:col-span-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card variant="container">
            {chartLoading || chartSlides.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Header with arrows */}
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-sm">
                    {/* Left arrow */}
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <div>
                      <h3 className="text-body-large-bold text-text-primary">
                        {chartSlides[realIdx].title}
                      </h3>
                      <p className="text-body-extra-small text-text-secondary mt-xs">
                        {chartSlides[realIdx].description}
                      </p>
                    </div>
                    {/* Right arrow */}
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-md shrink-0 ml-md">
                    {/* Legend */}
                    <div className="flex items-center gap-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                      <span className="text-body-extra-small text-text-secondary">
                        {chartSlides[realIdx].legend}
                      </span>
                    </div>
                    {/* Dot indicators */}
                    <div className="flex items-center gap-xs">
                      {chartSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === realIdx
                              ? "bg-primary-blue scale-125"
                              : "bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sliding chart body — infinite forward loop */}
                <div className="overflow-hidden">
                  <div
                    className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
                    style={{ transform: `translateX(-${chartIdx * 100}%)` }}
                    onTransitionEnd={handleTransitionEnd}
                  >
                    {/* Real slides + ghost clone of first slide at end */}
                    {[...chartSlides, chartSlides[0]].map((slide, i) => (
                      <div key={i} className="w-full shrink-0">
                        <BarChart
                          data={slide.data}
                          maxVal={slide.maxVal}
                          peakIdx={slide.peakIdx}
                          labels={xLabels}
                          yLabels={slide.yLabels}
                          yVals={slide.yVals}
                          formatValue={slide.formatValue}
                          formatStat={slide.formatStat}
                          statLabel={slide.statLabel}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* ── Right Column ───────────────────────────────── */}
        <div className="flex flex-col gap-md">
          {/* Content Moderation */}
          <Card variant="container" className="flex-1">
            <h3 className="text-body-large-bold text-text-primary mb-md">
              Content Moderation
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative" style={{ width: 140, height: 140 }}>
                <DonutChart
                  segments={[
                    { value: moderationData?.resolved || 0, color: "#4ADE80" },
                    { value: moderationData?.reviewing || 0, color: "#FBBF24" },
                    { value: moderationData?.pending || 0, color: "#FF6366" },
                  ]}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-heading-medium text-text-primary leading-none">
                    {moderationTotal}
                  </span>
                  <span className="text-body-extra-small text-text-secondary">
                    Total
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-sm w-full mt-md">
                {[
                  {
                    label: "Resolved",
                    value: moderationData?.resolved || 0,
                    color: "bg-state-success",
                  },
                  {
                    label: "Reviewing",
                    value: moderationData?.reviewing || 0,
                    color: "bg-state-warning",
                  },
                  {
                    label: "Pending",
                    value: moderationData?.pending || 0,
                    color: "bg-state-error",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-sm">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                      />
                      <span className="text-body-small text-text-secondary">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-body-small-bold text-text-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Business Engagement */}
          <Card variant="container" className="flex-1">
            <div className="flex items-center justify-between mb-xs">
              <div>
                <h3 className="text-body-large-bold text-text-primary">
                  Business Engagement
                </h3>
                <p className="text-body-extra-small text-text-secondary mt-xs">
                  Boost purchases by University zone
                </p>
              </div>
              <button className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none">
                •••
              </button>
            </div>

            <div className="flex flex-col gap-md mt-md">
              {(engagementData || []).map((item) => (
                <div key={item.label} className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-text-secondary">
                      {item.label}
                    </span>
                    <span
                      className="text-body-small-bold"
                      style={{ color: item.color }}
                    >
                      {item.value} Active
                    </span>
                  </div>
                  <ProgressBar
                    value={item.value}
                    max={Math.max(...(engagementData || []).map((e) => e.value), 100)}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
