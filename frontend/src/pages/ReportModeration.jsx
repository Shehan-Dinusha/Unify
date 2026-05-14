import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import { useToast } from '../components/common/Toast';
import { fetchAllReports, getReportStats } from '../services/reportService';
import {
    RotateCcw, TrendingUp, ShieldAlert, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { getAvatarUrl } from '../utils/formatters';
import { getCurrentUser } from '../services/authService';

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        Pending:          'bg-state-error/20 text-state-error border-state-error/30',
        'Pending Review': 'bg-state-error/20 text-state-error border-state-error/30',
        'In Review':      'bg-state-warning/20 text-state-warning border-state-warning/30',
        'In Progress':    'bg-state-warning/20 text-state-warning border-state-warning/30',
        Resolved:         'bg-state-success/20 text-state-success border-state-success/30',
        Dismissed:        'bg-white/10 text-text-secondary border-white/20',
        Withdrawn:        'bg-white/10 text-text-secondary border-white/20',
    };
    const dotColor = {
        Pending: 'bg-state-error', 'Pending Review': 'bg-state-error',
        'In Review': 'bg-state-warning', 'In Progress': 'bg-state-warning',
        Resolved: 'bg-state-success',
        Dismissed: 'bg-text-secondary', Withdrawn: 'bg-text-secondary',
    };
    // Normalize display label
    const displayLabel = status === 'In Progress' ? 'In Review' : status;
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${map[status] || map.Pending}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status] || 'bg-text-secondary'}`} />
            {displayLabel}
        </span>
    );
};

const TypeBadge = ({ type }) => {
    const styles = {
        'Hate Speech': 'text-state-error bg-state-error/10 border-state-error/30',
        Nudity:        'text-primary-accent bg-primary-accent/10 border-primary-accent/30',
        Spam:          'text-state-warning bg-state-warning/10 border-state-warning/30',
        Harassment:    'text-state-error bg-state-error/10 border-state-error/30',
    };
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${styles[type] || 'text-text-secondary bg-white/10 border-white/20'}`}>
            {type}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   REPORT MODERATION — QUEUE PAGE — /report-moderation
   ═══════════════════════════════════════════════════════════════════════ */
