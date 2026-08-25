import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ConversionFunnel = ({ funnel }) => {
  const { impressions, clicks, clicksRate, purchases, purchasesRate } = funnel;
  const maxBar = impressions || 1;

  const items = [
    { label: 'Impressions', value: (impressions || 0).toLocaleString(), rate: null, width: 100, color: 'bg-primary-blue' },
    { label: 'Clicks', value: (clicks || 0).toLocaleString(), rate: clicksRate, width: (clicks / maxBar) * 100, color: 'bg-primary-blue' },
    { label: 'Purchase', value: (purchases || 0).toLocaleString(), rate: purchasesRate, width: (purchases / maxBar) * 100, color: 'bg-primary-blue' },
  ];

  return (
    <div className="flex flex-col gap-lg">
      {items.map((item, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between mb-xs">
            <span className="text-body-small text-text-secondary font-inter">{item.label}</span>
            <div className="flex items-center gap-xs">
              <span className="text-body-small-bold text-text-primary font-inter">{item.value}</span>
              {item.rate && <span className="text-body-extra-small-bold text-state-success font-inter">{item.rate}</span>}
            </div>
          </div>
          <div className="w-full h-8 bg-white/5 rounded-lg overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-center`}
              style={{ width: `${item.width}%` }}
            >
              {idx === items.length - 1 && <CheckCircle2 size={14} className="text-white" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversionFunnel;
