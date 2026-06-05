import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const ReportStatusBanner = ({ status }) => {
  if (!['Resolved', 'Dismissed', 'Withdrawn'].includes(status)) return null;

  return (
    <div className={`w-full p-5 rounded-[24px] border flex items-center gap-5 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 ${
      status === 'Resolved'
        ? 'bg-state-success/10 border-state-success/30 text-state-success shadow-lg shadow-state-success/5'
        : status === 'Dismissed'
        ? 'bg-state-error/10 border-state-error/30 text-state-error shadow-lg shadow-state-error/5'
        : 'bg-white/5 border-white/20 text-text-secondary'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
        status === 'Resolved' ? 'bg-state-success/20' : status === 'Dismissed' ? 'bg-state-error/20' : 'bg-white/10'
      }`}>
        {status === 'Resolved' ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold font-inter">This report is {status.toLowerCase()}.</h3>
        <p className="text-sm opacity-80 font-inter mt-1">
          {status === 'Resolved'
            ? 'The administration has reviewed and resolved your report. Thank you for helping keep our community safe.'
            : status === 'Dismissed'
            ? 'This report was reviewed and dismissed by the administration. No further action was deemed necessary.'
            : 'You have withdrawn this report. It is no longer being processed.'}
        </p>
      </div>
      <div className="hidden md:block">
        <span className="text-xs font-bold opacity-50 uppercase tracking-widest font-inter">Report Closed</span>
      </div>
    </div>
  );
};

export default ReportStatusBanner;
