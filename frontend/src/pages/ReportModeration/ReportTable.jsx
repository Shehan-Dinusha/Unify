import React from 'react';
import { getAvatarUrl } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';

const ReportTable = ({ reports, loading, error, onViewDetails }) => (
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
                    <button onClick={() => onViewDetails(r)} className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200">
                        View Details
                    </button>
                </div>
            </div>
        ))}
        {!loading && !error && reports.length === 0 && (
            <div className="px-lg py-12 text-center text-body-small text-text-secondary">No reports found matching the current filters.</div>
        )}
    </div>
);

export default ReportTable;
