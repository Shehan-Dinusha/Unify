import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { getCurrentUser } from '../services/authService';
import { getCampaignById, getCampaignAnalytics, getCampaignInteractions } from '../services/boostService';
import {
  Eye,
  MousePointerClick,
  DollarSign,
  ShoppingBag,
  Pencil,
  Search,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

// ── Default fallback data (used only when API returns no data yet) ──────────
const defaultAnalytics = {
  totalReach: '0',
  reachChange: '—',
  reachChangeLabel: 'No data yet',
  clicks: '0',
  ctr: '0%',
  clicksChange: '—',
  clicksChangeLabel: 'No data yet',
  adSpend: 'Rs 0',
  adSpendChange: '—',
  adSpendChangeLabel: '—',
  salesAttributed: 'Rs. 0',
  roi: '0x',
  performanceData: {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
    boostedReach: [0, 0, 0, 0],
    organicReach: [0, 0, 0, 0],
  },
  conversionFunnel: {
    impressions: 0,
    clicks: 0,
    clicksRate: '0%',
    purchases: 0,
    purchasesRate: '0%',
  },
};

const BoostAnalytics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeRange, setTimeRange] = useState('7');
  const [searchQuery, setSearchQuery] = useState('');

  // ── API State ───────────────────────────────────────────────────────────
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(defaultAnalytics);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch campaign, analytics, and interactions from backend ────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [campaignRes, analyticsRes, interactionsRes] = await Promise.allSettled([
          getCampaignById(id),
          getCampaignAnalytics(id),
          getCampaignInteractions(id),
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
        console.error('[BoostAnalytics] Failed to load:', err);
        setError('Failed to load analytics. Please check the backend.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  // Filter interactions
  const filteredInteractions = searchQuery.trim()
    ? interactions.filter(
      (i) =>
        (i.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    : interactions;

  // SVG Performance Chart
  const renderPerformanceChart = () => {
    const { labels, boostedReach, organicReach } = analytics.performanceData;
    if (!labels || labels.length === 0) {
      return <p className="text-body-small text-text-secondary font-inter text-center py-xl">No performance data available yet.</p>;
    }
    const maxVal = Math.max(...boostedReach, ...organicReach, 1);
    const width = 600;
    const height = 200;
    const padX = 50;
    const padY = 20;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const toX = (i) => padX + (i / (labels.length - 1)) * chartW;
    const toY = (v) => padY + chartH - (v / maxVal) * chartH;

    const boostedPath = boostedReach
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`)
      .join(' ');
    const organicPath = organicReach
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`)
      .join(' ');

    // Area fill for boosted
    const boostedAreaPath = `${boostedPath} L${toX(labels.length - 1)},${padY + chartH} L${toX(0)},${padY + chartH} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="boostedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B8CEE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2B8CEE" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <line
            key={i}
            x1={padX}
            y1={padY + chartH * (1 - f)}
            x2={width - padX}
            y2={padY + chartH * (1 - f)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Boosted area fill */}
        <path d={boostedAreaPath} fill="url(#boostedGradient)" />

        {/* Organic line */}
        <path
          d={organicPath}
          fill="none"
          stroke="#4ADE80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Boosted line */}
        <path
          d={boostedPath}
          fill="none"
          stroke="#2B8CEE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points for boosted */}
        {boostedReach.map((v, i) => (
          <circle key={`b${i}`} cx={toX(i)} cy={toY(v)} r="3.5" fill="#2B8CEE" stroke="#0D1A26" strokeWidth="2" />
        ))}

        {/* Data points for organic */}
        {organicReach.map((v, i) => (
          <circle key={`o${i}`} cx={toX(i)} cy={toY(v)} r="3" fill="#4ADE80" stroke="#0D1A26" strokeWidth="2" />
        ))}

        {/* X-axis labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={toX(i)}
            y={height + 15}
            textAnchor="middle"
            className="fill-text-secondary"
            fontSize="11"
            fontFamily="Inter"
          >
            {label}
          </text>
        ))}
      </svg>
    );
  };

  // Conversion Funnel
  const renderConversionFunnel = () => {
    const { impressions, clicks, clicksRate, purchases, purchasesRate } = analytics.conversionFunnel;
    const maxBar = impressions || 1;

    const items = [
      { label: 'Impressions', value: (impressions || 0).toLocaleString(), rate: null, width: 100, color: 'bg-white/10' },
      { label: 'Clicks', value: (clicks || 0).toLocaleString(), rate: clicksRate, width: (clicks / maxBar) * 100, color: 'bg-primary-blue' },
      { label: 'Purchase', value: (purchases || 0).toLocaleString(), rate: purchasesRate, width: (purchases / maxBar) * 100 + 15, color: 'bg-state-warning' },
    ];

    return (
      <div className="flex flex-col gap-lg">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-xs">
              <span className="text-body-small text-text-secondary font-inter">{item.label}</span>
              <div className="flex items-center gap-xs">
                <span className="text-body-small-bold text-text-primary font-inter">{item.value}</span>
                {item.rate && (
                  <span className="text-body-extra-small-bold text-state-success font-inter">{item.rate}</span>
                )}
              </div>
            </div>
            <div className="w-full h-8 bg-white/5 rounded-lg overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-center`}
                style={{ width: `${item.width}%` }}
              >
                {idx === items.length - 1 && (
                  <CheckCircle2 size={14} className="text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Stats cards data
  const stats = [
    {
      icon: Eye,
      iconBg: 'bg-primary-blue/15',
      iconColor: 'text-primary-blue',
      label: 'Total Reach',
      value: analytics.totalReach,
      change: analytics.reachChange,
      changeColor: 'text-state-success',
      changeLabel: analytics.reachChangeLabel,
      trendUp: true,
    },
    {
      icon: MousePointerClick,
      iconBg: 'bg-state-success/15',
      iconColor: 'text-state-success',
      label: 'Clicks (CTR)',
      value: analytics.clicks,
      subValue: analytics.ctr,
      change: analytics.clicksChange,
      changeColor: 'text-state-error',
      changeLabel: analytics.clicksChangeLabel,
      trendUp: false,
    },
    {
      icon: DollarSign,
      iconBg: 'bg-state-warning/15',
      iconColor: 'text-state-warning',
      label: 'Ad Spend',
      value: analytics.adSpend,
      change: analytics.adSpendChange,
      changeColor: 'text-state-success',
      changeLabel: analytics.adSpendChangeLabel,
      trendUp: false,
    },
    {
      icon: ShoppingBag,
      iconBg: 'bg-primary-accent/15',
      iconColor: 'text-primary-accent',
      label: 'Sales Attributed',
      value: analytics.salesAttributed,
      subValue: null,
      change: null,
      changeColor: '',
      changeLabel: `ROI: ${analytics.roi}`,
      trendUp: true,
    },
  ];

  // ── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Boost Analytics" verificationCount={0}>
        <div className="flex items-center justify-center h-64 text-text-secondary text-body-small">
          Loading analytics...
        </div>
      </MainLayout>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
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
    <MainLayout
      user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
      pageTitle="Boost Analytics"
      verificationCount={0}
    >
      <div className="flex flex-col gap-lg">
        {/* Campaign Info Card */}
        <Card variant="card" padding="p-lg">
          <div className="flex flex-col sm:flex-row items-start gap-lg">
            {/* Campaign Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
              <img
                src={campaign.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(campaign.name || 'Campaign')}&background=2666F1&color=fff&size=96`}
                alt={campaign.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Campaign Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-sm mb-sm">
                <span className="text-[10px] font-bold bg-state-success/15 text-state-success px-2.5 py-0.5 rounded-full">
                  {campaign.status || 'Active'}
                </span>
                <span className="text-body-extra-small text-text-secondary font-inter flex items-center gap-1">
                  ⏱ Posted {campaign.postedDate || campaign.createdAt || '—'}
                </span>
              </div>
              <h2 className="text-body-large-bold md:text-heading-small text-text-primary font-inter mb-1">
                {campaign.postTitle || campaign.name || 'Boost Campaign'}
              </h2>
              <p className="text-body-small text-text-secondary font-inter leading-relaxed max-w-2xl">
                {campaign.description || 'No description available.'}
              </p>
            </div>

            {/* Edit Button */}
            <button
              className="h-10 px-md rounded-2xl border border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center gap-2 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 flex-shrink-0"
            >
              <Pencil size={14} />
              Edit Post
            </button>
          </div>
        </Card>

        {/* Stats Row */}
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
                    <span className="text-base md:text-heading-small text-text-primary font-inter font-bold whitespace-nowrap">
                      {stat.value}
                    </span>
                    {stat.subValue && (
                      <span className="text-body-small text-text-secondary font-inter pb-0.5">
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-xs">
                    {stat.change && (
                      <span className={`text-body-extra-small-bold font-inter flex items-center gap-0.5 ${stat.changeColor}`}>
                        {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {stat.change}
                      </span>
                    )}
                    <span className="text-body-extra-small text-text-secondary font-inter">
                      {stat.changeLabel}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
          {/* Performance Over Time — takes 3 cols */}
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
                  <button
                    onClick={() => setTimeRange('7')}
                    className={`px-md py-xs rounded-lg text-body-small-bold font-inter transition-all duration-200 ${timeRange === '7'
                      ? 'bg-white/10 text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                      }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('30')}
                    className={`px-md py-xs rounded-lg text-body-small-bold font-inter transition-all duration-200 ${timeRange === '30'
                      ? 'bg-white/10 text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                      }`}
                  >
                    30 Days
                  </button>
                </div>
              </div>
              {renderPerformanceChart()}
            </Card>
          </div>

          {/* Conversion Funnel — takes 2 cols */}
          <div className="lg:col-span-2">
            <Card variant="card" padding="p-lg" className="h-full">
              <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Conversion Funnel</h3>
              {renderConversionFunnel()}
            </Card>
          </div>
        </div>

        {/* Top Interactions Table */}
        <Card variant="card" padding="p-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
            <h3 className="text-body-large-bold text-text-primary font-inter">Top Interactions</h3>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search Comment or Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-tertiary outline-none font-inter focus:border-primary-blue/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-md px-md py-sm border-b border-white/10 mb-sm">
            <span className="col-span-3 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">
              User
            </span>
            <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">
              Action
            </span>
            <span className="col-span-3 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">
              Content
            </span>
            <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">
              Date
            </span>
            <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider text-right">
              Impact
            </span>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {filteredInteractions.map((interaction) => (
              <div
                key={interaction.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md items-center px-md py-md border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg"
              >
                {/* User */}
                <div className="md:col-span-3 flex items-center gap-sm">
                  <img
                    src={interaction.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(interaction.user || 'U')}&background=2666F1&color=fff`}
                    alt={interaction.user}
                    className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0"
                  />
                  <span className="text-body-small-bold text-text-primary font-inter">{interaction.user}</span>
                </div>

                {/* Action */}
                <div className="md:col-span-2">
                  <span
                    className={`inline-block text-body-extra-small-bold font-inter px-2.5 py-0.5 rounded-full ${interaction.actionColor || 'bg-white/10 text-text-secondary'}`}
                  >
                    {interaction.action}
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                  <span className="text-body-small text-text-secondary font-inter">{interaction.content}</span>
                </div>

                {/* Date */}
                <div className="md:col-span-2">
                  <span className="text-body-extra-small text-text-secondary font-inter">{interaction.date}</span>
                </div>

                {/* Impact */}
                <div className="md:col-span-2 text-right">
                  <span className={`text-body-small-bold font-inter ${interaction.impactColor || 'text-text-secondary'}`}>
                    {interaction.impact}
                  </span>
                </div>
              </div>
            ))}

            {filteredInteractions.length === 0 && (
              <div className="text-center py-xl">
                <p className="text-body-small text-text-secondary font-inter">No interactions found.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BoostAnalytics;
