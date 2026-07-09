import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Overlay from '../../components/common/Overlay';

const SubmitConfirmModal = ({ open, onClose, onConfirm, submitting }) => (
  <Overlay open={open} zIndex="z-[60]" className="overflow-y-auto">
    <div className="min-h-full flex items-center justify-center py-8">
      <Card variant="modal" padding="p-0" className="max-w-sm">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-primary-blue/5">
            <Send size={28} className="text-primary-blue sm:hidden" />
            <Send size={32} className="text-primary-blue hidden sm:block" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-inter">Submit Report?</h2>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-2 max-w-sm font-inter">
            Are you sure you want to submit this report? Your report will be sent to the{' '}
            <span className="text-white font-semibold">University Administration</span> for review. This action cannot be undone.
          </p>
        </div>
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
          <Button onClick={onConfirm} disabled={submitting} variant="gradient" fullWidth size="medium" className="h-11 sm:h-12 gap-2.5">
            <CheckCircle2 size={18} /> Yes, Submit Report
          </Button>
          <button
            onClick={onClose}
            className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-white font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  </Overlay>
);

export default SubmitConfirmModal;
