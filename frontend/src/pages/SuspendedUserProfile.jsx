import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { AlertTriangle, Calendar, Mail, Phone, MapPin, ShieldAlert, Loader2 } from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { severityColors } from '../data/mockSuspendedUsers';
import { getSuspendedUserById } from '../services/suspensionService';

// ─── Date Formatting ────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Skeleton Loader ────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg animate-pulse">
        <Card variant="card" padding="p-0">
            <div className="p-lg">
                <div className="flex flex-col items-center text-center mb-lg">
                    <div className="w-20 h-20 rounded-full bg-white/10 mb-md" />
                    <div className="h-6 bg-white/10 rounded w-40 mb-sm" />
                    <div className="h-4 bg-white/5 rounded w-32" />
                </div>
                <div className="border-t border-white/10 space-y-0">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between py-md border-b border-white/5">
                            <div className="h-4 bg-white/10 rounded w-20" />
                            <div className="h-4 bg-white/10 rounded w-32" />
                        </div>
                    ))}
                </div>
                <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                    <div className="h-5 bg-white/10 rounded w-36 mb-md" />
                    <div className="space-y-md">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-md">
                                <div className="w-4 h-4 bg-white/10 rounded" />
                                <div className="h-4 bg-white/5 rounded w-48" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
        <Card variant="card" padding="p-0">
            <div className="p-lg space-y-lg">
                <div className="flex items-start justify-between">
                    <div className="h-6 bg-white/10 rounded w-40" />
                    <div className="h-6 bg-white/10 rounded-lg w-24" />
                </div>
                <div className="h-4 bg-white/5 rounded w-56" />
                <div className="grid grid-cols-2 gap-lg">
                    <div className="space-y-2"><div className="h-3 bg-white/5 rounded w-24" /><div className="h-4 bg-white/10 rounded w-full" /></div>
                    <div className="space-y-2"><div className="h-3 bg-white/5 rounded w-20" /><div className="h-4 bg-white/10 rounded w-32" /></div>
                </div>
                <div className="border-t border-white/10 pt-lg">
                    <div className="h-5 bg-white/10 rounded w-28 mb-md" />
                    <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="h-12 bg-white/10 rounded-2xl" />
            </div>
        </Card>
    </div>
);

