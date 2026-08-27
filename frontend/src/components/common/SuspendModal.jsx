import Overlay from "./Overlay";
import Card from "./Card";

import { UserX, X, CheckCircle2 } from "lucide-react";

const SuspendModal = ({
  open, onClose, loading, onConfirm,
  userName, userEmail, userAvatar,
  suspendReason, onSuspendReasonChange,
  suspendDetail, onSuspendDetailChange,
  sendEmail, onSendEmailChange,
  reasons,
}) => {
  return (
    <Overlay open={open} className="overflow-y-auto">
      <div className="min-h-full flex items-center justify-center py-6">
        <Card variant="modal" padding="p-0" className="max-w-lg">
          <div className="w-full h-1 bg-white/5 rounded-t-3xl overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-primary-blue to-primary-accent rounded-r" /></div>
          <div className="p-lg flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center"><UserX size={20} className="text-state-error" /></div>
                <div><h3 className="text-body-large-bold text-text-primary">Suspend User Access</h3><p className="text-body-extra-small text-text-secondary">This action requires administrator confirmation.</p></div>
              </div>
              <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-5">
              <img src={userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
              <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{userName}</p><p className="text-body-extra-small text-text-secondary">{userEmail}</p></div>
              <span className="inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30"><span className="w-1.5 h-1.5 rounded-full bg-state-success" />ACTIVE</span>
            </div>
            <p className="text-body-small text-text-secondary leading-relaxed mb-5">Are you sure you want to suspend this user? This will immediately revoke their access.</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2"><label className="text-body-small-bold text-text-primary">Reason for suspension</label><span className="text-body-extra-small text-text-tertiary">Required</span></div>
              <div className="flex flex-wrap gap-2">
                {reasons.map(reason => (
                  <button key={reason} onClick={() => onSuspendReasonChange(reason)} className={`px-3.5 py-1.5 rounded-xl text-body-small font-medium transition-all ${suspendReason === reason ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/40' : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'}`}>{reason}</button>
                ))}
              </div>
            </div>
            <textarea
              value={suspendDetail}
              onChange={(e) => onSuspendDetailChange(e.target.value)}
              placeholder="Enter detailed reason here...."
              className={`w-full h-24 bg-white/5 rounded-2xl border ${!suspendDetail.trim() ? 'border-state-error/50' : 'border-white/10'} p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-2`}
            />
            {!suspendDetail.trim() && (
              <p className="text-[10px] text-state-error mb-4 ml-1 italic font-medium">* Reason is required to proceed with suspension</p>
            )}
            <label className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onSendEmailChange(!sendEmail)}>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sendEmail ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>{sendEmail && <CheckCircle2 size={14} className="text-white" />}</div>
              <span className="text-body-small text-text-secondary">Send email notification to user</span>
            </label>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => suspendDetail.trim() && onConfirm()}
                disabled={!suspendDetail.trim() || loading}
                className={`w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!suspendDetail.trim() || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                <UserX size={18} /> {loading ? 'Suspending...' : 'Confirm Suspension'}
              </button>
              <button onClick={onClose} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
            </div>
          </div>
        </Card>
      </div>
    </Overlay>
  );
};

export default SuspendModal;
