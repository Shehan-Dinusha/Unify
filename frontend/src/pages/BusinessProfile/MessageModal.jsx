import React from 'react';
import { Mail, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Overlay from '../../components/common/Overlay';
import StatusIcon from '../../components/common/StatusIcon';

const MessageModal = ({ open, biz, onClose, onSend }) => (
  <Overlay open={open} className="overflow-y-auto">
    <div className="min-h-full flex items-center justify-center py-6">
      <Card variant="modal" padding="p-0">
        <div className="p-lg flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <StatusIcon variant="info" size="sm" icon={<Mail size={20} className="text-primary-blue" />} className="mb-0" />
              <div><h3 className="text-body-large-bold text-text-primary">Send Message</h3><p className="text-body-extra-small text-text-secondary">To: {biz.name}</p></div>
            </div>
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
          </div>
          <div className="mb-4">
            <label className="text-body-small-bold text-text-primary mb-2 block">Subject</label>
            <input placeholder="Enter subject..." className="w-full h-12 bg-white/5 rounded-2xl border border-white/10 px-4 text-body-small text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-blue/50 transition-colors" />
          </div>
          <div className="mb-6">
            <label className="text-body-small-bold text-text-primary mb-2 block">Message</label>
            <textarea placeholder="Type your message here..." className="w-full h-32 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={onSend} variant="gradient" fullWidth size="medium" className="gap-2.5"><Mail size={18} /> Send Message</Button>
            <button onClick={onClose} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
          </div>
        </div>
      </Card>
    </div>
  </Overlay>
);

export default MessageModal;
