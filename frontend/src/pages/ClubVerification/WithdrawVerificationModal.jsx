import React from 'react';
import { AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Overlay from '../../components/common/Overlay';
import StatusIcon from '../../components/common/StatusIcon';

const WithdrawVerificationModal = ({ open, onClose, onConfirm, loading }) => (
  <Overlay open={open} onClose={onClose}>
    <Card variant="modal" padding="p-0" className="animate-in fade-in zoom-in duration-200">
      <div className="p-6 sm:p-8 sm:pb-6 flex flex-col items-center text-center">
        <StatusIcon variant="error" size="lg" icon={<AlertCircle className="w-8 h-8 text-state-error" />} />
        <h2 className="text-xl font-bold text-white mb-3">Withdraw Application?</h2>
        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
          Are you sure you want to withdraw your club verification application? This will{' '}
          <span className="text-white font-bold">permanently delete all uploaded documents</span>{' '}
          and reset your status.
        </p>
      </div>
      <div className="p-4 sm:p-6 sm:pt-2 bg-transparent flex gap-4">
        <Button
          onClick={onClose}
          className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="danger"
          className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
          disabled={loading}
        >
          Withdraw Application
        </Button>
      </div>
    </Card>
  </Overlay>
);

export default WithdrawVerificationModal;
