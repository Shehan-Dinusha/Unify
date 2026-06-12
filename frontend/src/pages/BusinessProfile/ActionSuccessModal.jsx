import React from 'react';
import { CheckCircle2, ArrowLeft, RotateCcw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Overlay from '../../components/common/Overlay';
import { getAvatarUrl } from '../../utils/formatters';

const CONFIGS = {
  suspend: { title: 'Business Suspended', desc: (name) => `${name} has been suspended. All active campaigns have been paused and the profile is hidden from the platform.`, icon: <CheckCircle2 size={36} className="text-state-success" />, ringClass: 'ring-state-success/5 bg-state-success/10' },
  message: { title: 'Message Sent!', desc: (name) => `Your message has been sent to ${name} successfully.`, icon: <CheckCircle2 size={36} className="text-state-success" />, ringClass: 'ring-state-success/5 bg-state-success/10' },
};

const ActionSuccessModal = ({ success, biz, onClose }) => {
  if (!success) return null;
  const cfg = CONFIGS[success];

  return (
    <Overlay open={true} className="overflow-y-auto">
      <div className="min-h-full flex items-center justify-center py-6">
        <Card variant="modal" padding="p-0">
          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ${cfg.ringClass}`}>{cfg.icon}</div>
            <h2 className="text-xl font-bold text-white mb-3">{cfg.title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-5">{cfg.desc(biz.name)}</p>
            {success === 'suspend' && (
              <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-xl bg-dark-2 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                  <img src={getAvatarUrl(biz.logo, biz.name)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{biz.name}</p><p className="text-body-extra-small text-text-secondary">{biz.businessId}</p></div>
                <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30">Suspended</span>
              </div>
            )}
          </div>
          <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
            <Button onClick={() => onClose('dashboard')} variant="gradient" fullWidth size="medium" className="gap-2.5"><ArrowLeft size={18} /> Return to Dashboard</Button>
            <button onClick={() => onClose('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={18} className="text-text-secondary" /> View Active Businesses</button>
          </div>
        </Card>
      </div>
    </Overlay>
  );
};

export default ActionSuccessModal;
