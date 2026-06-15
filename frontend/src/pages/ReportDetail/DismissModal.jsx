import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import { AlertTriangle, X, Info } from "lucide-react";
import { Flag as FlagIcon } from "lucide-react";

const DismissModal = ({
    open, onClose, actionLoading,
    dismissReason, onDismissReasonChange,
    dismissNotes, onDismissNotesChange,
    onConfirm, report, dismissOptions,
}) => {
    const r = report;
    return (
        <Overlay open={open} className="overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="max-w-lg">
                <div className="p-lg flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center"><AlertTriangle size={20} className="text-state-error" /></div>
                            <div><h3 className="text-body-large-bold text-text-primary">Dismiss Report</h3><p className="text-body-extra-small text-text-secondary">Report ID: <span className="text-state-error">#{r.id.replace('R-','RPT-2023-')}</span></p></div>
                        </div>
                        <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
                    </div>
                    <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-xl p-md mb-5 flex items-start gap-3">
                        <Info size={18} className="text-primary-blue flex-shrink-0 mt-0.5" />
                        <p className="text-body-small text-text-secondary leading-relaxed">You are dismissing a {r.type.toLowerCase()} report against <span className="text-text-primary font-semibold">Student ID {r.offender.id}</span>.</p>
                    </div>
                    <div className="mb-4">
                        <label className="text-body-small-bold text-text-primary mb-2 block">Reason for Dismissal</label>
                        <Select options={dismissOptions} value={dismissReason} onChange={(e) => onDismissReasonChange(e.target.value)} placeholder="Select a reason..." icon={FlagIcon} />
                    </div>
                    <div className="mb-6">
                        <label className="text-body-small-bold text-text-primary mb-2 block">Internal Notes (Optional)</label>
                        <textarea value={dismissNotes} onChange={(e) => onDismissNotesChange(e.target.value)} placeholder='Provide context for future audits...' className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <button disabled={actionLoading || !dismissReason} onClick={onConfirm} className={`w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!dismissReason || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <AlertTriangle size={18} /> Dismiss Report
                        </button>
                        <button onClick={onClose} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                            Cancel
                        </button>
                    </div>
                </div>
            </Card>
            </div>
        </Overlay>
    );
};

export default DismissModal;
