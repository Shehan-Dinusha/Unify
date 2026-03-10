import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Search, RotateCcw, AlertTriangle, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { suspendedUsers, reasonTagColors } from '../data/mockSuspendedUsers';

// ─── Stat Tiles ─────────────────────────────────────────────────────────────

const suspendedStats = [
    {
        label: 'Suspended Accounts',
        value: '38',
        badge: 'Active',
        badgeClass: 'bg-state-error/20 text-state-error',
        change: '↗3%',
        changeClass: 'text-state-error',
        cardBg: 'bg-gradient-to-br from-state-error/10 to-transparent',
    },
    {
        label: 'Pending Appeals',
        value: '12',
        badge: 'Review',
        badgeClass: 'bg-state-warning/20 text-state-warning',
        change: '↗5%',
        changeClass: 'text-state-warning',
        cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent',
    },
    {
        label: 'Reactivated This Month',
        value: '24',
        badge: 'Restored',
        badgeClass: 'bg-state-success/20 text-state-success',
        change: '↗18%',
        changeClass: 'text-state-success',
        cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent',
    },
];

// ─── Filter Options ─────────────────────────────────────────────────────────

const reasonOptions = [
    { value: 'all', label: 'Reason : All' },
    { value: 'ToS Violation', label: 'ToS Violation' },
    { value: 'Payment Failure', label: 'Payment Failure' },
    { value: 'Suspicious Activity', label: 'Suspicious Activity' },
    { value: 'Harassment', label: 'Harassment' },
];

const dateOptions = [
    { value: '30', label: 'Date : Last 30 Days' },
    { value: '7', label: 'Date : Last 7 Days' },
    { value: '90', label: 'Date : Last 90 Days' },
    { value: 'all', label: 'Date : All Time' },
];

// ─── Table column layout ────────────────────────────────────────────────────
const COLS = '2fr 1.2fr 1fr 1fr';

// ─── Main Page ──────────────────────────────────────────────────────────────

const SuspendedUsers = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [reasonFilter, setReasonFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('30');

    const handleResetFilters = () => {
        setSearchQuery('');
        setReasonFilter('all');
        setDateFilter('30');
    };

    const filtered = suspendedUsers.filter((u) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.studentId.toLowerCase().includes(query);
        const matchesReason = reasonFilter === 'all' || u.reasonTag === reasonFilter;
        return matchesSearch && matchesReason;
    });

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Suspended Users"
            verificationCount={mockRequests.length}
        >
            {/* ── Stats Row ──────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
                {suspendedStats.map((stat, i) => (
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
                ))}
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
                            onChange={(e) => setReasonFilter(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-52">
                        <Select
                            options={dateOptions}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
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

                {/* Rows */}
                {filtered.map((user, idx) => (
                    <div
                        key={user.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < filtered.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: COLS }}
                    >
                        {/* User Details */}
                        <div className="flex items-center gap-md min-w-0">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-body-medium-bold text-text-primary truncate">{user.name}</p>
                                <p className="text-body-extra-small text-text-secondary truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Suspension Date */}
                        <div>
                            <p className="text-body-small text-text-secondary">{user.suspensionDate}</p>
                            <p className="text-body-extra-small text-text-secondary">{user.suspensionTime}</p>
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
                                onClick={() => navigate(`/suspended-users/${user.id}`)}
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
                {filtered.map((user) => (
                    <Card
                        key={user.id}
                        variant="container"
                        className="hover:bg-white/5 transition-colors"
                    >
                        <div className="flex flex-col gap-md">
                            {/* Top: Avatar + Name + Reason */}
                            <div className="flex items-center gap-md">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-medium-bold text-text-primary truncate">{user.name}</p>
                                    <p className="text-body-extra-small text-text-secondary truncate">{user.email}</p>
                                </div>
                                <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${reasonTagColors[user.reasonTag] || 'bg-white/10 text-text-secondary'
                                    }`}>
                                    {user.reasonTag}
                                </span>
                            </div>

                            {/* Details Row */}
                            <div className="flex items-center justify-between">
                                <span className="text-body-small text-text-secondary">{user.suspensionDate}</span>
                                <span className="text-body-extra-small text-text-secondary">{user.suspensionTime}</span>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => navigate(`/suspended-users/${user.id}`)}
                                className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
                            >
                                View Profile
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
};

export default SuspendedUsers;
