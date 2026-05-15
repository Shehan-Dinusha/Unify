import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import { Search, RotateCcw, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '../components/common/Input';
import { useToast } from '../components/common/Toast';
import { getBusinessDirectory, getBusinessStats } from '../services/businessService';
import { getAvatarUrl } from '../utils/formatters';
import { getCurrentUser } from '../services/authService';

// ─── Stat Definitions ───────────────────────────────────────────────────────

const businessStats = [
    {
        title: 'Verified Businesses',
        value: '—',
        change: 'Loading...',
        changeClass: 'text-text-secondary',
        icon: '✅',
        iconBg: 'bg-state-success/20',
    },
    {
        title: 'Pending Approvals',
        value: '—',
        change: '⏳ Loading...',
        changeClass: 'text-state-warning',
        icon: '📋',
        iconBg: 'bg-state-error/20',
    },
    {
        title: 'Avg. Subscription',
        value: '—',
        change: 'Loading...',
        changeClass: 'text-text-secondary',
        icon: '💰',
        iconBg: 'bg-state-success/20',
    },
    {
        title: 'Retention Rate',
        value: '—',
        change: 'Loading...',
        changeClass: 'text-text-secondary',
        icon: '📈',
        iconBg: 'bg-primary-blue/20',
    },
];

const categoryColors = {
    'Self Employee': 'bg-primary-blue/20 text-primary-blue border border-primary-blue/30',
    'Boarding': 'bg-state-warning/20 text-state-warning border border-state-warning/30',
    'Food & Cafe': 'bg-state-error/20 text-state-error border border-state-error/30',
    'Clubs & Society': 'bg-primary-accent/20 text-primary-accent border border-primary-accent/30',
};



const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Self Employee', label: 'Self Employee' },
    { value: 'Boarding', label: 'Boarding' },
    { value: 'Food & Cafe', label: 'Food & Cafe' },
    { value: 'Clubs & Society', label: 'Clubs & Society' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: '● Active' },
    { value: 'Suspended', label: '● Suspended' },
];

// ─── Table column layout (using CSS grid template) ───────────────────────────
// Business(2fr) | Category(1fr) | Date(1.2fr) | Status(1fr) | Actions(1fr)
const COLS = '2fr 1fr 1.2fr 1fr 1fr';

// ─── Main Page ──────────────────────────────────────────────────────────────

