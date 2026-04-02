import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import { mockRequests } from '../data/mockData';
import { businessProfiles } from '../data/mockBusinessProfiles';
import { Search, RotateCcw } from 'lucide-react';
import Input from '../components/common/Input';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const businessStats = [
    {
        title: 'Verified Businesses',
        value: '1,894',
        change: '↗ +12% this month',
        changeClass: 'text-state-success',
        icon: '✅',
        iconBg: 'bg-state-success/20',
    },
    {
        title: 'Pending Approvals',
        value: '24',
        change: '⏳ Awaiting Review',
        changeClass: 'text-state-warning',
        icon: '📋',
        iconBg: 'bg-state-error/20',
    },
    {
        title: 'Avg. Subscription',
        value: 'Rs. 8000',
        change: '↑ +4% per user',
        changeClass: 'text-state-success',
        icon: '💰',
        iconBg: 'bg-state-success/20',
    },
    {
        title: 'Retention Rate',
        value: '98.2%',
        change: '� High Loyalty',
        changeClass: 'text-primary-accent',
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

// Local state derived from centralized business profiles
const businessesData = businessProfiles.map(p => ({
    id: p.id,
    name: p.name,
    email: p.businessInfo?.email || 'contact@business.lk',
    category: p.category,
    registrationDate: p.registrationDate,
    status: p.status,
    avatar: p.logo
}));

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
    { value: 'Inactive', label: '● Inactive' },
];

// ─── Table column layout (using CSS grid template) ───────────────────────────
// Business(2fr) | Category(1fr) | Date(1.2fr) | Status(1fr) | Actions(1fr)
const COLS = '2fr 1fr 1.2fr 1fr 1fr';

// ─── Main Page ──────────────────────────────────────────────────────────────

const ActiveBusinesses = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Businesses');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleResetFilters = () => {
        setSearchQuery('');
        setActiveFilter('All Businesses');
        setCategoryFilter('all');
        setStatusFilter('all');
    };

    const filtered = businessesData.filter((b) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = b.name.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query) ||
            b.email.toLowerCase().includes(query);

        const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Active Businesses"
            verificationCount={mockRequests.length}
        >
            {/* ── Stats Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                {businessStats.map((tile, i) => (
                    <Card
                        key={i}
                        variant="container"
                        className="hover:border-primary-blue/30 transition-colors h-auto md:h-44 md:relative"
                    >
                        {/* Desktop: absolute positioned (original) */}
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
                        {/* Mobile: flex-based layout */}
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
            {/* Use a raw styled div — Card's inner wrapper adds padding we don't want for a table */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm hidden md:block">

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

                {/* Table Rows */}
                {filtered.map((biz, idx) => (
                    <div
                        key={biz.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < filtered.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: COLS }}
                    >
                        {/* Business info */}
                        <div className="flex items-center gap-md min-w-0">
                            <img
                                src={biz.avatar}
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
                            <div className="w-2 h-2 rounded-full bg-state-success shrink-0" />
                            <span className="text-body-small text-state-success">{biz.status}</span>
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
            </div>

            {/* ── Mobile Cards View ──────────────────────────────── */}
            <div className="grid grid-cols-1 gap-md md:hidden">
                {filtered.map((biz) => (
                    <Card
                        key={biz.id}
                        variant="container"
                        className="hover:bg-white/5 transition-colors"
                    >
                        <div className="flex flex-col gap-md">
                            {/* Top: Avatar + Name */}
                            <div className="flex items-center gap-md">
                                <img
                                    src={biz.avatar}
                                    alt={biz.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-medium-bold text-text-primary truncate">{biz.name}</p>
                                    <p className="text-body-extra-small text-text-secondary truncate">{biz.email}</p>
                                </div>
                                <div className="flex items-center gap-xs">
                                    <div className="w-2 h-2 rounded-full bg-state-success shrink-0" />
                                    <span className="text-body-extra-small text-state-success">{biz.status}</span>
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
        </MainLayout>
    );
};

export default ActiveBusinesses;
