import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const AccountStatusBanner = ({ suspension, user }) => {
    const isReactivated = suspension.status === 'REACTIVATED';
    return (
        <div className={`w-full rounded-2xl border ${isReactivated ? 'border-state-success/30 bg-state-success/10' : 'border-state-error/30 bg-state-error/10'} backdrop-blur-sm px-lg py-md mb-lg`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
                <div className="flex items-start gap-md">
                    <div className={`w-8 h-8 rounded-full ${isReactivated ? 'bg-state-success/20' : 'bg-state-error/20'} flex items-center justify-center shrink-0 mt-0.5`}>
                        {isReactivated ? (
                            <ShieldCheck size={18} className="text-state-success" />
                        ) : (
                            <ShieldAlert size={18} className="text-state-error" />
                        )}
                    </div>
                    <div>
                        <h3 className={`text-body-medium-bold ${isReactivated ? 'text-state-success' : 'text-state-error'} font-inter`}>
                            {isReactivated ? 'Account Reactivated' : 'Account Suspended'}
                        </h3>
                        <p className="text-body-extra-small text-text-secondary font-inter mt-xs">
                            {isReactivated
                                ? 'This user\'s account has been reactivated and full access has been restored.'
                                : (user.role === 'Business'
                                    ? 'This business\'s access to the platform has been revoked due to policy violations. Reactivation requires administrator approval.'
                                    : 'This user\'s access to all university digital services (LMS, Library, Email) has been revoked. Reactivation requires administrator approval.')}
                        </p>
                    </div>
                </div>
                <span className={`text-body-extra-small ${isReactivated ? 'text-state-success/80' : 'text-state-error/80'} font-inter whitespace-nowrap shrink-0`}>
                    {isReactivated
                        ? 'Restored recently'
                        : suspension.suspendedDaysAgo != null ? `Suspended ${suspension.suspendedDaysAgo} days ago` : ''}
                </span>
            </div>
        </div>
    );
};

export default AccountStatusBanner;
