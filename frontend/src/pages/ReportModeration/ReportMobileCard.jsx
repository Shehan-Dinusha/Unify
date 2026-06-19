import React from 'react';
import Card from '../../components/common/Card';
import { getAvatarUrl } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';

const ReportMobileCard = ({ report, onViewDetails }) => (
    <Card variant="container" className="hover:bg-white/5 transition-colors">
        <div className="flex flex-col gap-md">
            <div className="flex items-center gap-md">
                <img src={getAvatarUrl(report.reportedUser.avatar, report.reportedUser.name)} alt={report.reportedUser.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                <div className="min-w-0 flex-1">
                    <p className="text-body-medium-bold text-text-primary truncate">{report.reportedUser.name}</p>
                    <p className="text-body-extra-small text-text-secondary truncate">{report.reportedUser.handle} &bull; #{report.id}</p>
                </div>
                <StatusBadge status={report.status} />
            </div>
            <div className="flex items-center justify-between">
                <TypeBadge type={report.type} />
                <span className="text-body-extra-small text-text-secondary">{report.date}</span>
            </div>
            <button onClick={() => onViewDetails(report)} className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center">
                View Details
            </button>
        </div>
    </Card>
);

const ReportMobileCards = ({ reports, loading, error, onViewDetails }) => (
    <div className="grid grid-cols-1 gap-md md:hidden">
        {!loading && !error && reports.map(r => (
            <ReportMobileCard key={r.id} report={r} onViewDetails={onViewDetails} />
        ))}
        {!loading && !error && reports.length === 0 && (
            <div className="p-8 text-center text-body-small text-text-secondary">No reports found.</div>
        )}
    </div>
);

export default ReportMobileCards;