const SuspendedUserProfile = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getSuspendedUserById(id);
                if (response.success) {
                    setData(response.data);
                } else {
                    throw new Error(response.message || 'Failed to load user');
                }
            } catch (err) {
                setError(err.message);
                toast.error('Error', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Error state — navigate back with option
    if (!loading && error) {
        return (
            <MainLayout
                user={{ name: 'Alex Johnson', role: 'admin' }}
                pageTitle="Suspended Users"
                verificationCount={mockRequests.length}
            >
                <div className="flex flex-col items-center justify-center py-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-state-error/10 flex items-center justify-center mb-lg">
                        <ShieldAlert size={28} className="text-state-error" />
                    </div>
                    <h2 className="text-heading-small text-text-primary font-inter mb-sm">Unable to Load Profile</h2>
                    <p className="text-body-small text-text-secondary font-inter mb-lg max-w-md">{error}</p>
                    <button
                        onClick={() => navigate('/suspended-users')}
                        className="h-11 px-8 rounded-2xl bg-primary-blue text-white font-inter font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                    >
                        Back to Suspended Users
                    </button>
                </div>
            </MainLayout>
        );
    }

    const user = data?.user || {};
    const suspension = data?.suspension || {};

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Suspended Users"
            verificationCount={mockRequests.length}
        >
            {/* ── Loading Skeleton ────────────────────────────── */}
            {loading && <ProfileSkeleton />}

            {/* ── Loaded Content ──────────────────────────────── */}
            {!loading && data && (
                <>
                    {/* ── Account Status Banner ─────────────────────── */}
                    <div className={`w-full rounded-2xl border ${suspension.status === 'REACTIVATED' ? 'border-state-success/30 bg-state-success/10' : 'border-state-error/30 bg-state-error/10'} backdrop-blur-sm px-lg py-md mb-lg`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
                            <div className="flex items-start gap-md">
                                <div className={`w-8 h-8 rounded-full ${suspension.status === 'REACTIVATED' ? 'bg-state-success/20' : 'bg-state-error/20'} flex items-center justify-center shrink-0 mt-0.5`}>
                                    {suspension.status === 'REACTIVATED' ? (
                                        <ShieldCheck size={18} className="text-state-success" />
                                    ) : (
                                        <ShieldAlert size={18} className="text-state-error" />
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-body-medium-bold ${suspension.status === 'REACTIVATED' ? 'text-state-success' : 'text-state-error'} font-inter`}>
                                        {suspension.status === 'REACTIVATED' ? 'Account Reactivated' : 'Account Suspended'}
                                    </h3>
                                    <p className="text-body-extra-small text-text-secondary font-inter mt-xs">
                                        {suspension.status === 'REACTIVATED'
                                            ? 'This user\'s account has been reactivated and full access has been restored.'
                                            : (user.role === 'Business' 
                                                ? 'This business\'s access to the platform has been revoked due to policy violations. Reactivation requires administrator approval.'
                                                : 'This user\'s access to all university digital services (LMS, Library, Email) has been revoked. Reactivation requires administrator approval.')}
                                    </p>
                                </div>
                            </div>
                            <span className={`text-body-extra-small ${suspension.status === 'REACTIVATED' ? 'text-state-success/80' : 'text-state-error/80'} font-inter whitespace-nowrap shrink-0`}>
                                {suspension.status === 'REACTIVATED' 
                                    ? `Restored recently` 
                                    : suspension.suspendedDaysAgo != null ? `Suspended ${suspension.suspendedDaysAgo} days ago` : ''}
                            </span>
                        </div>
                    </div>

                    {/* ── Two-Column Layout ───────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                        {/* ── Left Card: Profile ──────────────── */}
                        <Card variant="card" padding="p-0">
                            <div className="p-lg">
                                {/* Profile Header */}
                                <div className="flex flex-col items-center text-center mb-lg">
                                    <div className="relative mb-md">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                                            alt={user.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                                        />
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-state-error text-white text-[10px] font-bold font-inter px-2 py-0.5 rounded uppercase tracking-wider">
                                            {suspension.status === 'REACTIVATED' ? 'Restored' : 'Suspended'}
                                        </span>
                                    </div>
                                    <h2 className="text-heading-small text-text-primary font-inter">{user.name || 'Unknown User'}</h2>
                                    <p className="text-body-small text-text-secondary font-inter">
                                        {user.role === 'Business' ? 'Business ID' : 'Student ID'}: {user.studentId || '—'}
                                    </p>
                                </div>

                                {/* Details Grid */}
                                <div className="border-t border-white/10">
                                    <div className="flex items-center justify-between py-md border-b border-white/5">
                                        <span className="text-body-small text-text-secondary font-inter">
                                            {user.role === 'Business' ? 'Category' : 'Faculty'}
                                        </span>
                                        <span className="text-body-small-bold text-text-primary font-inter">{user.faculty || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-md border-b border-white/5">
                                        <span className="text-body-small text-text-secondary font-inter">
                                            {user.role === 'Business' ? 'Business Owner' : 'Department'}
                                        </span>
                                        <span className="text-body-small-bold text-text-primary font-inter">{user.department || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-md border-b border-white/5">
                                        <span className="text-body-small text-text-secondary font-inter">
                                            {user.role === 'Business' ? 'NIC Number' : 'Year'}
                                        </span>
                                        <span className="text-body-small-bold text-text-primary font-inter">{user.year || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-md">
                                        <span className="text-body-small text-text-secondary font-inter">
                                            {user.role === 'Business' ? 'Average Rating' : 'GPA'}
                                        </span>
                                        <span className="text-body-small-bold text-text-primary font-inter">
                                            {user.gpa || '—'}
                                            {user.role === 'Business' && user.gpa && ' / 5.0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                                    <h4 className="text-body-medium-bold text-text-primary font-inter mb-md">Contact Information</h4>
                                    <div className="flex flex-col gap-md">
                                        <div className="flex items-center gap-md">
                                            <Mail size={16} className="text-text-secondary shrink-0" />
                                            <span className="text-body-small text-text-secondary font-inter truncate">{user.email || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-md">
                                            <Phone size={16} className="text-text-secondary shrink-0" />
                                            <span className="text-body-small text-text-secondary font-inter">{user.phone || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-md">
                                            <MapPin size={16} className="text-text-secondary shrink-0" />
                                            <span className="text-body-small text-text-secondary font-inter">{user.address || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* ── Right Card: Suspension Details ─────────── */}
                        <Card variant="card" padding="p-0">
                            <div className="p-lg">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-lg">
                                    <div className="flex items-center gap-sm">
                                        <AlertTriangle size={20} className="text-state-warning" />
                                        <h3 className="text-body-large-bold text-text-primary font-inter">Suspension Details</h3>
                                    </div>
                                    <span className={`text-body-extra-small-bold px-sm py-xs rounded-lg ${severityColors[suspension.severity] || 'bg-white/10 text-text-secondary'}`}>
                                        Severity: {suspension.severity || '—'}
                                    </span>
                                </div>

                                {/* Case Reference */}
                                <p className="text-body-small text-text-secondary font-inter mb-lg">
                                    Case Reference: <span className="text-text-primary font-semibold">{suspension.caseRef || '—'}</span>
                                </p>

                                {/* Reason + Date */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg mb-lg">
                                    <div>
                                        <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Reason for Suspension</p>
                                        <p className="text-body-small text-text-primary font-inter leading-relaxed">{suspension.reason || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Effective Date</p>
                                        <div className="flex items-center gap-xs">
                                            <Calendar size={14} className="text-text-secondary" />
                                            <span className="text-body-small text-text-primary font-inter">{formatDate(suspension.effectiveDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Notes */}
                                <div className="border-t border-white/10 pt-lg mb-lg">
                                    <div className="flex items-center gap-sm mb-md">
                                        <span className="text-body-extra-small">📋</span>
                                        <h4 className="text-body-medium-bold text-text-primary font-inter">Admin Notes</h4>
                                    </div>
                                    <div className="rounded-xl bg-state-warning/10 border border-state-warning/20 p-md">
                                        <p className="text-body-small text-text-secondary font-inter leading-relaxed italic">
                                            {suspension.adminNotes || 'No admin notes available.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/10 pt-lg">
                                    {/* Reactivate Account Button — only show for active suspensions */}
                                    {suspension.status !== 'REACTIVATED' ? (
                                        <button
                                            onClick={() => navigate(`/suspended-users/${id}/reactivate`)}
                                            className="w-full h-12 rounded-2xl bg-state-warning text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-warning/30 hover:shadow-xl hover:shadow-state-warning/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                                        >
                                            Reactivate Account
                                        </button>
                                    ) : (
                                        <div className="w-full h-12 rounded-2xl bg-state-success/15 border border-state-success/30 text-state-success font-inter font-bold text-sm flex items-center justify-center gap-2.5">
                                            ✓ Account Already Reactivated
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </MainLayout>
    );
};

export default SuspendedUserProfile;
