import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { AlertTriangle, Calendar, Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { suspendedUsers, severityColors } from '../data/mockSuspendedUsers';

const SuspendedUserProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = suspendedUsers.find((u) => u.id === id) || suspendedUsers[0];

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Suspended Users"
            verificationCount={mockRequests.length}
        >
            {/* ── Account Suspended Banner ─────────────────────── */}
            <div className="w-full rounded-2xl border border-state-error/30 bg-state-error/10 backdrop-blur-sm px-lg py-md mb-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
                    <div className="flex items-start gap-md">
                        <div className="w-8 h-8 rounded-full bg-state-error/20 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldAlert size={18} className="text-state-error" />
                        </div>
                        <div>
                            <h3 className="text-body-medium-bold text-state-error font-inter">Account Suspended</h3>
                            <p className="text-body-extra-small text-text-secondary font-inter mt-xs">
                                This user's access to all university digital services (LMS, Library, Email) has been revoked. Reactivation requires administrator approval.
                            </p>
                        </div>
                    </div>
                    <span className="text-body-extra-small text-state-error/80 font-inter whitespace-nowrap shrink-0">
                        Suspended {user.suspendedDaysAgo} days ago
                    </span>
                </div>
            </div>

            {/* ── Two-Column Layout ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                {/* ── Left Card: Student Profile ──────────────── */}
                <Card variant="card" padding="p-0">
                    <div className="p-lg">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center mb-lg">
                            <div className="relative mb-md">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                                />
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-state-error text-white text-[10px] font-bold font-inter px-2 py-0.5 rounded uppercase tracking-wider">
                                    Suspended
                                </span>
                            </div>
                            <h2 className="text-heading-small text-text-primary font-inter">{user.name}</h2>
                            <p className="text-body-small text-text-secondary font-inter">Student ID: {user.studentId}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="border-t border-white/10">
                            <div className="flex items-center justify-between py-md border-b border-white/5">
                                <span className="text-body-small text-text-secondary font-inter">Faculty</span>
                                <span className="text-body-small-bold text-text-primary font-inter">{user.faculty}</span>
                            </div>
                            <div className="flex items-center justify-between py-md border-b border-white/5">
                                <span className="text-body-small text-text-secondary font-inter">Department</span>
                                <span className="text-body-small-bold text-text-primary font-inter">{user.department}</span>
                            </div>
                            <div className="flex items-center justify-between py-md border-b border-white/5">
                                <span className="text-body-small text-text-secondary font-inter">Year</span>
                                <span className="text-body-small-bold text-text-primary font-inter">{user.year}</span>
                            </div>
                            <div className="flex items-center justify-between py-md">
                                <span className="text-body-small text-text-secondary font-inter">GPA</span>
                                <span className="text-body-small-bold text-text-primary font-inter">{user.gpa}</span>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                            <h4 className="text-body-medium-bold text-text-primary font-inter mb-md">Contact Information</h4>
                            <div className="flex flex-col gap-md">
                                <div className="flex items-center gap-md">
                                    <Mail size={16} className="text-text-secondary shrink-0" />
                                    <span className="text-body-small text-text-secondary font-inter truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <Phone size={16} className="text-text-secondary shrink-0" />
                                    <span className="text-body-small text-text-secondary font-inter">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <MapPin size={16} className="text-text-secondary shrink-0" />
                                    <span className="text-body-small text-text-secondary font-inter">{user.address}</span>
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
                            <span className={`text-body-extra-small-bold px-sm py-xs rounded-lg ${severityColors[user.severity] || 'bg-white/10 text-text-secondary'}`}>
                                Severity: {user.severity}
                            </span>
                        </div>

                        {/* Case Reference */}
                        <p className="text-body-small text-text-secondary font-inter mb-lg">
                            Case Reference: <span className="text-text-primary font-semibold">{user.caseRef}</span>
                        </p>

                        {/* Reason + Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg mb-lg">
                            <div>
                                <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Reason for Suspension</p>
                                <p className="text-body-small text-text-primary font-inter leading-relaxed">{user.reason}</p>
                            </div>
                            <div>
                                <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Effective Date</p>
                                <div className="flex items-center gap-xs">
                                    <Calendar size={14} className="text-text-secondary" />
                                    <span className="text-body-small text-text-primary font-inter">{user.effectiveDate}</span>
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
                                    {user.adminNotes}
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10 pt-lg">
                            {/* Reactivate Account Button */}
                            <button
                                onClick={() => navigate(`/suspended-users/${user.id}/reactivate`)}
                                className="w-full h-12 rounded-2xl bg-state-warning text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-warning/30 hover:shadow-xl hover:shadow-state-warning/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                            >
                                Reactivate Account
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default SuspendedUserProfile;
