import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { Search, RotateCcw, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getStudentDirectory, getStudentStats } from '../services/studentService';

// ─── Static Options ─────────────────────────────────────────────────────────

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
    { value: 'suspended', label: '● Suspended' },
];

// ─── Stat Icon Map ──────────────────────────────────────────────────────────

const STAT_ICONS = {
    'Activity Rate': { icon: TrendingUp, iconBg: 'bg-state-success/20', iconColor: 'text-state-success' },
    'Verified Identities': { icon: ShieldCheck, iconBg: 'bg-primary-blue/20', iconColor: 'text-primary-blue' },
    'Flagged Sessions': { icon: AlertTriangle, iconBg: 'bg-state-warning/20', iconColor: 'text-state-warning' },
};

// ─── Main Page ──────────────────────────────────────────────────────────────

const StudentManagement = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Students');
    const [facultyFilter, setFacultyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    // ── Data State ──────────────────────────────────────────
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch Stats on mount ────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getStudentStats();
                const d = result.data || {};
                setStats([
                    { value: d.activityRate || '0%', label: 'Activity Rate', cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent' },
                    { value: String(d.verifiedIdentities ?? 0), label: 'Verified Identities', cardBg: 'bg-gradient-to-br from-primary-blue/10 to-transparent' },
                    { value: String(d.flaggedSessions ?? 0), label: 'Flagged Sessions', cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent' },
                ]);
            } catch (err) {
                console.error('[StudentManagement] Failed to load stats:', err);
                toast.error('Connection Error', 'Failed to load student stats. Please check your backend.');
            }
        };
        fetchStats();
    }, []);

    // ── Fetch Students when filters change ──────────────────
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getStudentDirectory({
                    search: searchQuery,
                    status: statusFilter,
                    faculty: facultyFilter,
                });
                setStudents(result.data?.students || result.data || []);
            } catch (err) {
                console.error('[StudentManagement] Failed to load students:', err);
                setError('Failed to connect to the server. Please make sure the backend is running.');
                toast.error('Connection Error', 'Failed to load student directory.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [searchQuery, statusFilter, facultyFilter]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setActiveFilter('All Students');
        setFacultyFilter('all');
        setStatusFilter('all');
    };

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Student Management"
        >
            {/* ── Top Stats Row ─────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
                {stats.map((stat, i) => {
                    const iconMeta = STAT_ICONS[stat.label] || { icon: TrendingUp, iconBg: 'bg-white/10', iconColor: 'text-text-secondary' };
                    const StatIcon = iconMeta.icon;
                    return (
                        <Card key={i} variant="container" className={`${stat.cardBg || ''} h-32 flex items-center`}>
                            <div className="flex items-center gap-md">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconMeta.iconBg}`}>
                                    <StatIcon size={24} className={iconMeta.iconColor} />
                                </div>
                                <div>
                                    <span className="text-heading-small text-text-primary">{stat.value}</span>
                                    <p className="text-body-small text-text-secondary">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
            {/* ── Header Row ────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
                <div>
                    <h2 className="text-heading-small text-text-primary">Student Directory</h2>
                    <p className="text-body-small text-text-secondary mt-xs">
                        Manage and monitor elite student profiles.
                    </p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        icon={Search}
                        placeholder="Search by name, index or NIC...."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Filters Row ───────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-md mb-md">
                <button
                    onClick={() => setActiveFilter('All Students')}
                    className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${activeFilter === 'All Students'
                        ? 'bg-primary-blue/20 text-primary-blue border-primary-blue/50'
                        : 'border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                >
                    All Students
                </button>

                <div className="w-full md:w-64">
                    <Select
                        options={facultyOptions}
                        value={facultyFilter}
                        onChange={(e) => setFacultyFilter(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-40">
                    <Select
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>

                <div className="hidden md:block flex-1" />

                <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors"
                >
                    <RotateCcw size={14} />
                    Reset Filters
                </button>
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

            {/* ── Student Table ─────────────────────────────────── */}
            <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg hidden md:block">
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

                {loading && (
                    <div className="px-lg py-xl text-center text-text-secondary text-body-small">
                        Loading students...
                    </div>
                )}

                {!loading && !error && students.map((student, idx) => (
                    <div
                        key={student.id}
                        className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < students.length - 1 ? 'border-b border-white/5' : ''
                            }`}
                        style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr' }}
                    >
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

                        <span className="text-body-small text-text-secondary truncate">{student.faculty}</span>

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

                        <span className="text-body-small text-text-secondary">{student.lastActive}</span>

                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => navigate(`/student-management/${student.id}`)}
                                className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && !error && students.length === 0 && (
                    <div className="px-lg py-xl text-center text-text-secondary text-body-small">
                        No students found matching your filters.
                    </div>
                )}
            </div>

            {/* ── Mobile Cards View ──────────────────────────────── */}
            <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
                {!loading && !error && students.map((student) => (
                    <Card
                        key={student.id}
                        variant="container"
                        className="hover:bg-white/5 transition-colors"
                    >
                        <div className="flex flex-col gap-md">
                            <div className="flex items-center gap-md">
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-body-medium-bold text-text-primary truncate">{student.name}</p>
                                    <p className="text-body-extra-small text-text-secondary truncate">{student.email}</p>
                                </div>
                                <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${student.status === 'Active'
                                    ? 'text-state-success bg-state-success/10 border border-state-success/30'
                                    : 'text-state-error bg-state-error/10 border border-state-error/30'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-state-success' : 'bg-state-error'}`} />
                                    {student.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-body-small text-text-secondary">{student.faculty}</span>
                                <span className="text-body-extra-small text-text-secondary">{student.lastActive}</span>
                            </div>

                            <button
                                onClick={() => navigate(`/student-management/${student.id}`)}
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

export default StudentManagement;
