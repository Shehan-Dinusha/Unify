import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useToast } from '../components/common/Toast';
import { Search, RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { reasonTagColors } from '../data/mockSuspendedUsers';
import { getDashboardStatistics, getAllSuspendedUsers } from '../services/suspensionService';

// ─── Filter Options ─────────────────────────────────────────────────────────

const reasonOptions = [
    { value: 'all', label: 'Reason : All' },
    { value: 'ToS Violation', label: 'ToS Violation' },
    { value: 'Payment Failure', label: 'Payment Failure' },
    { value: 'Suspicious Activity', label: 'Suspicious Activity' },
    { value: 'Harassment', label: 'Harassment' },
];

const dateOptions = [
    { value: 'all', label: 'Date : All Time' },
    { value: '7', label: 'Date : Last 7 Days' },
    { value: '30', label: 'Date : Last 30 Days' },
    { value: '90', label: 'Date : Last 90 Days' },
];

// ─── Table column layout ────────────────────────────────────────────────────
const COLS = '2fr 1.2fr 1fr 1fr';

// ─── Skeleton Loader ────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <div className="grid gap-md px-lg py-md items-center border-b border-white/5 animate-pulse" style={{ gridTemplateColumns: COLS }}>
        <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-2/3" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
        </div>
        <div><div className="h-6 bg-white/10 rounded-lg w-24" /></div>
        <div className="flex justify-end"><div className="h-8 bg-white/10 rounded-lg w-24" /></div>
    </div>
);

const StatCardSkeleton = () => (
    <Card variant="container" className="h-auto animate-pulse">
        <div className="flex items-start justify-between mb-sm">
            <div className="h-4 bg-white/10 rounded w-28" />
            <div className="h-5 bg-white/10 rounded-lg w-14" />
        </div>
        <div className="flex items-end gap-sm">
            <div className="h-8 bg-white/10 rounded w-12" />
            <div className="h-4 bg-white/5 rounded w-8" />
        </div>
    </Card>
);

// ─── Date Formatting ────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Main Page ──────────────────────────────────────────────────────────────

