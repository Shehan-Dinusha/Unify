import React from 'react';
import Card from '../../components/common/Card';
import { Eye, Users, CalendarDays } from 'lucide-react';

const PackageStatsRow = ({ estimatedReach, audienceLabel, audienceDesc, durationDays, dateRange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
    <Card variant="container" padding="p-md" className="text-center">
      <div className="flex items-center justify-center gap-xs mb-xs">
        <Eye size={14} className="text-state-success" />
        <span className="text-body-extra-small text-text-secondary font-inter">Est. Reach</span>
      </div>
      <p className="text-body-large-bold text-text-primary font-inter">{estimatedReach}</p>
      <p className="text-body-extra-small text-text-secondary font-inter">Impressions guaranteed</p>
    </Card>

    <Card variant="container" padding="p-md" className="text-center">
      <div className="flex items-center justify-center gap-xs mb-xs">
        <Users size={14} className="text-primary-blue" />
        <span className="text-body-extra-small text-text-secondary font-inter">Audience</span>
      </div>
      <p className="text-body-large-bold text-text-primary font-inter">{audienceLabel}</p>
      <p className="text-body-extra-small text-text-secondary font-inter">{audienceDesc}</p>
    </Card>

    <Card variant="container" padding="p-md" className="text-center">
      <div className="flex items-center justify-center gap-xs mb-xs">
        <CalendarDays size={14} className="text-state-warning" />
        <span className="text-body-extra-small text-text-secondary font-inter">Duration</span>
      </div>
      <p className="text-body-large-bold text-text-primary font-inter">{durationDays} Days</p>
      <p className="text-body-extra-small text-text-secondary font-inter">{dateRange}</p>
    </Card>
  </div>
);

export default PackageStatsRow;
