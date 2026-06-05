import React from 'react';
import { CheckCircle2, Circle, Gauge, Repeat2, Palette, Globe, BarChart3, Clock } from 'lucide-react';
import Card from '../../components/common/Card';

const BoostPackageCard = ({ pkg, isSelected, onSelect }) => {
  const showBadge = pkg.badge === 'Premium';

  return (
    <Card variant="card" padding="p-lg" className={`cursor-pointer transition-all duration-200 ${
      isSelected ? 'border-primary-blue ring-1 ring-primary-blue/40' : 'hover:border-white/30'
    }`} onClick={() => onSelect(pkg.id)}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-md">
          <h3 className="text-body-large-bold text-text-primary font-inter">{pkg.name}</h3>
          {showBadge && (
            <span className="text-[10px] font-bold bg-white/10 text-text-secondary px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-white/10">
              BEST VALUE
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-heading-small md:text-heading-medium text-text-primary font-inter font-bold">
            Rs. {Number(pkg.price).toLocaleString()}
          </span>
          <span className="text-body-extra-small text-text-secondary font-inter"> / {pkg.duration}</span>
        </div>

        <p className="text-body-extra-small text-text-secondary font-inter mb-lg leading-relaxed">{pkg.description}</p>

        <div className="flex flex-col gap-sm mt-auto">
          {(pkg.features || []).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-sm">
              {isSelected ? (
                <CheckCircle2 size={16} className="text-state-success flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-text-secondary flex-shrink-0" />
              )}
              <span className="text-body-small text-text-soft font-inter">{feature}</span>
            </div>
          ))}
        </div>

        {pkg.boostConfig && (
          <div className="mt-md pt-md border-t border-white/10">
            <p className="text-[10px] text-text-tertiary font-inter font-bold uppercase tracking-wider mb-2">Engine Specs</p>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Gauge size={12} className="text-state-success flex-shrink-0" />
                <span className="text-text-secondary font-inter">Priority #{pkg.boostConfig.feedPriority || 10}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Repeat2 size={12} className="text-primary-blue flex-shrink-0" />
                <span className="text-text-secondary font-inter">{pkg.boostConfig.visibilityMultiplier || 1}x Visibility</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Palette size={12} className="text-[#FBBF24] flex-shrink-0" />
                <span className="text-text-secondary font-inter capitalize">{pkg.boostConfig.highlightStyle || 'None'} Style</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Globe size={12} className="text-[#A78BFA] flex-shrink-0" />
                <span className="text-text-secondary font-inter">{pkg.boostConfig.crossCategoryReach ? 'All Categories' : 'Own Category'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <BarChart3 size={12} className="text-[#F472B6] flex-shrink-0" />
                <span className="text-text-secondary font-inter">{pkg.boostConfig.analyticsAccess ? 'Analytics On' : 'No Analytics'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Clock size={12} className="text-state-warning flex-shrink-0" />
                <span className="text-text-secondary font-inter">{pkg.boostConfig.autoRefreshHours ? `Refresh ${pkg.boostConfig.autoRefreshHours}h` : 'No Refresh'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-lg">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(pkg.id); }}
            className={`w-full h-11 rounded-2xl font-inter font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] ${
              isSelected
                ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/30 hover:brightness-110'
                : 'bg-dark-4 text-text-soft hover:bg-dark-2'
            }`}
          >
            Select {pkg.name}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default BoostPackageCard;
