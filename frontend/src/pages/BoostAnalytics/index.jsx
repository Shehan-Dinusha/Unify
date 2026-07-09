import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { getCurrentUser } from '../../services/authService';
import { getCampaignById, getCampaignAnalytics, getCampaignInteractions } from '../../services/boostService';
import {
  Eye, MousePointerClick, DollarSign, ShoppingBag, Pencil,
  TrendingUp, TrendingDown, AlertTriangle,
} from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import ConversionFunnel from './ConversionFunnel';
import InteractionsTable from './InteractionsTable';

const defaultAnalytics = {
  totalReach: '0', reachChange: '—', reachChangeLabel: 'No data yet',
  clicks: '0', ctr: '0%', clicksChange: '—', clicksChangeLabel: 'No data yet',
  adSpend: 'Rs 0', adSpendChange: '—', adSpendChangeLabel: '—',
  salesAttributed: 'Rs. 0', roi: '0x',
  performanceData: { labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'], boostedReach: [0, 0, 0, 0], organicReach: [0, 0, 0, 0] },
  conversionFunnel: { impressions: 0, clicks: 0, clicksRate: '0%', purchases: 0, purchasesRate: '0%' },
};

const BoostAnalytics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeRange, setTimeRange] = useState('7');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [campaignRes, analyticsRes, interactionsRes] = await Promise.allSettled([
          getCampaignById(id), getCampaignAnalytics(id), getCampaignInteractions(id),
        ]);
        if (campaignRes.status === 'fulfilled' && campaignRes.value?.data) {
          setCampaign(campaignRes.value.data);
        } else {
          setError('Campaign not found. Please check the campaign ID.');
        }
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) {
          setAnalytics({ ...defaultAnalytics, ...analyticsRes.value.data });
        }
        if (interactionsRes.status === 'fulfilled' && interactionsRes.value?.data) {
          setInteractions(Array.isArray(interactionsRes.value.data) ? interactionsRes.value.data : []);
        }
      } catch (err) {
        setError('Failed to load analytics. Please check the backend.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const filteredInteractions = searchQuery.trim()
    ? interactions.filter(
      (i) =>
        (i.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.content || '').toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : interactions;

  const stats = [
    { icon: Eye, iconBg: 'bg-primary-blue/15', iconColor: 'text-primary-blue', label: 'Total Reach', value: analytics.totalReach, change: analytics.reachChange, changeColor: 'text-state-success', changeLabel: analytics.reachChangeLabel, trendUp: true },
    { icon: MousePointerClick, iconBg: 'bg-state-success/15', iconColor: 'text-state-success', label: 'Clicks (CTR)', value: analytics.clicks, subValue: analytics.ctr, change: analytics.clicksChange, changeColor: 'text-state-error', changeLabel: analytics.clicksChangeLabel, trendUp: false },
    { icon: DollarSign, iconBg: 'bg-state-warning/15', iconColor: 'text-state-warning', label: 'Ad Spend', value: analytics.adSpend, change: analytics.adSpendChange, changeColor: 'text-state-success', changeLabel: analytics.adSpendChangeLabel, trendUp: false },
    { icon: ShoppingBag, iconBg: 'bg-primary-accent/15', iconColor: 'text-primary-accent', label: 'Sales Attributed', value: analytics.salesAttributed, subValue: null, change: null, changeColor: '', changeLabel: `ROI: ${analytics.roi}`, trendUp: true },
  ];

  if (loading) {
    return (
      <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Boost Analytics" verificationCount={0}>
        <div className="flex items-center justify-center h-64 text-text-secondary text-body-small">Loading analytics...</div>
      </MainLayout>
    );
  }

  if (error || !campaign) {
    return (
      <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Boost Analytics" verificationCount={0}>
        <Card variant="container" className="border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Failed to Load Analytics</p>
              <p className="text-body-small text-text-secondary">{error || 'Campaign not found.'}</p>
            </div>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Boost Analytics" verificationCount={0}>
      <div className="flex flex-col gap-lg">
        <Card variant="card" padding="p-lg">
          <div className="flex flex-col sm:flex-row items-start gap-lg">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
              <img
                src={campaign.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.name || 'Campaign')}&background=2666F1&color=fff&size=96`}
                alt={campaign.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-sm mb-sm">
                <span className="text-[10px] font-bold bg-state-success/15 text-state-success px-2.5 py-0.5 rounded-full">{campaign.status || 'Active'}</span>
                <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1">⏱ Posted {campaign.postedDate || campaign.createdAt || '—'}</span>
              </div>
              <h2 className="text-body-large-bold md:text-heading-small text-text-primary font-inter mb-1">{campaign.postTitle || campaign.name || 'Boost Campaign'}</h2>
              <p className="text-body-small text-text-secondary font-inter leading-relaxed max-w-2xl">{campaign.description || 'No description available.'}</p>
            </div>
            <button className="h-10 px-md rounded-2xl border border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 flex-shrink-0">
              <Pencil size={14} />
              Edit Post
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <Card key={i} variant="container" padding="p-md">
                <div className="flex flex-col gap-sm h-full">
                  <div className="flex items-center justify-between">
                    <p className="text-body-extra-small text-text-secondary font-inter">{stat.label}</p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                      <IconComp size={16} className={stat.iconColor} />
                    </div>
                  </div>
                  <div className="flex items-end gap-xs">
                    <span className="text-base md:text-heading-small text-text-primary font-inter font-bold whitespace-nowrap">{stat.value}</span>
                    {stat.subValue && <span className="text-body-small text-text-secondary font-inter pb-0.5">{stat.subValue}</span>}
                  </div>
                  <div className="flex items-center gap-xs">
                    {stat.change && (
                      <span className={`text-body-extra-small-bold font-inter flex items-center gap-0.5 ${stat.changeColor}`}>
                        {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {stat.change}
                      </span>
                    )}
                    <span className="text-body-extra-small text-text-secondary font-inter">{stat.changeLabel}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
          <div className="lg:col-span-3">
            <Card variant="card" padding="p-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
                <div>
                  <h3 className="text-body-large-bold text-text-primary font-inter">Performance Over Time</h3>
                  <div className="flex items-center gap-md mt-xs">
                    <span className="flex items-center gap-xs text-body-extra-small text-text-secondary font-inter">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-blue inline-block" /> Boosted Reach
                    </span>
                    <span className="flex items-center gap-xs text-body-extra-small text-text-secondary font-inter">
                      <span className="w-2.5 h-2.5 rounded-full bg-state-success inline-block" /> Organic Reach
                    </span>
                  </div>
                </div>
                <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10">
                  <button onClick={() => setTimeRange('7')} className={`px-md py-xs rounded-lg text-body-small-bold font-inter transition-all duration-200 ${timeRange === '7' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>7 Days</button>
                  <button onClick={() => setTimeRange('30')} className={`px-md py-xs rounded-lg text-body-small-bold font-inter transition-all duration-200 ${timeRange === '30' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>30 Days</button>
                </div>
              </div>
              <PerformanceChart performanceData={analytics.performanceData} />
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card variant="card" padding="p-lg" className="h-full">
              <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Conversion Funnel</h3>
              <ConversionFunnel funnel={analytics.conversionFunnel} />
            </Card>
          </div>
        </div>

        <InteractionsTable
          interactions={filteredInteractions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </MainLayout>
  );
};

export default BoostAnalytics;
