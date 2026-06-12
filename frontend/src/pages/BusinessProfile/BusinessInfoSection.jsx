import React from 'react';
import Card from '../../components/common/Card';

const BusinessInfoSection = ({ biz }) => (
  <div className="lg:col-span-2 flex flex-col gap-lg">
    <Card variant="container">
      <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Business Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-xl gap-y-lg">
        <div><p className="text-body-small text-text-secondary font-inter mb-xs">Primary Email</p><p className="text-body-medium text-text-primary font-inter">{biz.businessInfo.email}</p></div>
        <div><p className="text-body-small text-text-secondary font-inter mb-xs">Phone Number</p><p className="text-body-medium text-text-primary font-inter">{biz.businessInfo.phone}</p></div>
        <div><p className="text-body-small text-text-secondary font-inter mb-xs">Website</p><a href={`https://${biz.businessInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-body-medium text-primary-blue font-inter hover:underline">{biz.businessInfo.website}</a></div>
        <div><p className="text-body-small text-text-secondary font-inter mb-xs">Registered Address</p><p className="text-body-medium text-text-primary font-inter whitespace-pre-line">{biz.businessInfo.address}</p></div>
      </div>
    </Card>

    <Card variant="container">
      <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Recent Activity Log</h3>
      <div className="flex flex-col">
        {biz.activityLog.map((entry, idx) => (
          <div key={entry.id} className={`flex items-start gap-md py-md ${idx < biz.activityLog.length - 1 ? 'border-b border-white/5' : ''}`}>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${entry.iconColor}`}>{entry.icon}</span>
            <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{entry.title}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.detail}</p></div>
            <span className="text-body-extra-small text-text-secondary font-inter shrink-0">{entry.time}</span>
          </div>
        ))}
        {biz.activityLog.length === 0 && (<div className="text-center text-body-small text-text-secondary font-inter py-lg">No recent activity.</div>)}
      </div>
    </Card>
  </div>
);

export default BusinessInfoSection;
