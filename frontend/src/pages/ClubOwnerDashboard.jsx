import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import ClubPostCard from "../components/club/ClubPostCard";
import { mockClubFeed } from "../data/mockClubData";
import { BarChart, DonutChart, ProgressBar } from "../components/chart";

import {
    dashboardStats,
    chartData,
    topProducts,
    revenueBreakdown,
    buyerDemographics,
    dashboardRecentOrders,
} from "../data/mockClubDashboard";
import { useNavigate } from "react-router-dom";
import {
    ShoppingBag, Clock, CheckCircle2,
    Wallet, ArrowUp, Users, Eye, EyeOff
} from "lucide-react";

/* ─── Sub-components ─────────────────────────────────────────── */


const StatCard = ({ label, value, sub, subLabel, subPositive, icon: Icon, iconBg, iconColor, badge, badgeColor }) => (
    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
                <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">{label}</span>
                <span className="text-3xl font-bold text-white">{value}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            {sub && (
                <span className={`flex items-center gap-1 text-xs font-bold ${subPositive ? "text-state-success" : "text-state-error"}`}>
                    <ArrowUp className={`w-3 h-3 ${!subPositive && "rotate-180"}`} />
                    {sub}
                </span>
            )}
            {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {badge}
                </span>
            )}
            {subLabel && <span className="text-text-secondary text-xs">{subLabel}</span>}
        </div>
    </Card>
);



