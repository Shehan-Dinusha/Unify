import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { X, ShieldCheck, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { mockRequests } from '../data/mockData';
import { suspendedUsers } from '../data/mockSuspendedUsers';

const SuspendedUserReactivation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = suspendedUsers.find((u) => u.id === id) || suspendedUsers[0];

    const [identityVerified, setIdentityVerified] = useState(true);
    const [securityAudit, setSecurityAudit] = useState(false);
    const [internalNote, setInternalNote] = useState('');

    const handleReactivate = () => {
        navigate(`/suspended-users/${user.id}/success`);
    };

    const handleCancel = () => {
        navigate(`/suspended-users/${user.id}`);
    };

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Account Reactivation"
            verificationCount={mockRequests.length}
        >
            {/* ── Blur Overlay Modal ──────────────────────────── */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
                <Card variant="card" padding="p-0" className="w-full max-w-[520px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl my-auto">
                    {/* Header */}
                    <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <ShieldCheck size={18} className="text-text-secondary" />
                            </div>
                            <h2 className="text-body-large-bold text-text-primary font-inter">Confirm Account Reactivation</h2>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="px-6 sm:px-8 mb-4">
                        <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-md">
                            <div className="flex items-center gap-md">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                                />
                                <div>
                                    <p className="text-body-medium-bold text-text-primary font-inter">{user.name}</p>
                                    <p className="text-body-extra-small text-text-secondary font-inter">Student</p>
                                </div>
                            </div>
                            <span className="text-body-extra-small-bold text-state-error bg-state-error/15 border border-state-error/30 px-sm py-xs rounded-lg">
                                Suspended
                            </span>
                        </div>
                    </div>

                    {/* Original Suspension Reason */}
                    <div className="px-6 sm:px-8 mb-4">
                        <div className="rounded-xl bg-state-warning/10 border border-state-warning/20 p-md">
                            <div className="flex items-start gap-sm mb-sm">
                                <AlertTriangle size={16} className="text-state-warning shrink-0 mt-0.5" />
                                <p className="text-body-small-bold text-state-warning font-inter">Original Suspension Reason</p>
                            </div>
                            <p className="text-body-small text-text-secondary font-inter leading-relaxed pl-6">
                                {user.adminNotes.replace(/"/g, '')}
                            </p>
                            <p className="text-body-extra-small text-primary-blue font-inter mt-sm pl-6">
                                Action taken on {user.effectiveDate} by {user.adminAction}
                            </p>
                        </div>
                    </div>

                    {/* Required Validations */}
                    <div className="px-6 sm:px-8 mb-4">
                        <p className="text-body-small text-text-secondary font-inter mb-md">Required Validations</p>

                        {/* Identity Verification */}
                        <button
                            onClick={() => setIdentityVerified(!identityVerified)}
                            className="flex items-start gap-md mb-md w-full text-left"
                        >
                            {identityVerified ? (
                                <CheckSquare size={18} className="text-primary-blue shrink-0 mt-0.5" />
                            ) : (
                                <Square size={18} className="text-text-secondary shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="text-body-small-bold text-text-primary font-inter">Identity Verification Complete</p>
                                <p className="text-body-extra-small text-text-secondary font-inter">Confirmed via university email channel.</p>
                            </div>
                        </button>

                        {/* Security Audit */}
                        <button
                            onClick={() => setSecurityAudit(!securityAudit)}
                            className="flex items-start gap-md w-full text-left"
                        >
                            {securityAudit ? (
                                <CheckSquare size={18} className="text-primary-blue shrink-0 mt-0.5" />
                            ) : (
                                <Square size={18} className="text-text-secondary shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="text-body-small-bold text-text-primary font-inter">Security Audit Passed</p>
                                <p className="text-body-extra-small text-text-secondary font-inter">Logs reviewed for secondary breaches.</p>
                            </div>
                        </button>
                    </div>

                    {/* Internal Note */}
                    <div className="px-6 sm:px-8 mb-4">
                        <p className="text-body-small-bold text-text-primary font-inter mb-sm">Internal reactivation Note (Optional)</p>
                        <textarea
                            className="w-full h-20 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all font-inter text-sm text-text-primary placeholder:text-text-tertiary px-4 py-3 resize-none focus:border-primary-blue/50 focus:bg-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]"
                            placeholder="Add remarks about the restoration...."
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                            onClick={handleCancel}
                            className="h-11 sm:h-12 px-8 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReactivate}
                            className="h-11 sm:h-12 px-8 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                        >
                            <ShieldCheck size={18} /> Reactivate Account
                        </button>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default SuspendedUserReactivation;