const ReportModeration = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [filterType, setFilterType]     = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // ── Data State (mirrors StudentManagement pattern) ──────────────────
    const [reports, setReports]   = useState([]);
    const [stats, setStats]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // ── Fetch Stats on mount ────────────────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getReportStats();
                const d = result.data || {};
                setStats([
                    { icon: TrendingUp,  iconBg: 'bg-state-warning/20', iconColor: 'text-state-warning', value: String(d.totalPending ?? 0),  label: 'Total Pending',  cardBg: 'bg-gradient-to-br from-state-warning/10 to-transparent' },
                    { icon: ShieldAlert,  iconBg: 'bg-state-error/20',   iconColor: 'text-state-error',   value: String(d.criticalFlags ?? 0), label: 'Critical Flags', cardBg: 'bg-gradient-to-br from-state-error/10 to-transparent' },
                    { icon: ShieldCheck, iconBg: 'bg-state-success/20',  iconColor: 'text-state-success', value: String(d.resolvedToday ?? 0), label: 'Resolved Today', cardBg: 'bg-gradient-to-br from-state-success/10 to-transparent' },
                ]);
            } catch (err) {
                console.error('[ReportModeration] Failed to load stats:', err);
                toast.error('Connection Error', 'Failed to load report stats. Please check your backend.');
            }
        };
        fetchStats();
    }, []);

    // ── Fetch Reports when filters change ───────────────────────────────
    useEffect(() => {
        const loadReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchAllReports({
                    type: filterType,
                    status: filterStatus,
                });
                setReports(result.data || []);
            } catch (err) {
                console.error('[ReportModeration] Failed to load reports:', err);
                setError('Failed to connect to the server. Please make sure the backend is running.');
                toast.error('Connection Error', 'Failed to load report queue.');
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, [filterType, filterStatus]);

    const typeOptions   = [{ value:'',label:'All Report Types' },{ value:'Inappropriate Content',label:'Inappropriate Content' },{ value:'Spam',label:'Spam' },{ value:'Harassment',label:'Harassment' },{ value:'Misinformation',label:'Misinformation' },{ value:'Other',label:'Other' }];
    // Status values must match what the backend getSocialReportQueue maps (admin UI statuses)
    const statusOptions = [
        { value:'',          label:'All Status' },
        { value:'Pending',   label:'● Pending' },
        { value:'In Review', label:'● In Review' },
        { value:'Resolved',  label:'● Resolved' },
        { value:'Dismissed', label:'● Dismissed' },
        { value:'Withdrawn', label:'● Withdrawn' },
    ];


    // Navigate to the report detail page — real route, browser back works perfectly
    const viewDetails = (r) => navigate(`/report-moderation/${r.id}`);

    return (
        <MainLayout
            user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
            pageTitle="Report Moderation"
        >
            <div className="flex flex-col gap-lg">
                {/* Stats — icon above, text below, centered */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    {stats.map((s, i) => (
                        <Card key={i} variant="container" className={`${s.cardBg} h-36 flex items-center justify-center`}>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                                    <s.icon size={24} className={s.iconColor} />
                                </div>
                                <div>
                                    <span className="text-heading-small text-text-primary block">{s.value}</span>
                                    <p className="text-body-small text-text-secondary">{s.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Title */}
                <div>
                    <h2 className="text-heading-small text-text-primary">Report Queue</h2>
                    <p className="text-body-small text-text-secondary mt-xs">Review and manage flagged content reports.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-md">
                    <div className="w-full md:w-48">
                        <Select options={typeOptions} value={filterType} onChange={(e) => setFilterType(e.target.value)} />
                    </div>
                    <div className="w-full md:w-40">
                        <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
                    </div>
                    <div className="hidden md:block flex-1" />
                    <button onClick={() => { setFilterType(''); setFilterStatus(''); }} className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors">
                        <RotateCcw size={14} /> Reset Filters
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <Card variant="container" className="border-state-error/30 bg-state-error/5">
                        <div className="flex items-center gap-md">
                            <AlertTriangle size={24} className="text-state-error shrink-0" />
                            <div>
                                <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
                                <p className="text-body-small text-text-secondary">{error}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Desktop Table */}
                <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm hidden md:block">
                    <div className="grid gap-md px-lg py-md border-b border-white/10" style={{ gridTemplateColumns: '0.8fr 1fr 1.5fr 1fr 0.8fr 1fr' }}>
                        <span className="text-body-small-bold text-text-secondary">Report ID</span>
                        <span className="text-body-small-bold text-text-secondary">Type</span>
                        <span className="text-body-small-bold text-text-secondary">Reported User</span>
                        <span className="text-body-small-bold text-text-secondary">Date</span>
                        <span className="text-body-small-bold text-text-secondary">Status</span>
                        <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
                    </div>

                    {loading && (
                        <div className="px-lg py-xl text-center text-text-secondary text-body-small">
                            Loading reports...
                        </div>
                    )}

                    {!loading && !error && reports.map((r, idx) => (
                        <div key={r.id} className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < reports.length - 1 ? 'border-b border-white/5' : ''}`} style={{ gridTemplateColumns: '0.8fr 1fr 1.5fr 1fr 0.8fr 1fr' }}>
                            <span className="text-body-small-bold text-text-primary">#{r.id}</span>
                            <TypeBadge type={r.type} />
                            <div className="flex items-center gap-md min-w-0">
                                <img src={getAvatarUrl(r.reportedUser.avatar, r.reportedUser.name)} alt={r.reportedUser.name} className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0" />
                                <span className="text-body-small text-text-primary truncate">{r.reportedUser.handle}</span>
                            </div>
                            <span className="text-body-small text-text-secondary">{r.date}</span>
                            <StatusBadge status={r.status} />
                            <div className="flex items-center justify-end">
                                <button onClick={() => viewDetails(r)} className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                    {!loading && !error && reports.length === 0 && (
                        <div className="px-lg py-12 text-center text-body-small text-text-secondary">No reports found matching the current filters.</div>
                    )}
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-1 gap-md md:hidden">
                    {!loading && !error && reports.map(r => (
                        <Card key={r.id} variant="container" className="hover:bg-white/5 transition-colors">
                            <div className="flex flex-col gap-md">
                                <div className="flex items-center gap-md">
                                    <img src={getAvatarUrl(r.reportedUser.avatar, r.reportedUser.name)} alt={r.reportedUser.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-body-medium-bold text-text-primary truncate">{r.reportedUser.name}</p>
                                        <p className="text-body-extra-small text-text-secondary truncate">{r.reportedUser.handle} • #{r.id}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <TypeBadge type={r.type} />
                                    <span className="text-body-extra-small text-text-secondary">{r.date}</span>
                                </div>
                                <button onClick={() => viewDetails(r)} className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center">
                                    View Details
                                </button>
                            </div>
                        </Card>
                    ))}
                    {!loading && !error && reports.length === 0 && <div className="p-8 text-center text-body-small text-text-secondary">No reports found.</div>}
                </div>
            </div>
        </MainLayout>
    );
};

export default ReportModeration;