/* ─── Main Page ──────────────────────────────────────────────── */
const ClubOwnerDashboard = () => {
    const navigate = useNavigate();
    const [chartFilter, setChartFilter] = useState("Month");
    // Feed visibility state: postId → true (in feed) | false (hidden)
    const [feedVisible, setFeedVisible] = useState(
        () => Object.fromEntries(mockClubFeed.map((p) => [p.id, true]))
    );
    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies Dashboard"
    };

    const { totalOrders, pendingOrders, completedOrders } = dashboardStats;

    const headerRight = (
        <button
            onClick={() => navigate("/club-owner/wallet")}
            className="flex items-center gap-2 bg-primary-blue hover:bg-primary-blue/90 text-white px-3 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(43,140,238,0.4)] shrink-0 whitespace-nowrap"
        >
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Wallet
        </button>
    );

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
                        value={totalOrders.toLocaleString()}
                        sub="+13.4%"
                        subLabel="vs last week"
                        subPositive={true}
                        icon={ShoppingBag}
                        iconBg="bg-primary-blue/20"
                        iconColor="text-primary-blue"
                    />
                    <StatCard
                        label="Pending Fulfillment"
                        value={pendingOrders}
                        badge="Action Needed"
                        badgeColor="bg-state-warning/20 text-state-warning"
                        subLabel="items today"
                        icon={Clock}
                        iconBg="bg-state-warning/20"
                        iconColor="text-state-warning"
                    />
                    <StatCard
                        label="Completed Orders"
                        value={completedOrders.toLocaleString()}
                        sub="96.7%"
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
                            const bars = chartData[chartFilter];
                            const isMonth = chartFilter === "Month";
                            const values = bars.map((b) => b.h);
                            const labels = isMonth
                                ? bars.map((b, i) => (i + 1) % 5 === 0 ? b.label : "")
                                : bars.map((b) => b.label);
                            const maxVal = 100;
                            // Highlight today's bar: day-of-month (0-indexed) for Month,
                            // current month index for Year
                            const today = new Date();
                            const todayIdx = isMonth
                                ? Math.min(today.getDate() - 1, bars.length - 1)
                                : today.getMonth();
                            const yLabels = ["100", "75", "50", "25", "0"];
                            const yVals = [100, 75, 50, 25, 0];
                            return (
                                <BarChart
                                    data={values}
                                    labels={labels}
                                    maxVal={maxVal}
                                    peakIdx={todayIdx}
                                    yLabels={yLabels}
                                    yVals={yVals}
                                    statLabel="Orders"
                                />
                            );
                        })()}
                    </Card>

                    {/* Top Products */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <h3 className="font-bold text-base mb-5">Top Products</h3>
                        <div className="flex flex-col gap-4">
                            {topProducts.map((p, i) => (
                                <div key={p.name} className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={p.img} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                                        <span className="absolute -top-1 -left-1 w-4 h-4 bg-primary-blue text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{p.name}</p>
                                        <p className="text-text-secondary text-[11px]">{p.sold}</p>
                                    </div>
                                    <span className="text-primary-blue text-sm font-bold shrink-0">{p.revenue}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Analytics Row ── */}
                <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
                    {/* Revenue Breakdown */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-base">Revenue Breakdown</h3>
                            <span className="text-text-secondary text-xs">Last 30 Days</span>
                        </div>
                        {/* Donut centered */}
                        <div className="flex justify-center mb-5">
                            <DonutChart
                                segments={revenueBreakdown.map((s) => ({ value: s.pct, color: s.color }))}
                                size={120}
                                strokeWidth={16}
                                centerLabel="9.1k"
                                centerSubLabel="TOTAL"
                            />
                        </div>
                        {/* Full-width legend — no truncation */}
                        <div className="flex flex-col gap-3">
                            {revenueBreakdown.map((s) => (
                                <div key={s.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                            <span className="text-xs text-text-secondary">{s.label}</span>
                                        </div>
                                        <span className="text-xs font-bold">{s.pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
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
                            {buyerDemographics.map((d) => {
                                // Map Tailwind color classes to hex for the ProgressBar component
                                const colorMap = {
                                    "bg-primary-blue": "#2B8CEE",
                                    "bg-blue-400": "#60A5FA",
                                    "bg-orange-400": "#FB923C",
                                    "bg-yellow-400": "#FACC15",
                                };
                                return (
                                    <div key={d.label} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary text-xs">{d.label}</span>
                                            <span className="font-bold text-xs">{d.pct}%</span>
                                        </div>
                                        <ProgressBar
                                            value={d.pct}
                                            max={100}
                                            color={colorMap[d.color] ?? "#2B8CEE"}
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
                        <span className="text-primary-blue text-xs font-medium cursor-pointer hover:underline">View all</span>
                    </div>
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden">
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
                                    {dashboardRecentOrders.map((order, i) => {
                                        const statusStyle =
                                            order.status === "COMPLETED"
                                                ? "bg-state-success/15 text-state-success"
                                                : order.status === "IN PROGRESS"
                                                    ? "bg-primary-blue/15 text-primary-blue"
                                                    : "bg-state-warning/15 text-state-warning";
                                        return (
                                            <tr key={order.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === dashboardRecentOrders.length - 1 ? "border-b-0" : ""}`}>
                                                <td className="px-5 py-4 text-text-secondary font-mono text-xs">{order.orderId}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={order.image} alt={order.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                                        <span className="font-medium text-xs truncate max-w-[180px]">{order.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-text-secondary text-xs">{order.orderDate}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right font-bold text-primary-blue text-xs">{order.total}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* ── Your Posts (feed cards with visibility toggle) ── */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-base">Your Posts</h3>
                        <span className="text-text-secondary text-xs">
                            {Object.values(feedVisible).filter(Boolean).length} of {mockClubFeed.length} visible in feed
                        </span>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {mockClubFeed.map((post) => {
                            const isInFeed = feedVisible[post.id];
                            return (
                                    <div key={post.id} className="relative group">
                                        {/* Post card — dimmed when hidden */}
                                        <div className={`transition-all duration-300 ${
                                            isInFeed ? "opacity-100" : "opacity-40 grayscale-[30%] pointer-events-none"
                                        }`}>
                                            <ClubPostCard 
                                                post={post} 
                                                isOwner={true} 
                                                hideActions={true}
                                                onCardClick={() => navigate(`/club-owner/product-orders/${post.id}`)}
                                            />
                                        </div>

                                        {/* Floating Toggle Banner */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="flex items-center gap-3 px-3 py-2 bg-[#0B1220]/75 backdrop-blur-md rounded-full shadow-lg border border-white/10 transition-all hover:bg-[#0B1220]/90 pointer-events-auto">
                                                <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                                                    {isInFeed ? (
                                                        <Eye className="w-4 h-4 text-state-success" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4 text-white/50" />
                                                    )}
                                                    <span className={`text-xs font-semibold ${isInFeed ? "text-white" : "text-white/60"}`}>
                                                        {isInFeed ? "Live" : "Hidden"}
                                                    </span>
                                                </div>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFeedVisible((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
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
                </div>
            </div>
        </MainLayout>
    );
};

export default ClubOwnerDashboard;
