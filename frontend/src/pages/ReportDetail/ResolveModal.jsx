import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusIcon from "../../components/common/StatusIcon";
import { X, CheckCircle2 } from "lucide-react";

const ResolveModal = ({
    open, onClose, actionLoading,
    resolveNote, onResolveNoteChange,
    onConfirm, report,
}) => {
    const r = report;
    return (
        <Overlay open={open} className="overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="max-w-lg">
                <div className="p-lg flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <StatusIcon variant="success" size="sm" icon={<CheckCircle2 size={20} className="text-state-success" />} className="mb-0" />
                            <h3 className="text-body-large-bold text-text-primary">Resolve Report?</h3>
                        </div>
                        <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
                    </div>
                    <div className="bg-white/5 rounded-xl border border-white/10 p-md mb-5">
                        <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 bg-primary-blue/20 text-primary-blue text-xs font-bold rounded-md border border-primary-blue/30">#RPT-{r.id.replace('R-','')}20</span>
                            <div><p className="text-body-small-bold text-text-primary">{r.type} in Comment Section</p><p className="text-body-extra-small text-text-secondary">Reported by {r.reportedBy.handle} • {r.submittedAgo}</p></div>
                        </div>
                    </div>
                    <p className="text-body-small text-text-secondary leading-relaxed mb-5">You are about to mark this report as resolved. This action will notify the reporting user and archive this ticket.</p>
                    <div className="mb-6">
                        <label className="text-body-small-bold text-text-primary mb-2 block">Resolution Note (Optional)</label>
                        <textarea value={resolveNote} onChange={(e) => onResolveNoteChange(e.target.value)} placeholder="Briefly explain the resolution..." className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button disabled={actionLoading} onClick={onConfirm} variant="gradient" fullWidth size="medium" className="gap-2.5">
                            <CheckCircle2 size={18} /> Confirm Resolve
                        </Button>
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

export default ResolveModal;
