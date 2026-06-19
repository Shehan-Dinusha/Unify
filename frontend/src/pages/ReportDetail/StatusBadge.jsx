const StatusBadge = ({ status }) => {
    const map = {
        Pending:          'bg-state-error/20 text-state-error border-state-error/30',
        'Pending Review': 'bg-state-warning/20 text-state-warning border-state-warning/30',
        'In Review':      'bg-state-warning/20 text-state-warning border-state-warning/30',
        'In Progress':    'bg-primary-blue/20 text-primary-blue border-primary-blue/30',
        Resolved:         'bg-state-success/20 text-state-success border-state-success/30',
        Dismissed:        'bg-white/10 text-text-secondary border-white/20',
    };
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${map[status] || map.Pending}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'Pending' ? 'bg-state-error' :
                (status === 'Pending Review' || status === 'In Review') ? 'bg-state-warning' :
                status === 'In Progress' ? 'bg-primary-blue' :
                status === 'Resolved' ? 'bg-state-success' : 'bg-text-secondary'
            }`} />
            {status}
        </span>
    );
};

export default StatusBadge;
