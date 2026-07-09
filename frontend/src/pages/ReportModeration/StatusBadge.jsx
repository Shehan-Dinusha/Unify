import React from 'react';

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

const StatusBadge = ({ status }) => {
    const displayLabel = status === 'In Progress' ? 'In Review' : status;
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${map[status] || map.Pending}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status] || 'bg-text-secondary'}`} />
            {displayLabel}
        </span>
    );
};

export default StatusBadge;
