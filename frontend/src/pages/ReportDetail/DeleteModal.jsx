import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import StatusIcon from "../../components/common/StatusIcon";
import {
    AlertTriangle, X, Heart, MessageSquare, Flag, EyeOff,
    CheckCircle2, Trash2, Info,
} from "lucide-react";
import { Flag as FlagIcon } from "lucide-react";

const DeleteModal = ({
    open, onClose, actionLoading,
    deleteCategory, onDeleteCategoryChange,
    notifyUser, onNotifyUserChange,
    onConfirm, report, avatar, deleteOptions,
}) => {
    const r = report;
    return (
        <Overlay open={open} className="overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-6">
            <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-md">
                <Card variant="modal" padding="p-0" className="flex-1">
                    <div className="p-lg">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-body-medium-bold text-text-primary">Preview</span>
                            <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30">FLAGGED</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-md">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={avatar(r.reportedContent.author)} alt="" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                <div>
                                    <p className="text-body-small-bold text-text-primary">{r.reportedContent.author}</p>
                                    <p className="text-body-extra-small text-text-secondary">Faculty of Engineering • {r.submittedAgo}</p>
                                </div>
                            </div>
                            <p className="text-body-small text-text-secondary leading-relaxed mb-4">{r.reportedContent.text}</p>
                            {r.reportedContent.hasImage && (
                                <div className="w-full h-36 bg-dark-3 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                    <div className="text-center"><EyeOff size={20} className="mx-auto text-text-secondary mb-1" /><p className="text-body-extra-small text-text-secondary">{r.reportedContent.imageLabel}</p></div>
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-text-secondary">
                                <span className="flex items-center gap-1.5 text-body-extra-small"><Heart size={14} /> {r.stats.likes}</span>
                                <span className="flex items-center gap-1.5 text-body-extra-small"><MessageSquare size={14} /> {r.stats.comments}</span>
                                <span className="flex items-center gap-1.5 text-body-extra-small text-state-error"><Flag size={14} /> {r.reportCount}</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card variant="modal" padding="p-0" className="flex-1">
                    <div className="p-lg flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <StatusIcon variant="error" size="sm" icon={<AlertTriangle size={20} className="text-state-error" />} className="mb-0" />
                            <h3 className="text-body-large-bold text-text-primary">Delete Post?</h3>
                        </div>
                        <p className="text-body-small text-text-secondary leading-relaxed mb-6">You are about to permanently delete this post. This action cannot be undone.</p>
                        <div className="mb-4">
                            <label className="text-body-extra-small-bold text-text-tertiary uppercase tracking-wider mb-2 block">VIOLATION CATEGORY</label>
                            <Select options={deleteOptions} value={deleteCategory} onChange={(e) => onDeleteCategoryChange(e.target.value)} placeholder="Select a reason..." icon={FlagIcon} />
                            <p className="text-body-extra-small text-text-tertiary mt-1.5 flex items-center gap-1"><Info size={12} /> Required for audit logs.</p>
                        </div>
                        <label className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => onNotifyUserChange(!notifyUser)}>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${notifyUser ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>
                                {notifyUser && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <div><span className="text-body-small-bold text-text-primary">Notify User</span><p className="text-body-extra-small text-text-secondary">Send an automated message explaining the violation.</p></div>
                        </label>
                        <div className="flex flex-col gap-3 mt-auto">
                            <button disabled={actionLoading || !deleteCategory} onClick={onConfirm} className={`w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!deleteCategory || actionLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <Trash2 size={18} /> Delete Permanently
                            </button>
                            <button onClick={onClose} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
            </div>
        </Overlay>
    );
};

export default DeleteModal;
