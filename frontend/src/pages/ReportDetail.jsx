import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { mockReports, mockRequests } from '../data/mockData';
import {
    AlertTriangle, X, Heart, MessageSquare, Flag, EyeOff,
    CheckCircle2, FileText, Trash2, UserX, Clock, Info,
    ArrowLeft, RotateCcw,
} from 'lucide-react';

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        Pending:     'bg-state-error/20 text-state-error border-state-error/30',
        'In Review': 'bg-state-warning/20 text-state-warning border-state-warning/30',
        Resolved:    'bg-state-success/20 text-state-success border-state-success/30',
        Dismissed:   'bg-white/10 text-text-secondary border-white/20',
    };
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${map[status] || map.Pending}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'Pending' ? 'bg-state-error' :
                status === 'In Review' ? 'bg-state-warning' :
                status === 'Resolved' ? 'bg-state-success' : 'bg-text-secondary'
            }`} />
            {status}
        </span>
    );
};

const TypeBadge = ({ type }) => {
    const styles = {
        'Hate Speech': 'text-state-error bg-state-error/10 border-state-error/30',
        Nudity:        'text-primary-accent bg-primary-accent/10 border-primary-accent/30',
        Spam:          'text-state-warning bg-state-warning/10 border-state-warning/30',
        Harassment:    'text-state-error bg-state-error/10 border-state-error/30',
    };
    return (
        <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${styles[type] || 'text-text-secondary bg-white/10 border-white/20'}`}>
            {type}
        </span>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   REPORT DETAIL PAGE — /report-moderation/:id
   ═══════════════════════════════════════════════════════════════════════ */
