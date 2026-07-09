import React from 'react';

const Badge = ({ type, value, className = '' }) => {
  let colors = 'bg-white/10 text-text-secondary border border-white/20'; // Default fallback

  if (type === 'reason') {
    switch (value) {
      case 'ToS Violation':
        colors = 'bg-state-error/15 text-state-error border border-state-error/30';
        break;
      case 'Payment Failure':
        colors = 'bg-state-warning/15 text-state-warning border border-state-warning/30';
        break;
      case 'Suspicious Activity':
        colors = 'bg-primary-accent/15 text-primary-accent border border-primary-accent/30';
        break;
      case 'Harassment':
        colors = 'bg-state-error/15 text-state-error border border-state-error/30';
        break;
      default:
        colors = 'bg-white/10 text-text-secondary border border-white/20';
    }
  } else if (type === 'severity') {
    switch (value) {
      case 'Critical':
        colors = 'bg-state-error/15 text-state-error border border-state-error/30';
        break;
      case 'High':
        colors = 'bg-state-warning/15 text-state-warning border border-state-warning/30';
        break;
      case 'Medium':
        colors = 'bg-primary-blue/15 text-primary-blue border border-primary-blue/30';
        break;
      case 'Low':
        colors = 'bg-state-success/15 text-state-success border border-state-success/30';
        break;
      default:
        colors = 'bg-white/10 text-text-secondary border border-white/20';
    }
  }

  return (
    <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg whitespace-nowrap shrink-0 ${colors} ${className}`}>
      {type === 'reason' && (
        <span className="text-[10px] mr-1">
          {value === 'ToS Violation' && '🔥'}
          {value === 'Payment Failure' && '💳'}
          {value === 'Suspicious Activity' && '⚠️'}
          {value === 'Harassment' && '🚫'}
        </span>
      )}
      {value}
    </span>
  );
};

export default Badge;
