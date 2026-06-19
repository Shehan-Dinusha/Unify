import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SuspendedBanner = () => (
  <div className="mb-lg p-lg rounded-2xl bg-state-error/10 border border-state-error/30 flex items-center gap-md animate-pulse">
    <div className="w-12 h-12 rounded-full bg-state-error/20 flex items-center justify-center">
      <AlertTriangle size={24} className="text-state-error" />
    </div>
    <div>
      <p className="text-body-large-bold text-state-error font-inter uppercase tracking-wider">Business Suspended</p>
      <p className="text-body-small text-text-secondary font-inter">This business has been restricted. All active ads and campaigns are currently hidden.</p>
    </div>
  </div>
);

export default SuspendedBanner;
