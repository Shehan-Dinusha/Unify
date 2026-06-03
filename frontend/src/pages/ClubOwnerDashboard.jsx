import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { BarChart, DonutChart, ProgressBar } from '../components/chart';
import orderService from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/formatters';
import { getCurrentUser } from '../services/authService';
import { Wallet, Users } from 'lucide-react';
import DashboardStats from './DashboardStats';
import RecentOrdersTable from './RecentOrdersTable';
import ClubPostVisibilityCard from './ClubPostVisibilityCard';

const ClubOwnerDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0, pendingOrders: 0, completedOrders: 0,
    totalOrdersTrend: 0, pendingActionCount: 0, completionRate: 0,
  });
  const [trends, setTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [clubPosts, setClubPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser() || {
    id: 0, name: 'Guest', role: 'club', displayRole: 'Clubs & Societies Dashboard',
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, trendsRes, topProductsRes, demographicsRes, revenueRes, ordersRes, postsRes] =
          await Promise.allSettled([
            orderService.getClubOrderStats(user.id),
            orderService.getClubOrderTrends(user.id, 30),
            orderService.getClubTopProducts(user.id),
            orderService.getClubBuyerDemographics(user.id),
            orderService.getClubRevenueBreakdown(user.id),
            orderService.getClubOrders(user.id),
            orderService.getClubPosts(user.id),
          ]);

        const val = (res) => (res.status === 'fulfilled' ? res.value : null);

        if (val(statsRes)?.success) setStats(val(statsRes).data);
        if (val(trendsRes)?.success) setTrends(val(trendsRes).data);
        if (val(topProductsRes)?.success) setTopProducts(val(topProductsRes).data);
        if (val(demographicsRes)?.success) setDemographics(val(demographicsRes).data);
        if (val(revenueRes)?.success) setRevenueBreakdown(val(revenueRes).data);
        if (val(ordersRes)?.success) setRecentOrders(val(ordersRes).orders.slice(0, 5));
        if (val(postsRes)?.success) {
          const normalized = val(postsRes).posts.map((p) => ({
            ...p,
            image: getImageUrl(
              p.postType === 'club-event' ? p.coverImage
                : Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
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
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const handleWalletClick = async () => {
    try {
      const res = await orderService.getStripeLoginLink();
      if (res.success && res.url) {
        window.open(res.url, '_blank');
      }
    } catch (error) {
      if (error.error === 'ONBOARDING_INCOMPLETE' || error.error?.includes('setup payments first')) {
        const onboardRes = await orderService.onboardClub();
        if (onboardRes.url) window.location.href = onboardRes.url;
      } else {
        console.error('Failed to get wallet link:', error);
        alert(error.error || 'Could not open wallet. Please try again later.');
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
    <MainLayout user={user} pageTitle="Club Order Dashboard" headerRight={headerRight} verificationCount={0}>
      <div className="flex flex-col gap-8 pb-12">
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base">Order Trends</h3>
              <span className="text-text-secondary text-xs">Last 30 days</span>
            </div>
            {(() => {
              const values = trends.map((t) => parseInt(t.count));
              const labels = trends.map((t, i) => (i + 1) % 5 === 0 ? t.date.split('-')[2] : '');
              const maxVal = Math.max(...values, 10) * 1.2;
              const todayIdx = trends.length - 1;
              const yVals = [0, 25, 50, 75, 100].map((v) => (v * maxVal) / 100);
              const yLabels = yVals.map((v) => Math.round(v).toString());
              return (
                <BarChart
                  data={values} labels={labels} maxVal={maxVal} peakIdx={todayIdx}
                  yLabels={yLabels.reverse()} yVals={yVals}
                  statLabel="Orders"
                />
              );
            })()}
          </Card>

          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <h3 className="font-bold text-base mb-5">Top Products</h3>
            <div className="flex flex-col gap-4">
              {topProducts.length > 0 ? (
                topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={p.image || 'https://via.placeholder.com/40'} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-primary-blue text-white text-[8px] font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.title || 'Unknown Product'}</p>
                      <p className="text-text-secondary text-[11px]">{p.salesCount} sold</p>
                    </div>
                    <span className="text-primary-blue text-sm font-bold shrink-0">Rs.{p.totalRevenue.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-xs text-center py-4">No sales yet</p>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
          <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base">Revenue Breakdown</h3>
              <span className="text-text-secondary text-xs">By Category</span>
            </div>
            <div className="flex justify-center mb-5">
              <DonutChart
                segments={revenueBreakdown.map((s, i) => ({
                  value: parseFloat(s.percentage),
                  color: ['#2B8CEE', '#60A5FA', '#FB923C', '#FACC15'][i % 4],
                }))}
                size={120} strokeWidth={16}
                centerLabel={revenueBreakdown.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                centerSubLabel="TOTAL"
              />
            </div>
            <div className="flex flex-col gap-3">
              {revenueBreakdown.map((s, i) => (
                <div key={s.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ['#2B8CEE', '#60A5FA', '#FB923C', '#FACC15'][i % 4] }} />
                      <span className="text-xs text-text-secondary">{s.category}</span>
                    </div>
                    <span className="text-xs font-bold">{s.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.percentage}%`, backgroundColor: ['#2B8CEE', '#60A5FA', '#FB923C', '#FACC15'][i % 4] }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

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
                const colors = ['#2B8CEE', '#60A5FA', '#FB923C', '#FACC15'];
                return (
                  <div key={d.faculty} className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary text-xs">{d.faculty}</span>
                      <span className="font-bold text-xs">{d.percentage}%</span>
                    </div>
                    <ProgressBar value={parseFloat(d.percentage)} max={100} color={colors[i % colors.length]} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <RecentOrdersTable recentOrders={recentOrders} navigate={navigate} />

        <ClubPostVisibilityCard
          clubPosts={clubPosts}
          setClubPosts={setClubPosts}
          navigate={navigate}
          orderService={orderService}
        />
      </div>
    </MainLayout>
  );
};

export default ClubOwnerDashboard;
