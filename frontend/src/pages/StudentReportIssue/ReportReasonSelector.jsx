import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const reportReasons = [
  { id: 'inappropriate', label: 'Inappropriate Content', description: 'Contains offensive or adult material' },
  { id: 'spam', label: 'Spam', description: 'Promotional, repetitive or irrelevant content' },
  { id: 'harassment', label: 'Harassment or Bullying', description: 'Targeted attacks or abusive behavior' },
  { id: 'misinformation', label: 'Misinformation', description: 'False or misleading academic information' },
];

const ReportReasonSelector = ({ selectedReason, setSelectedReason, error }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[12px] font-bold">2</span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white font-inter">
        Why are you reporting this? <span className="text-state-error text-xs font-normal ml-1">*Required</span>
      </h3>
    </div>
    {error && <p className="text-state-error text-[10px] mb-2 px-1">{error}</p>}
    <div className="flex flex-col gap-2.5">
      {reportReasons.map((reason) => {
        const isSelected = selectedReason === reason.id;
        return (
          <button
            key={reason.id}
            onClick={() => setSelectedReason(reason.id)}
            className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
              isSelected ? 'border-primary-blue/60 bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary-blue' : 'border-white/30'}`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-white font-inter">{reason.label}</span>
              <span className="text-[11px] sm:text-xs text-text-secondary font-inter mt-0.5">{reason.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default ReportReasonSelector;
