import React from 'react';

const VerificationStatusHeader = ({ config, submissionStatus }) => {
  if (submissionStatus === 'idle' || !config) return null;

  return (
    <div className="text-center mb-6">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${config.iconBg} ${config.iconBorder}`}>
        {config.icon}
      </div>
      <h1 className="text-xl sm:text-heading-medium font-bold text-white mb-2">
        Club Verification
      </h1>
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.badgeBg} ${config.badgeBorder}`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.badgeDot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.badgeDot}`} />
        </span>
        <span className={`text-xs font-bold ${config.badgeText}`}>{config.badgeLabel}</span>
      </div>
    </div>
  );
};

export default VerificationStatusHeader;
