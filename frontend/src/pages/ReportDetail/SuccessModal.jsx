import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusIcon from "../../components/common/StatusIcon";
import { Trash2, FileText, CheckCircle2, ArrowLeft, RotateCcw } from "lucide-react";

const SuccessModal = ({
    open, success, report, avatar,
    onPrimaryAction, onSecondaryAction, onClose,
}) => {
    const r = report;
    return (
        <Overlay open={open} className="overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="">
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                    <StatusIcon variant="success" size="lg" icon={
                        success === 'deleted'
                            ? <div className="relative"><Trash2 size={28} className="text-text-secondary" /><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-state-success rounded-full flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div></div>
                            : success === 'dismissed'
                            ? <div className="relative"><FileText size={28} className="text-text-secondary" /><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div></div>
                            : <CheckCircle2 size={36} className="text-state-success" />
                    } />
                    {success === 'dismissed' && <><h2 className="text-xl font-bold text-white mb-3">Report Dismissed</h2><p className="text-text-secondary text-sm leading-relaxed">The flagged report has been dismissed. No further action will be taken on this case.</p></>}
                    {success === 'deleted' && <><h2 className="text-xl font-bold text-white mb-1">Post Deleted Successfully</h2><p className="text-body-small text-state-error mb-2">Action ID: #DEL-{r.id?.replace('R-','') || '9082'}-XY</p><p className="text-text-secondary text-sm leading-relaxed">The content has been permanently removed. The reporter has been notified.</p></>}
                    {success === 'resolved' && <>
                        <h2 className="text-xl font-bold text-white mb-3">Resolution Successful</h2>
                        <p className="text-text-secondary text-sm leading-relaxed mb-5">The report regarding {r.offender?.name} has been successfully processed.</p>
                        <div className="w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden text-left">
                            <div className="flex items-center justify-between px-md py-3 border-b border-white/5"><span className="text-body-small text-text-secondary">REPORT ID</span><span className="text-body-small-bold text-state-error">#RPT-2023-{r.id?.replace('R-','')}</span></div>
                            <div className="flex items-center justify-between px-md py-3 border-b border-white/5"><span className="text-body-small text-text-secondary">ACTION TAKEN</span><span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 flex items-center gap-1"><Trash2 size={10} /> Content Deleted</span></div>
                            <div className="flex items-center justify-between px-md py-3"><span className="text-body-small text-text-secondary">Package Tier</span><span className="text-body-small-bold text-primary-blue">✦ GROWTH</span></div>
                        </div>
                    </>}
                    {success === 'suspended' && <>
                        <h2 className="text-xl font-bold text-white mb-3">Suspension Applied</h2>
                        <p className="text-text-secondary text-sm leading-relaxed mb-5">The user has been moved to the suspended list. Their access has been revoked immediately.</p>
                        <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left">
                            <img src={avatar(r.offender?.name || 'User', r.offender?.avatar)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                            <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{r.offender?.name}</p><p className="text-body-extra-small text-text-secondary">alex.j@example.com</p><p className="text-body-extra-small text-primary-blue">ID: #{r.offender?.id}</p></div>
                            <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30">Suspended</span>
                        </div>
                    </>}
                </div>
                <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                    {(success === 'resolved' || success === 'dismissed') && (
                        <Button onClick={onPrimaryAction} variant="gradient" fullWidth size="medium" className="gap-2.5">
                            <ArrowLeft size={18} /> Return to Dashboard
                        </Button>
                    )}
                    {(success === 'deleted' || success === 'suspended') && (
                        <Button onClick={onSecondaryAction} variant="gradient" fullWidth size="medium" className="gap-2.5">
                            <RotateCcw size={18} /> Continue Moderating
                        </Button>
                    )}
                    <button onClick={onClose} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                        <RotateCcw size={18} className="text-text-secondary" /> Back to Report
                    </button>
                </div>
            </Card>
            </div>
        </Overlay>
    );
};

export default SuccessModal;
