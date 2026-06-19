import React from 'react';
import { TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';

const STAT_ICONS = {
  'Activity Rate': { icon: TrendingUp, iconBg: 'bg-state-success/20', iconColor: 'text-state-success' },
  'Verified Identities': { icon: ShieldCheck, iconBg: 'bg-primary-blue/20', iconColor: 'text-primary-blue' },
  'Flagged Sessions': { icon: AlertTriangle, iconBg: 'bg-state-warning/20', iconColor: 'text-state-warning' },
};

const StudentStatsCards = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
      {stats.map((stat, i) => {
        const iconMeta = STAT_ICONS[stat.label] || { icon: TrendingUp, iconBg: 'bg-white/10', iconColor: 'text-text-secondary' };
        const StatIcon = iconMeta.icon;
        return (
          <Card key={i} variant="container" className={`${stat.cardBg || ''} h-32 flex items-center`}>
            <div className="flex items-center gap-md">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconMeta.iconBg}`}>
                <StatIcon size={24} className={iconMeta.iconColor} />
              </div>
              <div>
                <span className="text-heading-small text-text-primary">{stat.value}</span>
                <p className="text-body-small text-text-secondary">{stat.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StudentStatsCards;
