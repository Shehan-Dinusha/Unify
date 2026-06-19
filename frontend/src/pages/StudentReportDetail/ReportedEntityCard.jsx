import React from 'react';
import { ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import { getAvatarUrl } from '../../utils/formatters';

const ReportedEntityCard = ({ r }) => (
  <Card variant="card" padding="p-6">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-bold text-white font-inter mb-4">Reported Entity</h3>
        <p className="text-xl font-bold text-white font-inter">{r.reportedEntity.name}</p>
        <p className="text-sm text-text-secondary font-inter mt-1">{r.reportedEntity.faculty}</p>
        <p className="text-xs text-text-tertiary font-inter mt-3">ID: {r.reportedEntity.entityId}</p>
        <button className="text-primary-blue font-bold text-sm mt-5 mb-2 flex items-center gap-1 hover:underline transition-all">
          View Profile <ArrowRight size={14} />
        </button>
      </div>
      <div className="flex flex-col items-end gap-3">
        <span className="px-3 py-1.5 rounded-full bg-state-error/10 border border-state-error/20 text-state-error text-[11px] font-bold tracking-wide font-inter">
          {r.reason || 'Report'}
        </span>
        <img
          src={getAvatarUrl(r.reportedEntity.avatar, r.reportedEntity.name)}
          alt={r.reportedEntity.name}
          className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-white/10"
        />
      </div>
    </div>
  </Card>
);

export default ReportedEntityCard;
