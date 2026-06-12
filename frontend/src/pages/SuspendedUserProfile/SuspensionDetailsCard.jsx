import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { AlertTriangle, Calendar } from 'lucide-react';

const formatDate = (dateStr) => {
    if (!dateStr) return '\u2014';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SuspensionDetailsCard = ({ suspension, onReactivate }) => (
    <Card variant="card" padding="p-0">
        <div className="p-lg">
            <div className="flex items-start justify-between mb-lg">
                <div className="flex items-center gap-sm">
                    <AlertTriangle size={20} className="text-state-warning" />
                    <h3 className="text-body-large-bold text-text-primary font-inter">Suspension Details</h3>
                </div>
                <Badge type="severity" value={suspension.severity} />
            </div>

            <p className="text-body-small text-text-secondary font-inter mb-lg">
                Case Reference: <span className="text-text-primary font-semibold">{suspension.caseRef || '\u2014'}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg mb-lg">
                <div>
                    <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Reason for Suspension</p>
                    <p className="text-body-small text-text-primary font-inter leading-relaxed">{suspension.reason || '\u2014'}</p>
                </div>
                <div>
                    <p className="text-body-extra-small text-text-secondary font-inter mb-xs">Effective Date</p>
                    <div className="flex items-center gap-xs">
                        <Calendar size={14} className="text-text-secondary" />
                        <span className="text-body-small text-text-primary font-inter">{formatDate(suspension.effectiveDate)}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-lg mb-lg">
                <div className="flex items-center gap-sm mb-md">
                    <span className="text-body-extra-small">{'\uD83D\uDCCB'}</span>
                    <h4 className="text-body-medium-bold text-text-primary font-inter">Admin Notes</h4>
                </div>
                <div className="rounded-xl bg-state-warning/10 border border-state-warning/20 p-md">
                    <p className="text-body-small text-text-secondary font-inter leading-relaxed italic">
                        {suspension.adminNotes || 'No admin notes available.'}
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10 pt-lg">
                {suspension.status !== 'REACTIVATED' ? (
                    <button
                        onClick={onReactivate}
                        className="w-full h-12 rounded-2xl bg-state-warning text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-warning/30 hover:shadow-xl hover:shadow-state-warning/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                    >
                        Reactivate Account
                    </button>
                ) : (
                    <div className="w-full h-12 rounded-2xl bg-state-success/15 border border-state-success/30 text-state-success font-inter font-bold text-sm flex items-center justify-center gap-2.5">
                        {'\u2713'} Account Already Reactivated
                    </div>
                )}
            </div>
        </div>
    </Card>
);

export default SuspensionDetailsCard;