const ActiveBusinesses = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Businesses');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // ── Data State ──────────────────────────────────────────
    const [businesses, setBusinesses] = useState([]);
    const [stats, setStats] = useState(businessStats); // Default stats layout
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Pagination State ────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_LIMIT = 10;

    // ── Fetch Stats on mount ────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getBusinessStats();
                const d = result.data || {};
                setStats([
                    { 
                        value: String(d.verifiedBusinesses ?? 0), 
                        title: 'Verified Businesses', 
                        change: d.verifiedTrend || '0% this month', 
                        changeClass: 'text-state-success',
                        icon: '✅',
                        iconBg: 'bg-gradient-to-br from-primary-blue/10 to-transparent' 
                    },
                    { 
                        value: String(d.pendingApprovals ?? 0), 
                        title: 'Awaiting Review', 
                        change: '⏳ Awaiting Review',
                        changeClass: 'text-state-warning',
                        icon: '⏳', 
                        iconBg: 'bg-gradient-to-br from-state-warning/10 to-transparent' 
                    },
                    { 
                        value: d.avgSubscription || 'Rs. 0', 
                        title: 'Avg. Subscription', 
                        change: d.avgSubscriptionTrend || 'Stable', 
                        changeClass: 'text-state-success',
                        icon: '💰',
                        iconBg: 'bg-gradient-to-br from-state-success/10 to-transparent' 
                    },
                    { 
                        value: d.retentionRate || 'N/A', 
                        title: 'Retention Rate', 
                        change: `💎 ${d.retentionLabel || 'N/A'}`,
                        changeClass: 'text-primary-accent',
                        icon: '📈', 
                        iconBg: 'bg-gradient-to-br from-primary-accent/10 to-transparent' 
                    },
                ]);
            } catch (err) {
                console.error('[ActiveBusinesses] Failed to load stats:', err);
                toast.error('Connection Error', 'Failed to load business stats.');
            }
        };
        fetchStats();
    }, []);

    // ── Reset page when filters change ──────────────────────
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, categoryFilter]);

    // ── Fetch Businesses when filters or page change ────────
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
                console.error('[ActiveBusinesses] Failed to load businesses:', err);
                setError('Failed to connect to the server. Please check backend.');
                toast.error('Connection Error', 'Failed to load business directory.');
            } finally {
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, [searchQuery, statusFilter, categoryFilter, currentPage]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setActiveFilter('All Businesses');
        setCategoryFilter('all');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    // ── Pagination Helpers ──────────────────────────────────
    const startItem = (currentPage - 1) * PAGE_LIMIT + 1;
    const endItem = Math.min(currentPage * PAGE_LIMIT, totalCount);

    return (
        <MainLayout
            user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
            pageTitle="Active Businesses"
        >
            {/* ── Stats Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                {stats.map((tile, i) => (
                    <Card
                        key={i}
                        variant="container"
                        className="hover:border-primary-blue/30 transition-colors h-auto md:h-44 md:relative"
                    >
                        <div className="hidden md:block">
                            <div className={`absolute top-lg left-lg w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                                <span className="text-lg">{tile.icon}</span>
                            </div>
                            <div className="absolute top-[72px] left-lg right-lg">
                                <p className="text-body-small-bold text-text-secondary truncate">{tile.title}</p>
                            </div>
                            <div className="absolute top-[94px] left-lg right-lg">
                                <p className="text-heading-medium text-text-primary">{tile.value}</p>
                                <p className={`text-body-extra-small mt-xs ${tile.changeClass} truncate`}>{tile.change}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-sm md:hidden">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                                <span className="text-lg">{tile.icon}</span>
                            </div>
                            <p className="text-body-small-bold text-text-secondary">{tile.title}</p>
                            <div>
                                <p className="text-heading-medium text-text-primary">{tile.value}</p>
                                <p className={`text-body-extra-small mt-xs ${tile.changeClass}`}>{tile.change}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Error State ──────────────────────────────────── */}
            {error && (
                <Card variant="container" className="mb-lg border-state-error/30 bg-state-error/5">
                    <div className="flex items-center gap-md">
                        <AlertTriangle size={24} className="text-state-error shrink-0" />
                        <div>
                            <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
                            <p className="text-body-small text-text-secondary">{error}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Business Directory Header ─────────────────────── */}
            <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
                <div>
                    <h2 className="text-heading-small text-text-primary">Business Directory</h2>
                    <p className="text-body-small text-text-secondary mt-xs">
                        Monitor and manage platform-affiliated businesses.
                    </p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        placeholder="Search by business, email or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={Search}
                        className="!gap-0"
                    />
                </div>
            </div>

            {/* ── Filters Row ───────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-md mb-md">
                {/* Tab: All Businesses */}
                <button
                    onClick={() => setActiveFilter('All Businesses')}
                    className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${activeFilter === 'All Businesses'
                        ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50'
                        : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                >
                    All Businesses
                </button>

                {/* Category Filter */}
                <div className="w-full md:w-64">
                    <Select
                        options={categoryOptions}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-40">
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>

                <div className="hidden md:block flex-1" />

                {/* Reset */}
                <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors"
                >
                    <RotateCcw size={14} />
                    Reset Filters
                </button>
            </div>

            {/* ── Business Directory Table ──────────────────────── */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-md hidden md:block">

                {/* Table Header */}
                <div
                    className="grid gap-md px-lg py-md border-b border-white/10"
                    style={{ gridTemplateColumns: COLS }}
                >
                    <span className="text-body-small-bold text-text-secondary">Business</span>
                    <span className="text-body-small-bold text-text-secondary">Category</span>
                    <span className="text-body-small-bold text-text-secondary">Registration Date</span>
                    <span className="text-body-small-bold text-text-secondary">Status</span>
                    <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="px-lg py-xl text-center text-text-secondary text-body-small">
                        Loading businesses...
                    </div>
                )}

                {/* Table Rows */}
                {!loading && !error && businesses.map((biz, idx) => (
                    <div
                        key={biz.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < businesses.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: COLS }}
                    >
                        {/* Business info */}
                        <div className="flex items-center gap-md min-w-0">
                            <img
                                src={getAvatarUrl(biz.avatar, biz.name)}
                                alt={biz.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-body-medium-bold text-text-primary truncate">{biz.name}</p>
                                <p className="text-body-extra-small text-text-secondary truncate">{biz.email}</p>
                            </div>
                        </div>

                        {/* Category badge */}
                        <div>
                            <span className={`inline-flex px-sm py-xs rounded-lg text-body-extra-small-bold whitespace-nowrap ${categoryColors[biz.category] || 'bg-white/10 text-text-secondary'
                                }`}>
                                {biz.category}
                            </span>
                        </div>

                        {/* Date */}
                        <span className="text-body-small text-text-secondary">{biz.registrationDate}</span>

                        {/* Status */}
                        <div className="flex items-center gap-xs">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${biz.status === 'Active' ? 'bg-state-success' : 'bg-state-error'}`} />
                            <span className={`text-body-small ${biz.status === 'Active' ? 'text-state-success' : 'text-state-error'}`}>{biz.status}</span>
                        </div>

                        {/* Action */}
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => navigate(`/active-businesses/${biz.id}`)}
                                className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
                
                {!loading && !error && businesses.length === 0 && (
                    <div className="px-lg py-xl text-center text-text-secondary text-body-small">
                        No businesses found matching your filters.
                    </div>
                )}
            </div>

            {/* ── Pagination Controls ─────────────────────────────── */}
            {!loading && !error && totalCount > 0 && (
                <div className="hidden md:flex flex-col sm:flex-row items-center justify-between gap-md mb-lg px-sm">
                    <p className="text-body-small text-text-secondary">
                        Showing {startItem}–{endItem} of {totalCount} businesses
                    </p>
                    <div className="flex items-center gap-sm">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-xs px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-sm text-text-secondary">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-9 h-9 rounded-lg text-body-small-bold transition-all ${currentPage === p
                                            ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-xs px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Mobile Cards View ──────────────────────────────── */}
            <div className="grid grid-cols-1 gap-md md:hidden">
                {!loading && !error && businesses.map((biz) => (
                    <Card
                        key={biz.id}
                        variant="container"
                        className="hover:bg-white/5 transition-colors"
                    >
                        <div className="flex flex-col gap-md">
                            {/* Top: Avatar + Name */}
                            <div className="flex items-center gap-md">
                                <img
                                    src={getAvatarUrl(biz.avatar, biz.name)}
                                    alt={biz.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-medium-bold text-text-primary truncate">{biz.name}</p>
                                    <p className="text-body-extra-small text-text-secondary truncate">{biz.email}</p>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${biz.status === 'Active' ? 'bg-state-success' : 'bg-state-error'}`} />
                                    <span className={`text-body-extra-small ${biz.status === 'Active' ? 'text-state-success' : 'text-state-error'}`}>{biz.status}</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex px-sm py-xs rounded-lg text-body-extra-small-bold whitespace-nowrap ${categoryColors[biz.category] || 'bg-white/10 text-text-secondary'}`}>
                                    {biz.category}
                                </span>
                                <span className="text-body-extra-small text-text-secondary">{biz.registrationDate}</span>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => navigate(`/active-businesses/${biz.id}`)}
                                className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center">
                                View Profile
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Mobile Pagination ──────────────────────────────── */}
            {!loading && !error && totalCount > PAGE_LIMIT && (
                <div className="flex items-center justify-center gap-md mt-md mb-lg md:hidden">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-body-small text-text-secondary">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-md py-sm rounded-xl text-body-small-bold border border-white/10 text-text-secondary disabled:opacity-30"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </MainLayout>
    );
};

export default ActiveBusinesses;
