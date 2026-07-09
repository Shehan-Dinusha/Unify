import React from 'react';

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

const ReportTable = ({ reports, loading, error, onViewDetails }) => {
  if (loading || error) return null;

  return (
    <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg hidden md:block">
      <div className="grid gap-md px-lg py-md border-b border-white/10" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr' }}>
        <span className="text-body-small-bold text-text-secondary">Report Title</span>
        <span className="text-body-small-bold text-text-secondary">Category</span>
        <span className="text-body-small-bold text-text-secondary">Date Submitted</span>
        <span className="text-body-small-bold text-text-secondary">Status</span>
        <span className="text-body-small-bold text-text-secondary text-right">Actions</span>
      </div>

      {reports.map((report, idx) => (
        <div key={report.id} className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < reports.length - 1 ? 'border-b border-white/5' : ''}`} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr' }}>
          <div className="min-w-0">
            <p className="text-body-medium-bold text-text-primary truncate">{report.title}</p>
            <p className="text-body-extra-small text-text-secondary truncate">ID: {report.reportId}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{report.categoryIcon}</span>
            <span className="text-body-small text-text-secondary truncate">{report.category}</span>
          </div>
          <span className="text-body-small text-text-secondary">{report.dateSubmitted}</span>
          <div>
            <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg ${getStatusStyle(report.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(report.status)}`} />
              {getStatusLabel(report.status)}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={() => onViewDetails(report.id)}
              className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      {reports.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-text-secondary text-body-medium font-inter">No reports found</p>
          <p className="text-text-tertiary text-body-small font-inter mt-1">Try adjusting your filters or submit a new report.</p>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
