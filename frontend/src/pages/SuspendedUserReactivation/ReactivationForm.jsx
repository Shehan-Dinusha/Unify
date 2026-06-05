import React from 'react';
import Button from '../../components/common/Button';
import { X, ShieldCheck, AlertTriangle, CheckSquare, Square, Loader2 } from 'lucide-react';

const formatDate = (dateStr) => {
    if (!dateStr) return '\u2014';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ReactivationForm = ({
    user, suspension, submitting,
    identityVerified, onToggleIdentity,
    securityAudit, onToggleSecurity,
    internalNote, onNoteChange,
    onReactivate, onCancel,
}) => (
    <>
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-text-secondary" />
                </div>
                <h2 className="text-body-large-bold text-text-primary font-inter">Confirm Account Reactivation</h2>
            </div>
            <button onClick={onCancel} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all">
                <X size={18} />
            </button>
        </div>

        <div className="px-6 sm:px-8 mb-4">
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-md">
                <div className="flex items-center gap-md">
                    <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div>
                        <p className="text-body-medium-bold text-text-primary font-inter">{user.name || 'Unknown'}</p>
                        <p className="text-body-extra-small text-text-secondary font-inter">Student</p>
                    </div>
                </div>
                <span className="text-body-extra-small-bold text-state-error bg-state-error/15 border border-state-error/30 px-sm py-xs rounded-lg">
                    Suspended
                </span>
            </div>
        </div>

        <div className="px-6 sm:px-8 mb-4">
            <div className="rounded-xl bg-state-warning/10 border border-state-warning/20 p-md">
                <div className="flex items-start gap-sm mb-sm">
                    <AlertTriangle size={16} className="text-state-warning shrink-0 mt-0.5" />
                    <p className="text-body-small-bold text-state-warning font-inter">Original Suspension Reason</p>
                </div>
                <p className="text-body-small text-text-secondary font-inter leading-relaxed pl-6">
                    {(suspension.adminNotes || suspension.reason || '\u2014').replace(/"/g, '')}
                </p>
                <p className="text-body-extra-small text-primary-blue font-inter mt-sm pl-6">
                    {suspension.adminAction || `Action taken on ${formatDate(suspension.effectiveDate)}`}
                </p>
            </div>
        </div>

        <div className="px-6 sm:px-8 mb-4">
            <p className="text-body-small text-text-secondary font-inter mb-md">Required Validations</p>

            <button onClick={onToggleIdentity} disabled={submitting} className="flex items-start gap-md mb-md w-full text-left disabled:opacity-50">
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

            <button onClick={onToggleSecurity} disabled={submitting} className="flex items-start gap-md w-full text-left disabled:opacity-50">
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

        <div className="px-6 sm:px-8 mb-4">
            <p className="text-body-small-bold text-text-primary font-inter mb-sm">Internal reactivation Note (Optional)</p>
            <textarea
                className="w-full h-20 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all font-inter text-sm text-text-primary placeholder:text-text-tertiary px-4 py-3 resize-none focus:border-primary-blue/50 focus:bg-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)] disabled:opacity-50"
                placeholder="Add remarks about the restoration...."
                value={internalNote}
                onChange={(e) => onNoteChange(e.target.value)}
                disabled={submitting}
            />
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button onClick={onCancel} disabled={submitting} className="h-11 sm:h-12 px-8 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
                Cancel
            </button>
            <Button onClick={onReactivate} disabled={submitting} variant="gradient" size="medium" className="h-11 sm:h-12 gap-2.5">
                {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Reactivating...</>
                ) : (
                    <><ShieldCheck size={18} /> Reactivate Account</>
                )}
            </Button>
        </div>
    </>
);

export default ReactivationForm;
