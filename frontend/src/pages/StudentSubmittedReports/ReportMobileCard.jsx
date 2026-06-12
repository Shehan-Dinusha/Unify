import React from 'react';
import Card from '../../components/common/Card';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending Review': return 'text-state-warning bg-state-warning/10 border border-state-warning/30';
    case 'Resolved': return 'text-state-success bg-state-success/10 border border-state-success/30';
    case 'In Progress': return 'text-primary-blue bg-primary-blue/10 border border-primary-blue/30';
    case 'Withdrawn': return 'text-text-secondary bg-white/10 border border-white/20';
    case 'Dismissed': return 'text-state-error bg-state-error/10 border border-state-error/30';
    default: return 'text-text-secondary bg-white/10 border border-white/20';
  }
};

const getStatusLabel = (status) => status === 'In Progress' ? 'In Review' : status;

const getDotColor = (status) => {
  switch (status) {
    case 'Pending Review': return 'bg-state-warning';
    case 'Resolved': return 'bg-state-success';
    case 'In Progress': return 'bg-primary-blue';
    case 'In Review': return 'bg-purple-500';
    default: return 'bg-state-error';
  }
};

const ReportMobileCard = ({ reports, loading, error, onViewDetails }) => {
  if (loading || error) return null;

  return (
    <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
      {reports.map((report) => (
        <Card key={report.id} variant="container" className="hover:bg-white/5 transition-colors">
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-md">
              <div className="min-w-0 flex-1">
                <p className="text-body-medium-bold text-text-primary truncate">{report.title}</p>
                <p className="text-body-extra-small text-text-secondary truncate">ID: {report.reportId}</p>
              </div>
              <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${getStatusStyle(report.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(report.status)}`} />
                {getStatusLabel(report.status)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-text-secondary">{report.categoryIcon} {report.category}</span>
              <span className="text-body-extra-small text-text-secondary">{report.dateSubmitted}</span>
            </div>
            <button
              onClick={() => onViewDetails(report.id)}
              className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
            >
              View Details
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportMobileCard;
