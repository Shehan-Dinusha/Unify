import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useAdminDashboard } from "./useAdminDashboard";
import StatsTileGrid from "./StatsTileGrid";
import ChartCarousel from "./ChartCarousel";
import ContentModerationCard from "./ContentModerationCard";
import BusinessEngagementCard from "./BusinessEngagementCard";

const AdminDashboard = () => {
  const {
    user, loading, error,
    statsTiles, navigate,
    chartLoading, chartSlides, realIdx, xLabels, slideCount, chartIdx, isTransitioning, isHovered,
    setIsHovered,
    moderationData, moderationTotal,
    engagementData,
    rangeOptions, activeRange,
    goPrev, goNext, goTo, handleRangeChange,
    handleTransitionEnd,
  } = useAdminDashboard();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Admin Dashboard" verificationCount={0}>
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
      <MainLayout user={user} pageTitle="Admin Dashboard" verificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-md text-center">
            <span className="text-3xl">{String.fromCodePoint(0x26A0, 0xFE0F)}</span>
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
    <MainLayout user={user} pageTitle="Admin Dashboard" verificationCount={0}>
      <StatsTileGrid tiles={statsTiles} onNavigate={navigate} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md mb-md">
        <div className="flex items-center gap-sm">
          <span className="text-xl">{String.fromCodePoint(0x2728)}</span>
          <div>
            <h2 className="text-heading-small text-text-primary">Platform Insights Summary</h2>
            <p className="text-body-small text-text-secondary">
              Real-time data visualization for Sri Lankan university ecosystem.
            </p>
          </div>
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <ChartCarousel
          chartLoading={chartLoading}
          chartSlides={chartSlides}
          realIdx={realIdx}
          xLabels={xLabels}
          slideCount={slideCount}
          chartIdx={chartIdx}
          isTransitioning={isTransitioning}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          goPrev={goPrev}
          goNext={goNext}
          goTo={goTo}
          handleTransitionEnd={handleTransitionEnd}
        />

        <div className="flex flex-col gap-md">
          <ContentModerationCard moderationData={moderationData} moderationTotal={moderationTotal} />
          <BusinessEngagementCard engagementData={engagementData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
