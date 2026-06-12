import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Card from '../../components/common/Card';
import { Shield } from 'lucide-react';

const AdminNote = ({ adminNote }) => {
  if (!adminNote) return null;

  return (
    <div className="bg-primary-blue/5 border-l-4 border-l-primary-blue rounded-r-[20px] rounded-bl-sm border-y border-r border-y-white/10 border-r-white/10 p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
        <ShieldAlert size={20} className="text-primary-blue" />
      </div>
      <div>
        <h4 className="text-base font-bold text-white font-inter mb-1">Administrative Update</h4>
        <p className="text-xs text-primary-blue font-inter mb-3">Posted by {adminNote.author} • {adminNote.date}</p>
        <p className="text-sm text-text-secondary leading-relaxed font-inter">{adminNote.message}</p>
      </div>
    </div>
  );
};

const ActivityLogSection = ({ activityLog }) => {
  if (!activityLog || activityLog.length === 0) return null;

  return (
    <Card variant="card" padding="p-6">
      <h3 className="text-lg font-bold text-white font-inter mb-6">Detailed Activity Log</h3>
      <div className="flex flex-col gap-5">
        {activityLog.slice().reverse().map((log, i) => (
          <div key={i} className="flex flex-col gap-1 border-l-2 border-white/5 pl-4 ml-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-inter">{log.title}</span>
              <span className="text-[10px] text-text-tertiary font-inter">{log.time}</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-inter">{log.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PrivacyShield = () => (
  <Card variant="card" padding="p-6">
    <div className="flex items-start gap-3">
      <Shield size={20} className="text-state-success flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-white font-bold text-sm font-inter">Privacy Protected</h4>
        <p className="text-text-secondary text-xs font-inter mt-2 leading-relaxed">
          Your identity is encrypted and only visible to the head of the disciplinary committee.
        </p>
      </div>
    </div>
  </Card>
);

export { AdminNote, ActivityLogSection, PrivacyShield };
