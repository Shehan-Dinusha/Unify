import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import { mockRequests } from '../data/mockData';

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
};

const businesses = [
    {
        id: 1,
        name: 'TechFlow Solutions',
        email: 'contact@techflow.io',
        category: 'Self Employee',
        registrationDate: 'Oct 24, 2025',
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechFlow',
    },
    {
        id: 2,
        name: 'Urban Living',
        email: 'agents@urbanliving.net',
        category: 'Boarding',
        registrationDate: 'Nov 01, 2025',
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UrbanLiving',
    },
    {
        id: 3,
        name: 'Nexus Creative',
        email: 'projects@nexus.agency',
        category: 'Self Employee',
        registrationDate: 'Dec 15, 2025',
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NexusCreative',
    },
    {
        id: 4,
        name: 'GreenLeaf Organics',
        email: 'hello@greenleaf.com',
        category: 'Food & Cafe',
        registrationDate: 'Sep 12, 2025',
        status: 'Active',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GreenLeaf',
    },
];

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'self-employee', label: 'Self Employee' },
    { value: 'boarding', label: 'Boarding' },
    { value: 'food', label: 'Food & Cafe' },
];

// ─── Table column layout (using CSS grid template) ───────────────────────────
// Business(2fr) | Category(1fr) | Date(1.2fr) | Status(1fr) | Actions(1fr)
const COLS = '2fr 1fr 1.2fr 1fr 1fr';

// ─── Main Page ──────────────────────────────────────────────────────────────

const ActiveBusinesses = () => {
    const [filterCategory, setFilterCategory] = useState('all');

    const filtered = businesses.filter(
        (b) =>
            filterCategory === 'all' ||
            b.category.toLowerCase().replace(/[\s&]+/g, '-').replace('--', '-') === filterCategory
    );

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Active Businesses"
            verificationCount={mockRequests.length}
        >
            {/* ── Stats Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-md mb-lg">
                {businessStats.map((tile, i) => (
                    <Card
                        key={i}
                        variant="container"
                        className="hover:border-primary-blue/30 transition-colors h-44 relative"
                    >
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
                    </Card>
                ))}
            </div>

            {/* ── Business Directory Header ─────────────────────── */}
            <div className="flex items-center justify-between mb-md">
                <h2 className="text-heading-small text-text-primary">Business Directory</h2>
                <div className="flex items-center gap-sm text-text-secondary text-body-small">
                    <span>≡</span>
                    <span>Filter Category</span>
                    <div className="w-44">
                        <Select
                            options={categoryOptions}
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Business Directory Table ──────────────────────── */}
            {/* Use a raw styled div — Card's inner wrapper adds padding we don't want for a table */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">

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
                            <button className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

export default ActiveBusinesses;
