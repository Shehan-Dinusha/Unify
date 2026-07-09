import React from 'react';
import { MapPin, Mail } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getAvatarUrl } from '../../utils/formatters';

const BusinessHeaderCard = ({ biz, onSuspend, onMessage }) => (
  <Card variant="container" className="py-3 px-6 mb-8">
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-dark-2 border border-white/20 overflow-hidden flex items-center justify-center">
          <img src={getAvatarUrl(biz.logo, biz.name)} alt={biz.name} className="w-full h-full object-cover" />
        </div>
        {biz.isVerified && (
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-state-success flex items-center justify-center border-2 border-dark-1 shadow-lg shadow-state-success/40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-heading-small text-text-primary font-inter mb-0.5 tracking-tight">{biz.name}</h2>
        <div className="flex flex-wrap items-center gap-4 text-body-extra-small text-text-secondary font-inter">
          <span className="flex items-center gap-1.5 font-bold opacity-80">
            ID: {biz.businessId}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5 opacity-80 font-medium">
            <MapPin size={12} className="text-text-tertiary" /> {biz.location}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
        {biz.status !== 'Suspended' && (
          <Button
            variant="danger"
            size="medium"
            onClick={onSuspend}
            className="flex-1 sm:flex-none h-11 px-8"
          >
            Suspend
          </Button>
        )}
        <Button
          variant="primary"
          size="medium"
          icon={Mail}
          disabled={biz.status === 'Suspended'}
          onClick={onMessage}
          className={`flex-1 sm:flex-none h-11 px-10 ${biz.status === 'Suspended' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          Message
        </Button>
      </div>
    </div>
  </Card>
);

export default BusinessHeaderCard;
