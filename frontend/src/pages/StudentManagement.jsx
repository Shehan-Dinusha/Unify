import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { Search, RotateCcw, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { mockRequests } from '../data/mockData';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const students = [
    {
        id: 1,
        name: 'Kasun Perera',
        email: 'kasun@uom.lk',
        faculty: 'Faculty of IT',
        status: 'Active',
        lastActive: '2 mins ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KasunPerera',
    },
    {
        id: 2,
        name: 'Achini Jayasuriya',
        email: 'achini@uom.lk',
        faculty: 'Faculty of IT',
        status: 'Active',
        lastActive: '1 hour ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AchiniJay',
    },
    {
        id: 3,
        name: 'Kaveesha Silva',
        email: 'kaveesha@uom.lk',
        faculty: 'Faculty of IT',
        status: 'Active',
        lastActive: 'Yesterday',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KaveeshaSilva',
    },
    {
        id: 4,
        name: 'Nuwani Perera',
        email: 'nuwani@uom.lk',
        faculty: 'Faculty of IT',
        status: 'Active',
        lastActive: '12 days ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NuwaniPerera',
    },
];

const facultyOptions = [
    { value: 'all', label: 'All Faculties' },
    { value: 'it', label: 'Faculty Of Information Technology' },
    { value: 'eng', label: 'Faculty of Engineering' },
    { value: 'sci', label: 'Faculty of Science' },
    { value: 'mgmt', label: 'Faculty of Management' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: '● Active' },
    { value: 'inactive', label: '● Inactive' },
    { value: 'suspended', label: '● Suspended' },
];

// ─── Stat Footer Cards ──────────────────────────────────────────────────────

const footerStats = [
    {
        icon: TrendingUp,
        iconBg: 'bg-state-success/20',
        iconColor: 'text-state-success',
        value: '92%',
        label: 'Activity Rate',
        cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent',
    },
    {
        icon: ShieldCheck,
        iconBg: 'bg-primary-blue/20',
        iconColor: 'text-primary-blue',
        value: '12.8k',
        label: 'Verified Identities',
        cardBg: 'bg-gradient-to-br from-primary-blue/10 to-transparent',
    },
    {
        icon: AlertTriangle,
        iconBg: 'bg-state-warning/20',
        iconColor: 'text-state-warning',
        value: '42',
        label: 'Flagged Sessions',
        cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent',
    },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

const StudentManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Students');
    const [facultyFilter, setFacultyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    const handleResetFilters = () => {
        setSearchQuery('');
        setActiveFilter('All Students');
        setFacultyFilter('all');
        setStatusFilter('all');
    };

    const filteredStudents = students.filter((s) => {
        if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (statusFilter !== 'all' && s.status.toLowerCase() !== statusFilter) {
            return false;
        }
        return true;
    });

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Student Management"
            verificationCount={mockRequests.length}
        >
            {/* ── Header Row ────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-lg">
                <div>
                    <h2 className="text-heading-small text-text-primary">Student Directory</h2>
                    <p className="text-body-small text-text-secondary mt-xs">
                        Manage and monitor elite student profiles.
                    </p>
                </div>
                <div className="w-72">
                    <Input
                        icon={Search}
                        placeholder="Search by name, index or NIC...."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Filters Row ───────────────────────────────────── */}
            <div className="flex items-center gap-md mb-md">
                {/* Tab: All Students */}
                <button
                    onClick={() => setActiveFilter('All Students')}
                    className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${activeFilter === 'All Students'
                        ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50'
                        : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                >
                    All Students
                </button>

                {/* Faculty Filter */}
                <div className="w-64">
                    <Select
                        options={facultyOptions}
                        value={facultyFilter}
                        onChange={(e) => setFacultyFilter(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="w-40">
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>

                <div className="flex-1" />

                {/* Reset */}
                <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors"
                >
                    <RotateCcw size={14} />
                    Reset Filters
                </button>
            </div>

            {/* ── Student Table ─────────────────────────────────── */}
            {/* Raw div — same glass styling as Card container, but no inner padding wrapper */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg">
                {/* Header */}
                <div
                    className="grid gap-md px-lg py-md border-b border-white/10"
                    style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr' }}
                >
                    <span className="text-body-small-bold text-text-secondary">Student Name</span>
                    <span className="text-body-small-bold text-text-secondary">Faculty</span>
                    <span className="text-body-small-bold text-text-secondary">Status</span>
                    <span className="text-body-small-bold text-text-secondary">Last Active</span>
                    <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
                </div>

                {/* Rows */}
                {filteredStudents.map((student, idx) => (
                    <div
                        key={student.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < filteredStudents.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr' }}
                    >
                        {/* Name & Avatar */}
                        <div className="flex items-center gap-md min-w-0">
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-body-medium-bold text-text-primary truncate">{student.name}</p>
                                <p className="text-body-extra-small text-text-secondary truncate">{student.email}</p>
                            </div>
                        </div>

                        {/* Faculty */}
                        <span className="text-body-small text-text-secondary truncate">{student.faculty}</span>

                        {/* Status */}
                        <div>
                            <span className={`inline-flex items-center gap-xs text-body-small-bold px-sm py-xs rounded-lg ${student.status === 'Active'
                                ? 'text-state-success bg-state-success/10 border border-state-success/30'
                                : 'text-state-error bg-state-error/10 border border-state-error/30'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-state-success' : 'bg-state-error'
                                    }`} />
                                {student.status}
                            </span>
                        </div>

                        {/* Last Active */}
                        <span className="text-body-small text-text-secondary">{student.lastActive}</span>

                        {/* Actions */}
                        <div className="flex items-center justify-end">
                            <button className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Footer Stats ──────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-md">
                {footerStats.map((stat, i) => (
                    <Card key={i} variant="container" className={`${stat.cardBg}`}>
                        <div className="flex items-center gap-md">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                                <stat.icon size={24} className={stat.iconColor} />
                            </div>
                            <div>
                                <span className="text-heading-small text-text-primary">{stat.value}</span>
                                <p className="text-body-small text-text-secondary">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
};

export default StudentManagement;
