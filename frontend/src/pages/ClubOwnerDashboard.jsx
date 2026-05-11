import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import ClubPostCard from "../components/club/ClubPostCard";
import { BarChart, DonutChart, ProgressBar } from "../components/chart";
import orderService from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/formatters";
import { getCurrentUser } from "../services/authService";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowUp,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";

/* ─── Sub-components ─────────────────────────────────────────── */

const StatCard = ({
  label,
  value,
  sub,
  subLabel,
  subPositive,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
}) => (
  <Card
    variant="card"
    className="bg-[#1A2F45]/60 border-white/5 !p-5 flex flex-col gap-3"
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {sub && (
        <span
          className={`flex items-center gap-1 text-xs font-bold ${subPositive ? "text-state-success" : "text-state-error"}`}
        >
          <ArrowUp className={`w-3 h-3 ${!subPositive && "rotate-180"}`} />
          {sub}
        </span>
      )}
      {badge && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
        >
          {badge}
        </span>
      )}
      {subLabel && (
        <span className="text-text-secondary text-xs">{subLabel}</span>
      )}
    </div>
  </Card>
);

/* ─── Main Page ──────────────────────────────────────────────── */
const ClubOwnerDashboard = () => {
  const navigate = useNavigate();
  const [chartFilter, setChartFilter] = useState("Month");

  // API Data States
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalOrdersTrend: 0,
    pendingActionCount: 0,
    completionRate: 0,
  });
  const [trends, setTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [clubPosts, setClubPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser() || {
    id: 0,
    name: "Guest",
    role: "club",
    displayRole: "Clubs & Societies Dashboard",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          statsRes,
          trendsRes,
          topProductsRes,
          demographicsRes,
          revenueRes,
          ordersRes,
          postsRes,
        ] = await Promise.allSettled([
          orderService.getClubOrderStats(user.id),
          orderService.getClubOrderTrends(
            user.id,
            chartFilter === "Month" ? 30 : 365,
          ),
          orderService.getClubTopProducts(user.id),
          orderService.getClubBuyerDemographics(user.id),
          orderService.getClubRevenueBreakdown(user.id),
          orderService.getClubOrders(user.id),
          orderService.getClubPosts(user.id),
        ]);

        const val = (res) => (res.status === "fulfilled" ? res.value : null);

        if (val(statsRes)?.success) setStats(val(statsRes).data);
        if (val(trendsRes)?.success) setTrends(val(trendsRes).data);
        if (val(topProductsRes)?.success)
          setTopProducts(val(topProductsRes).data);
        if (val(demographicsRes)?.success)
          setDemographics(val(demographicsRes).data);
        if (val(revenueRes)?.success) setRevenueBreakdown(val(revenueRes).data);
        if (val(ordersRes)?.success)
          setRecentOrders(val(ordersRes).orders.slice(0, 5));
        if (val(postsRes)?.success) {
          const normalized = val(postsRes).posts.map((p) => ({
            ...p,
            image: getImageUrl(
              p.postType === "club-event"
                ? p.coverImage
                : Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : "",
            ),
            clubName: p.name,
            clubSeed: p.name,
            text: p.description,
            time: new Date(p.createdAt).toLocaleDateString(),
            price: p.price ? `Rs.${parseFloat(p.price).toFixed(2)}` : null,
            stats: { likes: p.likesCount || 0 },
            comments: [],
          }));
          setClubPosts(normalized);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id, chartFilter]);

  const handleWalletClick = async () => {
    try {
      const res = await orderService.getStripeLoginLink();
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      }
    } catch (error) {
      if (error.error === "ONBOARDING_INCOMPLETE" || error.error?.includes("setup payments first")) {
        // If not setup, start onboarding
        const onboardRes = await orderService.onboardClub();
        if (onboardRes.url) window.location.href = onboardRes.url;
      } else {
        console.error("Failed to get wallet link:", error);
        alert(error.error || "Could not open wallet. Please try again later.");
      }
    }
  };

  const headerRight = (
    <button
      onClick={handleWalletClick}
      className="flex items-center gap-2 bg-primary-blue hover:bg-primary-blue/90 text-white px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(43,140,238,0.4)] shrink-0 whitespace-nowrap"
    >
      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      Wallet
    </button>
  );

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Club Order Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={user}
      pageTitle="Club Order Dashboard"
      headerRight={headerRight}
      verificationCount={0}
    >
      <div className="flex flex-col gap-8 pb-12">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            sub={`${stats.totalOrdersTrend > 0 ? "+" : ""}${stats.totalOrdersTrend}%`}
            subLabel="vs last week"
            subPositive={stats.totalOrdersTrend >= 0}
            icon={ShoppingBag}
            iconBg="bg-primary-blue/20"
            iconColor="text-primary-blue"
          />
          <StatCard
            label="Pending Fulfillment"
            value={stats.pendingOrders}
            badge={stats.pendingActionCount > 0 ? "Action Needed" : null}
            badgeColor="bg-state-warning/20 text-state-warning"
            subLabel={`${stats.pendingActionCount} items today`}
            icon={Clock}
            iconBg="bg-state-warning/20"
            iconColor="text-state-warning"
          />
          <StatCard
            label="Completed Orders"
            value={stats.completedOrders.toLocaleString()}
            sub={`${stats.completionRate}%`}
            subLabel="completion rate"
            subPositive={true}
            icon={CheckCircle2}
            iconBg="bg-state-success/20"
            iconColor="text-state-success"
          />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          {/* Order Trends Bar Chart */}
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Order Trends</h3>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                {["Month", "Year"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setChartFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartFilter === f ? "bg-primary-blue text-white" : "text-text-secondary hover:text-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const values = trends.map((t) => parseInt(t.count));
              const labels = trends.map((t, i) => {
                if (chartFilter === "Month") {
                  return (i + 1) % 5 === 0 ? t.date.split("-")[2] : "";
                }
                return i % 2 === 0 ? t.date.split("-")[1] : "";
              });
              const maxVal = Math.max(...values, 10) * 1.2;
              const todayIdx = trends.length - 1;

              const yVals = [100, 75, 50, 25, 0].map((v) => (v * maxVal) / 100);
              const yLabels = yVals.map((v) => Math.round(v).toString());

              return (
                <BarChart
                  data={values}
                  labels={labels}
                  maxVal={maxVal}
                  peakIdx={todayIdx}
                  yLabels={yLabels.reverse()}
                  yVals={[0, 25, 50, 75, 100].map((v) => (v * maxVal) / 100)}
                  statLabel="Orders"
                />
              );
            })()}
          </Card>

          {/* Top Products */}
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <h3 className="font-bold text-base mb-5">Top Products</h3>
            <div className="flex flex-col gap-4">
              {topProducts.length > 0 ? (
                topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={p.image || "https://via.placeholder.com/40"}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-primary-blue text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {p.title || "Unknown Product"}
                      </p>
                      <p className="text-text-secondary text-[11px]">
                        {p.salesCount} sold
                      </p>
                    </div>
                    <span className="text-primary-blue text-sm font-bold shrink-0">
                      Rs.{p.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-xs text-center py-4">
                  No sales yet
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ── Analytics Row ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
          {/* Revenue Breakdown */}
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base">Revenue Breakdown</h3>
              <span className="text-text-secondary text-xs">By Category</span>
            </div>
            <div className="flex justify-center mb-5">
              <DonutChart
                segments={revenueBreakdown.map((s, i) => ({
                  value: parseFloat(s.percentage),
                  color: ["#2B8CEE", "#60A5FA", "#FB923C", "#FACC15"][i % 4],
                }))}
                size={120}
                strokeWidth={16}
                centerLabel={revenueBreakdown
                  .reduce((acc, curr) => acc + curr.revenue, 0)
                  .toLocaleString()}
                centerSubLabel="TOTAL"
              />
            </div>
            <div className="flex flex-col gap-3">
              {revenueBreakdown.map((s, i) => (
                <div key={s.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: [
                            "#2B8CEE",
                            "#60A5FA",
                            "#FB923C",
                            "#FACC15",
                          ][i % 4],
                        }}
                      />
                      <span className="text-xs text-text-secondary">
                        {s.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold">{s.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${s.percentage}%`,
                        backgroundColor: [
                          "#2B8CEE",
                          "#60A5FA",
                          "#FB923C",
                          "#FACC15",
                        ][i % 4],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Buyer Demographics */}
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-blue/20 text-primary-blue rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Buyer Demographics</h3>
              </div>
              <span className="text-text-secondary text-xs">Top Faculties</span>
            </div>
            <div className="flex flex-col gap-4">
              {demographics.map((d, i) => {
                const colors = ["#2B8CEE", "#60A5FA", "#FB923C", "#FACC15"];
                return (
                  <div key={d.faculty} className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary text-xs">
                        {d.faculty}
                      </span>
                      <span className="font-bold text-xs">{d.percentage}%</span>
                    </div>
                    <ProgressBar
                      value={parseFloat(d.percentage)}
                      max={100}
                      color={colors[i % colors.length]}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Recent Orders ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Recent Orders</h3>
            <span className="text-primary-blue text-xs font-medium cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <Card
            variant="card"
            className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary text-[11px] uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Order</th>
                    <th className="text-left px-5 py-3 font-medium">Product</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, i) => {
                      const statusStyle =
                        order.status === "Order Completed" ||
                        order.status === "COMPLETED"
                          ? "bg-state-success/15 text-state-success"
                          : [
                                "Order Placed",
                                "Seller Confirmed",
                                "IN PROGRESS",
                              ].includes(order.status)
                            ? "bg-primary-blue/15 text-primary-blue"
                            : "bg-state-warning/15 text-state-warning";
                      return (
                        <tr
                          key={order.id}
                          className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === recentOrders.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-5 py-4 text-text-secondary font-mono text-xs">
                            {order.orderId}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  getImageUrl(order.clubProduct?.images?.[0]) ||
                                  "https://via.placeholder.com/32"
                                }
                                alt={order.clubProduct?.name || "Product"}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <span className="font-medium text-xs truncate max-w-[180px]">
                                {order.clubProduct?.name || "Product"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-text-secondary text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-primary-blue text-xs">
                            Rs.{parseFloat(order.total).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-8 text-center text-text-secondary text-xs"
                      >
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Your Posts ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Your Posts</h3>
            <span className="text-text-secondary text-xs">
              {clubPosts.filter((p) => p.isVisible).length} of{" "}
              {clubPosts.length} visible in feed
            </span>
          </div>
          {clubPosts.length === 0 ? (
            <p className="text-text-secondary text-xs text-center py-8">
              No posts yet
            </p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {clubPosts.map((post) => {
                const isInFeed = post.isVisible;
                return (
                  <div key={post.id} className="relative group">
                    <div
                      className={`transition-all duration-300 ${
                        isInFeed
                          ? "opacity-100"
                          : "opacity-40 grayscale-[30%] pointer-events-none"
                      }`}
                    >
                      <ClubPostCard
                        post={post}
                        isOwner={true}
                        hideActions={true}
                        onCardClick={() =>
                          navigate(
                            `/club-owner/product-orders/${post.postType}/${post.id}`,
                          )
                        }
                      />
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-3 px-3 py-2 bg-[#0B1220]/75 backdrop-blur-md rounded-full shadow-lg border border-white/10 transition-all hover:bg-[#0B1220]/90 pointer-events-auto">
                        <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                          {isInFeed ? (
                            <Eye className="w-4 h-4 text-state-success" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-white/50" />
                          )}
                          <span
                            className={`text-xs font-semibold ${isInFeed ? "text-white" : "text-white/60"}`}
                          >
                            {isInFeed ? "Live" : "Hidden"}
                          </span>
                        </div>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res =
                                await orderService.togglePostVisibility(
                                  post.postType,
                                  post.id,
                                );
                              if (res.success) {
                                setClubPosts((prev) =>
                                  prev.map((p) =>
                                    p.id === post.id &&
                                    p.postType === post.postType
                                      ? { ...p, isVisible: res.isVisible }
                                      : p,
                                  ),
                                );
                              }
                            } catch (err) {
                              console.error("Toggle failed:", err);
                            }
                          }}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${isInFeed ? "bg-state-success" : "bg-white/20"} focus:outline-none shrink-0`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${isInFeed ? "translate-x-[18px]" : "translate-x-0.5"}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClubOwnerDashboard;