const SuspendedUsers = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Data states
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce ref for search
    const debounceRef = useRef(null);
    const fetchIdRef = useRef(0);

    // ─── Fetch Stats ────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const response = await getDashboardStatistics();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            toast.error('Failed to load statistics', err.message);
        } finally {
            setStatsLoading(false);
        }
    }, [toast]);

    // ─── Fetch Users ────────────────────────────────────────
    const fetchUsers = useCallback(async (currentPage, currentSearch, currentReason, currentDate) => {
        const fetchId = ++fetchIdRef.current;
        setUsersLoading(true);
        setError(null);
        try {
            const response = await getAllSuspendedUsers({
                search: currentSearch || undefined,
                reason: currentReason,
                dateRange: currentDate,
                status: 'ACTIVE', // Only show active suspensions in this list
                page: currentPage,
                limit,
            });

            // Guard against stale responses (race condition prevention)
            if (fetchId !== fetchIdRef.current) return;

            if (response.success) {
                setUsers(response.data.users || []);
                setPagination(response.data.pagination || null);
                // Also update stats from list response if stats haven't loaded
                if (response.data.statistics && !stats) {
                    setStats({
                        suspendedAccounts: { count: response.data.statistics.suspendedAccountsCount, badge: 'Active', change: response.data.statistics.suspendedAccountsChange },
                        highSeverityCases: { count: response.data.statistics.highSeverityCasesCount, badge: 'Critical', change: response.data.statistics.highSeverityCasesChange },
                        reactivatedThisMonth: { count: response.data.statistics.reactivatedThisMonthCount, badge: 'Restored', change: response.data.statistics.reactivatedThisMonthChange },
                    });
                }
            }
        } catch (err) {
            if (fetchId !== fetchIdRef.current) return;
            setError(err.message);
            toast.error('Failed to load suspended users', err.message);
        } finally {
            if (fetchId === fetchIdRef.current) {
                setUsersLoading(false);
            }
        }
    }, [limit, stats, toast]);

    // ─── Initial Load ───────────────────────────────────────
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchUsers(page, searchQuery, reasonFilter, dateFilter);
    }, [page, reasonFilter, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Debounced Search ───────────────────────────────────
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchUsers(1, searchQuery, reasonFilter, dateFilter);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleResetFilters = () => {
        setSearchQuery('');
        setReasonFilter('all');
        setDateFilter('all');
        setPage(1);
    };

    // ─── Build Stats Cards ──────────────────────────────────
    const buildStatCards = () => {
        if (!stats) return [];
        const changePrefix = (val) => {
            if (!val) return '';
            return val.startsWith('+') || val.startsWith('-') ? `↗${val.replace(/[+-]/, '')}` : `↗${val}`;
        };
        return [
            {
                label: 'Suspended Accounts',
                value: stats.suspendedAccounts?.count ?? 0,
                badge: 'Active',
                badgeClass: 'bg-state-error/20 text-state-error',
                change: changePrefix(stats.suspendedAccounts?.change),
                changeClass: 'text-state-error',
                cardBg: 'bg-gradient-to-br from-state-error/10 to-transparent',
            },
            {
                label: 'High Severity Cases',
                value: stats.highSeverityCases?.count ?? 0,
                badge: 'Critical',
                badgeClass: 'bg-state-warning/20 text-state-warning',
                change: changePrefix(stats.highSeverityCases?.change),
                changeClass: 'text-state-warning',
                cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent',
            },
            {
                label: 'Reactivated This Month',
                value: stats.reactivatedThisMonth?.count ?? 0,
                badge: 'Restored',
                badgeClass: 'bg-state-success/20 text-state-success',
                change: changePrefix(stats.reactivatedThisMonth?.change),
                changeClass: 'text-state-success',
                cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent',
            },
        ];
    };

    const statCards = buildStatCards();

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Suspended Users"
            verificationCount={mockRequests.length}
        >
            {/* ── Stats Row ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
                {statsLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    statCards.map((stat, i) => (
                        <Card key={i} variant="container" className={`${stat.cardBg} h-auto`}>
                            <div className="flex items-start justify-between mb-sm">
                                <span className="text-body-small text-text-secondary font-inter">{stat.label}</span>
                                <span className={`text-body-extra-small-bold px-sm py-xs rounded-lg ${stat.badgeClass}`}>
                                    {stat.badge}
                                </span>
                            </div>
                            <div className="flex items-end gap-sm">
                                <span className="text-heading-medium text-text-primary font-inter">{stat.value}</span>
                                <span className={`text-body-small-bold font-inter ${stat.changeClass}`}>{stat.change}</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* ── Page Title ───────────────────────────────────── */}
            <div className="mb-lg">
                <h1 className="text-heading-medium md:text-heading-large text-text-primary font-inter font-bold">
                    Suspended Users
                </h1>
                <p className="text-body-small text-text-secondary mt-xs max-w-2xl">
                    Manage access for restricted accounts, review pending appeals, and reactivate users who have resolved their issues.
                </p>
            </div>

            {/* ── Search + Filters Row ────────────────────────── */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-md mb-lg">
                <div className="flex-1">
                    <Input
                        icon={Search}
                        placeholder="Search by name, email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md">
                    <div className="w-full sm:w-48">
                        <Select
                            options={reasonOptions}
                            value={reasonFilter}
                            onChange={(e) => { setReasonFilter(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="w-full sm:w-52">
                        <Select
                            options={dateOptions}
                            value={dateFilter}
                            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                        />
                    </div>
                    <button
                        onClick={handleResetFilters}
                        className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors whitespace-nowrap"
                    >
                        <RotateCcw size={14} />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* ── Error Alert ─────────────────────────────────── */}
            {error && !usersLoading && (
                <div className="mb-lg rounded-2xl border border-state-error/30 bg-state-error/10 backdrop-blur-sm px-lg py-md flex items-center gap-md">
                    <AlertTriangle size={18} className="text-state-error shrink-0" />
                    <div className="flex-1">
                        <p className="text-body-small-bold text-state-error font-inter">Failed to load data</p>
                        <p className="text-body-extra-small text-text-secondary font-inter">{error}</p>
                    </div>
                    <button
                        onClick={() => fetchUsers(page, searchQuery, reasonFilter, dateFilter)}
                        className="text-body-extra-small-bold text-primary-blue hover:text-primary-blue/80 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Desktop Table ───────────────────────────────── */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg hidden md:block">
                {/* Header */}
                <div
                    className="grid gap-md px-lg py-md border-b border-white/10"
                    style={{ gridTemplateColumns: COLS }}
                >
                    <span className="text-body-small-bold text-text-secondary">User Details</span>
                    <span className="text-body-small-bold text-text-secondary">Suspension Date</span>
                    <span className="text-body-small-bold text-text-secondary">Reason</span>
                    <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
                </div>

                {/* Loading Skeleton */}
                {usersLoading && (
                    <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </>
                )}

                {/* Empty State */}
                {!usersLoading && !error && users.length === 0 && (
                    <div className="px-lg py-xl text-center">
                        <ShieldAlert size={40} className="text-text-tertiary mx-auto mb-md" />
                        <p className="text-body-medium-bold text-text-secondary font-inter">No suspended users found</p>
                        <p className="text-body-extra-small text-text-tertiary font-inter mt-xs">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}

                {/* Rows */}
                {!usersLoading && users.map((user, idx) => (
                    <div
                        key={user.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < users.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: COLS }}
                    >
                        {/* User Details */}
                        <div className="flex items-center gap-md min-w-0">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-body-medium-bold text-text-primary truncate">{user.name || 'Unknown User'}</p>
                                <p className="text-body-extra-small text-text-secondary truncate">{user.email || '—'}</p>
                            </div>
                        </div>

                        {/* Suspension Date */}
                        <div>
                            <p className="text-body-small text-text-secondary">{formatDate(user.suspensionDate)}</p>
                            <p className="text-body-extra-small text-text-secondary">{user.suspensionTime || ''}</p>
                        </div>

                        {/* Reason Tag */}
                        <div>
                            <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg whitespace-nowrap ${reasonTagColors[user.reasonTag] || 'bg-white/10 text-text-secondary'
                                }`}>
                                <span className="text-[10px]">
                                    {user.reasonTag === 'ToS Violation' && '🔥'}
                                    {user.reasonTag === 'Payment Failure' && '💳'}
                                    {user.reasonTag === 'Suspicious Activity' && '⚠️'}
                                    {user.reasonTag === 'Harassment' && '🚫'}
                                </span>
                                {user.reasonTag}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => navigate(`/suspended-users/${user.userId || user.id}`)}
                                className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Mobile Cards View ──────────────────────────── */}
            <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
                {usersLoading && (
                    <div className="flex items-center justify-center py-xl">
                        <Loader2 size={24} className="text-primary-blue animate-spin" />
                        <span className="ml-md text-body-small text-text-secondary">Loading...</span>
                    </div>
                )}
                {!usersLoading && users.map((user) => (
                    <Card
                        key={user.id}
                        variant="container"
                        className="hover:bg-white/5 transition-colors"
                    >
                        <div className="flex flex-col gap-md">
                            {/* Top: Avatar + Name + Reason */}
                            <div className="flex items-center gap-md">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-medium-bold text-text-primary truncate">{user.name || 'Unknown User'}</p>
                                    <p className="text-body-extra-small text-text-secondary truncate">{user.email || '—'}</p>
                                </div>
                                <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${reasonTagColors[user.reasonTag] || 'bg-white/10 text-text-secondary'
                                    }`}>
                                    {user.reasonTag}
                                </span>
                            </div>

                            {/* Details Row */}
                            <div className="flex items-center justify-between">
                                <span className="text-body-small text-text-secondary">{formatDate(user.suspensionDate)}</span>
                                <span className="text-body-extra-small text-text-secondary">{user.suspensionTime || ''}</span>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => navigate(`/suspended-users/${user.userId || user.id}`)}
                                className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
                            >
                                View Profile
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── Pagination ──────────────────────────────────── */}
            {pagination && pagination.totalPages > 1 && !usersLoading && (
                <div className="flex items-center justify-between mb-lg">
                    <p className="text-body-extra-small text-text-secondary font-inter">
                        Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                    </p>
                    <div className="flex items-center gap-sm">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pagination.page <= 1}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                            .map((p, idx, arr) => (
                                <React.Fragment key={p}>
                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                        <span className="text-text-tertiary text-xs px-1">…</span>
                                    )}
                                    <button
                                        onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-lg text-body-extra-small-bold font-inter flex items-center justify-center transition-all ${p === pagination.page
                                                ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25'
                                                : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))}
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default SuspendedUsers;
