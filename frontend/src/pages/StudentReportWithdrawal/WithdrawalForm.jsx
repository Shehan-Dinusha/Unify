import React from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { X, Info, AlertTriangle } from "lucide-react";

const WithdrawalForm = ({ displayId, reason, onReasonChange, submitting, onConfirm, onCancel }) => (
  <div className="min-h-full flex items-center justify-center py-10">
    <Card variant="modal" padding="p-0">
      <div className="p-lg flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-state-warning/10 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-state-warning" />
            </div>
            <div>
              <h3 className="text-body-large-bold text-text-primary">Withdraw Report</h3>
              <p className="text-body-extra-small text-text-secondary">Report ID: <span className="text-primary-blue">{displayId}</span></p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
        </div>

        <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-xl p-md mb-5 flex items-start gap-3">
          <Info size={18} className="text-primary-blue flex-shrink-0 mt-0.5" />
          <p className="text-body-small text-text-secondary leading-relaxed">
            You are initiating the withdrawal process for <span className="text-text-primary font-semibold">Report {displayId}</span>. This action will immediately halt the ongoing investigation.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-body-small-bold text-text-primary mb-2 block">
            Reason for withdrawal <span className="text-text-tertiary font-normal">(Optional)</span>
          </label>
          <textarea rows={3} value={reason} onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Please briefly explain why you are withdrawing this report..."
            className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-md mb-6 flex items-start gap-3">
          <Info size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-body-small-bold text-text-primary">Record Retention Policy</span>
            <p className="text-body-extra-small text-text-secondary mt-0.5 leading-relaxed">
              While the investigation will stop, a record of this withdrawal and the original submission may be archived by the administration for audit purposes.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onConfirm} disabled={submitting} variant="gradient" fullWidth size="medium" className="gap-2.5">
            <AlertTriangle size={18} /> {submitting ? 'Withdrawing...' : 'Confirm Withdrawal'}
          </Button>
          <button onClick={onCancel}
            className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
            Cancel
          </button>
        </div>
      </div>
    </Card>
  </div>
);

export default WithdrawalForm;