const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find report by id param
    const report = mockReports.find(r => r.id === id) || mockReports[0];

    /* ── state ──────────────────────────────────────────── */
    const [modal, setModal]               = useState(null);
    const [success, setSuccess]           = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [sensitiveRevealed, setSensitiveRevealed] = useState(false);
    const [noteToast, setNoteToast]       = useState(false);

    const [deleteCategory, setDeleteCategory] = useState('');
    const [notifyUser, setNotifyUser]         = useState(true);
    const [dismissReason, setDismissReason]   = useState('');
    const [dismissNotes, setDismissNotes]     = useState('');
    const [resolveNote, setResolveNote]       = useState('');
    const [suspendReason, setSuspendReason]   = useState('Violation of Terms');
    const [suspendDetail, setSuspendDetail]   = useState('');
    const [sendEmail, setSendEmail]           = useState(true);

    /* ── options ────────────────────────────────────────── */
    const dismissOptions = [{ value:'',label:'Select a reason...' },{ value:'Insufficient Evidence',label:'Insufficient Evidence' },{ value:'Not a Violation',label:'Not a Violation' },{ value:'Duplicate Report',label:'Duplicate Report' },{ value:'False Report',label:'False Report' }];
    const deleteOptions  = [{ value:'',label:'Select a reason...' },{ value:'Hate Speech',label:'Hate Speech' },{ value:'Nudity',label:'Nudity / Sexual Content' },{ value:'Spam',label:'Spam' },{ value:'Harassment',label:'Harassment / Bullying' },{ value:'Violence',label:'Violence / Threats' }];

    /* ── helpers ────────────────────────────────────────── */
    const avatar = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g,'')}`;

    const openModal  = (m) => setModal(m);
    const closeModal = ()  => { setModal(null); setDeleteCategory(''); setDismissReason(''); setDismissNotes(''); setResolveNote(''); setSuspendDetail(''); };

    const handleAddNote = () => {
        if (!resolutionNote.trim()) return;
        setNoteToast(true); setResolutionNote('');
        setTimeout(() => setNoteToast(false), 3000);
    };

    const confirmAction = (type) => { closeModal(); setSuccess(type); };

    const closeSuccess = (dest) => {
        setSuccess(null);
        if (dest === 'dashboard') navigate('/admin');
        else navigate('/report-moderation');
    };

    /* ── Detail UI ──────────────────────────────────────── */
    const r = report;

    /* ═══════════════════════════════════════════════════════
       MODALS
       ═══════════════════════════════════════════════════════ */
    const renderDeleteModal = () => {
        if (modal !== 'delete') return null;
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
                <div className="min-h-full flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-[800px] flex flex-col md:flex-row gap-md">
                    <Card variant="card" padding="p-0" className="flex-1 outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
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
                    <Card variant="card" padding="p-0" className="flex-1 outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                        <div className="p-lg flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center ring-4 ring-state-error/5"><AlertTriangle size={20} className="text-state-error" /></div>
                                <h3 className="text-body-large-bold text-text-primary">Delete Post?</h3>
                            </div>
                            <p className="text-body-small text-text-secondary leading-relaxed mb-6">You are about to permanently delete this post. This action cannot be undone.</p>
                            <div className="mb-4">
                                <label className="text-body-extra-small-bold text-text-tertiary uppercase tracking-wider mb-2 block">VIOLATION CATEGORY</label>
                                <Select options={deleteOptions} value={deleteCategory} onChange={(e) => setDeleteCategory(e.target.value)} placeholder="Select a reason..." icon={Flag} />
                                <p className="text-body-extra-small text-text-tertiary mt-1.5 flex items-center gap-1"><Info size={12} /> Required for audit logs.</p>
                            </div>
                            <label className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setNotifyUser(!notifyUser)}>
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${notifyUser ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>
                                    {notifyUser && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <div><span className="text-body-small-bold text-text-primary">Notify User</span><p className="text-body-extra-small text-text-secondary">Send an automated message explaining the violation.</p></div>
                            </label>
                            <div className="flex flex-col gap-3 mt-auto">
                                <button onClick={() => confirmAction('deleted')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                                    <Trash2 size={18} /> Delete Permanently
                                </button>
                                <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
                </div>
            </div>
        );
    };

    const renderDismissModal = () => {
        if (modal !== 'dismiss') return null;
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
                <div className="min-h-full flex items-center justify-center px-4 py-6">
                <Card variant="card" padding="p-0" className="w-full max-w-[440px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                    <div className="p-lg flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center"><AlertTriangle size={20} className="text-state-error" /></div>
                                <div><h3 className="text-body-large-bold text-text-primary">Dismiss Report</h3><p className="text-body-extra-small text-text-secondary">Report ID: <span className="text-state-error">#{r.id.replace('R-','RPT-2023-')}</span></p></div>
                            </div>
                            <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
                        </div>
                        <div className="bg-primary-blue/5 border border-primary-blue/20 rounded-xl p-md mb-5 flex items-start gap-3">
                            <Info size={18} className="text-primary-blue flex-shrink-0 mt-0.5" />
                            <p className="text-body-small text-text-secondary leading-relaxed">You are dismissing a {r.type.toLowerCase()} report against <span className="text-text-primary font-semibold">Student ID {r.offender.id}</span>.</p>
                        </div>
                        <div className="mb-4">
                            <label className="text-body-small-bold text-text-primary mb-2 block">Reason for Dismissal</label>
                            <Select options={dismissOptions} value={dismissReason} onChange={(e) => setDismissReason(e.target.value)} placeholder="Select a reason..." icon={Flag} />
                        </div>
                        <div className="mb-6">
                            <label className="text-body-small-bold text-text-primary mb-2 block">Internal Notes (Optional)</label>
                            <textarea value={dismissNotes} onChange={(e) => setDismissNotes(e.target.value)} placeholder='Provide context for future audits...' className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => confirmAction('dismissed')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                                <AlertTriangle size={18} /> Dismiss Report
                            </button>
                            <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Card>
                </div>
            </div>
        );
    };

    const renderResolveModal = () => {
        if (modal !== 'resolve') return null;
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
                <div className="min-h-full flex items-center justify-center px-4 py-6">
                <Card variant="card" padding="p-0" className="w-full max-w-[440px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                    <div className="p-lg flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-state-success/10 rounded-full flex items-center justify-center ring-4 ring-state-success/5"><CheckCircle2 size={20} className="text-state-success" /></div>
                                <h3 className="text-body-large-bold text-text-primary">Resolve Report?</h3>
                            </div>
                            <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
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
                            <textarea value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} placeholder="Briefly explain the resolution..." className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => confirmAction('resolved')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                                <CheckCircle2 size={18} /> Confirm Resolve
                            </button>
                            <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Card>
                </div>
            </div>
        );
    };

    const renderSuspendModal = () => {
        if (modal !== 'suspend') return null;
        const reasons = ['Violation of Terms', 'Spam Activity', 'Non-payment'];
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
                <div className="min-h-full flex items-center justify-center px-4 py-6">
                <Card variant="card" padding="p-0" className="w-full max-w-[500px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                    <div className="w-full h-1 bg-white/5 rounded-t-3xl overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-primary-blue to-primary-accent rounded-r" /></div>
                    <div className="p-lg flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center"><UserX size={20} className="text-state-error" /></div>
                                <div><h3 className="text-body-large-bold text-text-primary">Suspend User Access</h3><p className="text-body-extra-small text-text-secondary">This action requires administrator confirmation.</p></div>
                            </div>
                            <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
                        </div>
                        <div className="bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-5">
                            <img src={avatar(r.offender.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                            <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{r.offender.name}</p><p className="text-body-extra-small text-text-secondary">{r.offender.handle.replace('@','')}@example.com</p></div>
                            <span className="inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30"><span className="w-1.5 h-1.5 rounded-full bg-state-success" />ACTIVE</span>
                        </div>
                        <p className="text-body-small text-text-secondary leading-relaxed mb-5">Are you sure you want to suspend this user? This will immediately revoke their access. Please provide a reason for audit logs.</p>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2"><label className="text-body-small-bold text-text-primary">Reason for suspension</label><span className="text-body-extra-small text-text-tertiary">Required</span></div>
                            <div className="flex flex-wrap gap-2">
                                {reasons.map(reason => (
                                    <button key={reason} onClick={() => setSuspendReason(reason)} className={`px-3.5 py-1.5 rounded-xl text-body-small font-medium transition-all ${suspendReason === reason ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/40' : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'}`}>{reason}</button>
                                ))}
                            </div>
                        </div>
                        <textarea value={suspendDetail} onChange={(e) => setSuspendDetail(e.target.value)} placeholder="Enter detailed reason here...." className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-4" />
                        <label className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setSendEmail(!sendEmail)}>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sendEmail ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>{sendEmail && <CheckCircle2 size={14} className="text-white" />}</div>
                            <span className="text-body-small text-text-secondary">Send email notification to user</span>
                        </label>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => confirmAction('suspended')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                                <UserX size={18} /> Confirm Suspension
                            </button>
                            <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Card>
                </div>
            </div>
        );
    };

    const renderSuccessModal = () => {
        if (!success) return null;
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
                <div className="min-h-full flex items-center justify-center px-4 py-6">
                <Card variant="card" padding="p-0" className="w-full max-w-[440px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                    <div className="p-8 pb-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
                            {success === 'deleted'
                                ? <div className="relative"><Trash2 size={28} className="text-text-secondary" /><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-state-success rounded-full flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div></div>
                                : success === 'dismissed'
                                ? <div className="relative"><FileText size={28} className="text-text-secondary" /><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center"><CheckCircle2 size={12} className="text-white" /></div></div>
                                : <CheckCircle2 size={36} className="text-state-success" />
                            }
                        </div>
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
                                <img src={avatar(r.offender?.name || 'User')} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{r.offender?.name}</p><p className="text-body-extra-small text-text-secondary">alex.j@example.com</p><p className="text-body-extra-small text-primary-blue">ID: #{r.offender?.id}</p></div>
                                <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30">Suspended</span>
                            </div>
                        </>}
                    </div>
                    <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                        <button onClick={() => closeSuccess('dashboard')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                            <ArrowLeft size={18} /> Return to Dashboard
                        </button>
                        <button onClick={() => setSuccess(null)} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                            <RotateCcw size={18} className="text-text-secondary" /> Back to Report
                        </button>
                        {success === 'suspended' && <button className="text-body-small-bold text-state-error hover:underline transition-all mt-1">Made a mistake? Undo this action</button>}
                    </div>
                </Card>
                </div>
            </div>
        );
    };

    /* ═══════════════════════════════════════════════════════
       MAIN RENDER
       ═══════════════════════════════════════════════════════ */
    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Report Moderation"
            verificationCount={mockRequests.length}
        >
            <div className="flex flex-col gap-lg">
                {/* Toast */}
                {noteToast && (
                    <div className="fixed top-20 right-4 z-50 bg-state-success/20 border border-state-success/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg backdrop-blur-md">
                        <CheckCircle2 size={20} className="text-state-success" />
                        <span className="text-body-small-bold text-state-success font-inter">Note added successfully!</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-heading-small text-text-primary">Report #{r.id.replace('R-','')}</h1>
                            <StatusBadge status="Pending" />
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <TypeBadge type={r.type} />
                            <span className="text-body-small text-text-secondary">Submitted {r.submittedAgo} • Priority <span className="text-state-error font-bold">{r.priority}</span></span>
                        </div>
                    </div>
                    <Button variant="primary" size="medium" icon={CheckCircle2} onClick={() => openModal('resolve')}>Mark as Resolved</Button>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                    {/* Column 1: Reported Content */}
                    <Card variant="card" padding="p-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2"><FileText size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Reported Content</span></div>
                            <span className="text-body-extra-small text-text-secondary">ID: {r.reportedContent.id}</span>
                        </div>
                        <div className="flex items-center gap-md mb-3">
                            <img src={avatar(r.reportedContent.author)} alt={r.reportedContent.author} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-body-small-bold text-text-primary">{r.reportedContent.author}</span>
                                    <span className="text-body-extra-small text-text-secondary">{r.reportedContent.handle}</span>
                                </div>
                                <span className="text-body-extra-small text-text-secondary">{r.reportedContent.date}</span>
                            </div>
                        </div>
                        <p className="text-body-small text-text-secondary leading-relaxed mb-4">{r.reportedContent.text}</p>
                        {r.reportedContent.hasImage && (
                            <div className="w-full h-32 bg-dark-3 rounded-xl flex items-center justify-center mb-4 cursor-pointer border border-white/10 hover:border-white/20 transition-colors" onClick={() => setSensitiveRevealed(!sensitiveRevealed)}>
                                <div className="text-center">
                                    <EyeOff size={24} className="mx-auto text-text-secondary mb-1" />
                                    <p className="text-body-extra-small text-text-secondary">{r.reportedContent.imageLabel}</p>
                                    <p className="text-body-extra-small text-text-tertiary">Click to {sensitiveRevealed ? 'hide' : 'reveal'}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 text-text-secondary mb-4">
                            <span className="flex items-center gap-1.5 text-body-extra-small"><Heart size={14} /> {r.stats.likes}</span>
                            <span className="flex items-center gap-1.5 text-body-extra-small"><MessageSquare size={14} /> {r.stats.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-state-error"><Flag size={14} /><span className="text-body-small-bold">{r.reportCount} Reports</span></div>
                        <div className="border-t border-white/10 mt-4 pt-4">
                            <p className="text-body-extra-small text-text-tertiary uppercase tracking-wider mb-3">Reported By</p>
                            <div className="flex items-center gap-md mb-3">
                                <img src={avatar(r.reportedBy.name)} alt={r.reportedBy.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-body-small-bold text-text-primary">{r.reportedBy.name}</span>
                                        <span className="px-2 py-0.5 bg-state-success/20 text-state-success text-xs font-bold rounded-md">{r.reportedBy.badge}</span>
                                    </div>
                                    <p className="text-body-extra-small text-text-secondary">{r.reportedBy.handle}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-body-extra-small text-text-secondary">• Reported via {r.reportedBy.source}</span>
                                <span className="text-body-extra-small text-text-secondary">Reputation <span className="text-text-primary font-bold">{r.reportedBy.reputation}</span></span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-body-extra-small text-text-tertiary mb-1">Reporter&apos;s Note:</p>
                                <p className="text-body-small text-text-secondary italic">{r.reportedBy.note}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Column 2: Offender Profile */}
                    <Card variant="card" padding="p-lg">
                        <div className="flex items-center gap-2 mb-5"><UserX size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Offender Profile</span></div>
                        <div className="flex flex-col items-center text-center mb-5">
                            <img src={avatar(r.offender.name)} alt={r.offender.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                            <h3 className="text-body-large-bold text-text-primary mt-3">{r.offender.name}</h3>
                            <p className="text-body-small text-text-secondary">{r.offender.handle} • ID: {r.offender.id}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <Button variant="outline" size="small">View Profile</Button>
                                <Button variant="outline" size="small">Message</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div><p className="text-body-extra-small text-text-tertiary">Account Age</p><p className="text-body-small-bold text-text-primary">{r.offender.accountAge}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Last Active</p><p className="text-body-small-bold text-text-primary">{r.offender.lastActive}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Email Status</p><p className={`text-body-small-bold ${r.offender.emailStatus === 'Verified' ? 'text-state-success' : 'text-state-error'}`}>✓ {r.offender.emailStatus}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Region</p><p className="text-body-small-bold text-text-primary">🏳 {r.offender.region}</p></div>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            <h4 className="text-body-small-bold text-text-primary mb-3">Violation History</h4>
                            {r.violationHistory.length === 0
                                ? <p className="text-body-extra-small text-text-secondary italic">No prior violations</p>
                                : <div className="flex flex-col gap-3">
                                    {r.violationHistory.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div><p className="text-body-small-bold text-text-primary">{v.type}</p><p className="text-body-extra-small text-state-error">{v.date}</p></div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${v.statusColor}`}>{v.status}</span>
                                        </div>
                                    ))}
                                </div>
                            }
                            <button className="w-full mt-4 text-center text-body-small-bold text-primary-blue hover:underline">View All History</button>
                        </div>
                    </Card>

                    {/* Column 3: Actions + Activity Log */}
                    <div className="flex flex-col gap-md">
                        <Card variant="card" padding="p-lg">
                            <div className="flex items-center gap-2 mb-4"><Flag size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Actions</span></div>
                            <div className="mb-4">
                                <p className="text-body-extra-small text-text-tertiary uppercase tracking-wider mb-2">Resolution Note</p>
                                <textarea value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Add internal note explaining the decision..." className="w-full h-20 bg-white/5 rounded-xl border border-white/10 p-3 text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <Button variant="outline" fullWidth size="small" icon={AlertTriangle} onClick={handleAddNote}>Add Note</Button>
                                <Button variant="outline" fullWidth size="small" icon={X} onClick={() => openModal('dismiss')}>Dismiss Report</Button>
                                <Button variant="dangerOutline" fullWidth size="small" icon={Trash2} onClick={() => openModal('delete')}>Delete Post</Button>
                                <Button variant="dangerOutline" fullWidth size="small" icon={UserX} onClick={() => openModal('suspend')}>Suspend User</Button>
                            </div>
                        </Card>

                        <Card variant="card" padding="p-lg">
                            <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Activity Log</span></div>
                            <div className="flex flex-col">
                                {r.activityLog.map((log, i) => (
                                    <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
                                        {i < r.activityLog.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-px bg-white/10" />}
                                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 z-10"><div className="w-1.5 h-1.5 rounded-full bg-text-secondary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-extra-small text-text-tertiary">{log.time}</p>
                                            <p className="text-body-small-bold text-text-primary">{log.title}</p>
                                            <p className="text-body-extra-small text-text-secondary">{log.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modals — inside MainLayout so sidebar shows behind blur */}
            {renderDeleteModal()}
            {renderDismissModal()}
            {renderResolveModal()}
            {renderSuspendModal()}
            {renderSuccessModal()}
        </MainLayout>
    );
};

export default ReportDetail;
