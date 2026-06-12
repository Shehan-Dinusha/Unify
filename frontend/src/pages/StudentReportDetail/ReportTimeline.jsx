import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';

const ReportTimeline = ({ timeline, status, statusLabel }) => {
  const resolvedLabel = status === 'In Progress' ? 'In Review' : (statusLabel || status);

  if (!timeline) return null;

  return (
    <>
      <button className={`w-full py-4 rounded-[100px] border flex items-center justify-center gap-2 font-inter text-sm font-bold shadow-lg ${
        status === 'Resolved'
          ? 'border-state-success/30 bg-state-success/10 text-state-success shadow-state-success/5'
          : status === 'Dismissed'
          ? 'border-state-error/30 bg-state-error/10 text-state-error shadow-state-error/5'
          : status === 'Withdrawn'
          ? 'border-white/20 bg-white/10 text-text-secondary shadow-white/5'
          : status === 'In Progress' || status === 'In Review'
          ? 'border-state-warning/30 bg-state-warning/10 text-state-warning shadow-state-warning/5'
          : 'border-primary-blue/30 bg-primary-blue/10 text-primary-blue shadow-primary-blue/5'
      }`}>
        {status === 'Resolved' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
        Status: {resolvedLabel}
      </button>

      <Card variant="card" padding="p-6">
        <h3 className="text-lg font-bold text-white font-inter mb-6">Report Timeline</h3>
        <div className="flex flex-col">
          {timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-6 last:pb-0 relative">
              {idx < timeline.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-0 w-px bg-white/10" />
              )}
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1 z-10 ${
                step.status === 'completed' ? 'bg-state-success' :
                step.status === 'active' ? 'bg-primary-blue shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10'
              }`}>
                {step.status === 'completed' && <CheckCircle2 size={10} className="text-white" />}
                {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold font-inter ${step.status === 'active' ? 'text-primary-blue' : 'text-white'}`}>{step.label}</p>
                <p className="text-[10px] text-text-tertiary font-inter uppercase tracking-wider mb-1">{step.date}</p>
                {step.description && (
                  <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default ReportTimeline;
