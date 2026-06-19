import React from 'react';
import Card from '../../components/common/Card';

const BusinessStatsRow = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
      {stats.map((stat, i) => (
        <Card key={i} variant="container" className="hover:border-primary-blue/30 transition-colors">
          <div className="flex items-start justify-between mb-sm">
            <p className="text-body-small text-text-secondary font-inter">{stat.label}</p>
            <span className={`px-sm py-xs rounded-lg text-body-extra-small-bold font-inter ${stat.badgeClass}`}>{stat.badge}</span>
          </div>
          <p className="text-heading-small text-text-primary font-inter">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
};

export default BusinessStatsRow;
