import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import {
    fetchReportById, dismissReport, resolveReport,
    deleteReportedContent, suspendReportedUser, addReportNote,
} from '../../services/reportService';
import {
    AlertTriangle, Heart, MessageSquare, Flag, EyeOff,
    CheckCircle2, FileText, Trash2, UserX, Clock,
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';
import DeleteModal from './DeleteModal';
import DismissModal from './DismissModal';
import ResolveModal from './ResolveModal';
import SuspendModal from '../../components/common/SuspendModal';
import SuccessModal from './SuccessModal';

const avatar = (name, url) => url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(name || 'User').replace(/\s/g,'')}`;

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [report, setReport]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [showAllViolations, setShowAllViolations] = useState(false);

    useEffect(() => {
        const loadReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchReportById(id);
                setReport(result.data);
            } catch (err) {
                setError('Failed to load report details. Please check the backend.');
                toast.error('Connection Error', 'Failed to load report details.');
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    }, [id]);

    const [modal, setModal]               = useState(null);
    const [success, setSuccess]           = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [sensitiveRevealed, setSensitiveRevealed] = useState(false);
    const [noteToast, setNoteToast]       = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [deleteCategory, setDeleteCategory] = useState('');
    const [notifyUser, setNotifyUser]         = useState(true);
    const [dismissReason, setDismissReason]   = useState('');
    const [dismissNotes, setDismissNotes]     = useState('');
    const [resolveNote, setResolveNote]       = useState('');
    const [suspendReason, setSuspendReason]   = useState('Violation of Terms');
    const [suspendDetail, setSuspendDetail]   = useState('');
    const [sendEmail, setSendEmail]           = useState(true);

    const dismissOptions = [{ value:'',label:'Select a reason...' },{ value:'Insufficient Evidence',label:'Insufficient Evidence' },{ value:'Not a Violation',label:'Not a Violation' },{ value:'Duplicate Report',label:'Duplicate Report' },{ value:'False Report',label:'False Report' }];
    const deleteOptions  = [{ value:'',label:'Select a reason...' },{ value:'Hate Speech',label:'Hate Speech' },{ value:'Nudity',label:'Nudity / Sexual Content' },{ value:'Spam',label:'Spam' },{ value:'Harassment',label:'Harassment / Bullying' },{ value:'Violence',label:'Violence / Threats' }];

    const openModal  = (m) => setModal(m);
    const closeModal = ()  => { setModal(null); setDeleteCategory(''); setDismissReason(''); setDismissNotes(''); setResolveNote(''); setSuspendDetail(''); };

    const handleAddNote = async () => {
        if (!resolutionNote.trim()) return;
        try {
            await addReportNote(id, resolutionNote);
            setNoteToast(true); setResolutionNote('');
            setTimeout(() => setNoteToast(false), 3000);
            const refreshed = await fetchReportById(id);
            setReport(refreshed.data);
        } catch (err) {
            toast.error('Error', 'Failed to add note.');
        }
    };

    const confirmAction = async (type) => {
        setActionLoading(true);
        try {
            if (type === 'dismissed') await dismissReport(id, dismissReason, dismissNotes);
            else if (type === 'resolved') await resolveReport(id, resolveNote);
            else if (type === 'deleted') await deleteReportedContent(id, deleteCategory, notifyUser);
            else if (type === 'suspended') await suspendReportedUser(id, suspendReason, suspendDetail, sendEmail);

            const successMsg = {
                dismissed: 'Report has been dismissed.',
                resolved: 'Report has been marked as resolved.',
                deleted: 'Content has been deleted.',
                suspended: 'User account has been suspended.'
            };
            toast.success('Action Completed', successMsg[type] || 'Action processed successfully.');
            closeModal();
            setSuccess(type);
            if (type === 'deleted' || type === 'suspended') {
                try {
                    const refreshed = await fetchReportById(id);
                    setReport(refreshed.data);
                } catch (_) {}
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || `Failed to process ${type}. Please try again.`;
            toast.error('Action Failed', errorMsg);
            closeModal();
        } finally {
            setActionLoading(false);
        }
    };

    const closeSuccess = async (dest) => {
        setSuccess(null);
        try {
            const refreshed = await fetchReportById(id);
            setReport(refreshed.data);
        } catch (err) {
            toast.error('Error', 'Failed to refresh report data');
        }
        if (dest === 'dashboard') navigate('/admin');
        else if (dest === 'queue') navigate('/report-moderation');
    };

    if (loading) {
        return (
            <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Report Moderation">
                <div className="flex items-center justify-center h-64 text-text-secondary text-body-small">Loading report details...</div>
            </MainLayout>
        );
    }
    if (error || !report) {
        return (
            <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle="Report Moderation">
                <Card variant="container" className="border-state-error/30 bg-state-error/5">
                    <div className="flex items-center gap-md">
                        <AlertTriangle size={24} className="text-state-error shrink-0" />
                        <div>
                            <p className="text-body-medium-bold text-state-error">Failed to Load Report</p>
                            <p className="text-body-small text-text-secondary">{error || 'Report not found.'}</p>
                        </div>
                    </div>
                </Card>
            </MainLayout>
        );
    }

    const r = report;
    const effectiveStatus = r.dbStatus || r.status;
    const isFinalized = effectiveStatus === 'Resolved' || effectiveStatus === 'Dismissed';

    return (
        <MainLayout
            user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
            pageTitle="Report Moderation"
        >
            <div className="flex flex-col gap-lg">
                {noteToast && (
                    <div className="fixed top-20 right-4 z-50 bg-state-success/20 border border-state-success/30 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg backdrop-blur-md">
                        <CheckCircle2 size={20} className="text-state-success" />
                        <span className="text-body-small-bold text-state-success font-inter">Note added successfully!</span>
                    </div>
                )}

                {isFinalized && (
                    <div className={`w-full p-4 rounded-2xl border flex items-center gap-4 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 ${
                        effectiveStatus === 'Resolved' 
                            ? 'bg-state-success/10 border-state-success/30 text-state-success shadow-lg shadow-state-success/5' 
                            : 'bg-white/5 border-white/20 text-text-secondary'
                    }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            effectiveStatus === 'Resolved' ? 'bg-state-success/20' : 'bg-white/10'
                        }`}>
                            {effectiveStatus === 'Resolved' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-body-medium-bold">This report has been {effectiveStatus.toLowerCase()}.</h3>
                            <p className="text-body-small opacity-80">
                                {effectiveStatus === 'Resolved' 
                                    ? 'Administrative action has been taken and the case is now closed.' 
                                    : 'This report was reviewed and dismissed. No further action will be taken.'}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <span className="text-body-extra-small font-bold opacity-60 uppercase tracking-widest">Case Finalized</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-heading-small text-text-primary">Report #{r.id.replace('R-','')}</h1>
                            <StatusBadge status={r.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <TypeBadge type={r.type} />
                            <span className="text-body-small text-text-secondary">Submitted {r.submittedAgo} • Priority <span className="text-state-error font-bold">{r.priority}</span></span>
                        </div>
                    </div>
                    {!isFinalized && <Button variant="primary" size="medium" icon={CheckCircle2} onClick={() => openModal('resolve')}>Mark as Resolved</Button>}
                    {isFinalized && (
                        <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[100px] text-sm font-bold font-inter ${
                            r.status === 'Resolved' ? 'bg-state-success/10 text-state-success border border-state-success/30' : 'bg-white/10 text-text-secondary border border-white/20'
                        }`}>
                            <CheckCircle2 size={16} /> {r.status}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                    <Card variant="card" padding="p-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2"><FileText size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Reported Content</span></div>
                            <span className="text-body-extra-small text-text-secondary">ID: {r.reportedContent.id}</span>
                        </div>
                        <div className="flex items-center gap-md mb-3">
                            <img src={avatar(r.reportedContent.author, r.reportedContent.avatar)} alt={r.reportedContent.author} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
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
                                <img src={avatar(r.reportedBy.name, r.reportedBy.avatar)} alt={r.reportedBy.name} className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0" />
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
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-4">
                                <p className="text-body-extra-small text-text-tertiary mb-1">Reporter&apos;s Note:</p>
                                <p className="text-body-small text-text-secondary italic">{r.reportedBy.note}</p>
                            </div>

                            {r.evidence && r.evidence.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-body-extra-small text-text-tertiary uppercase tracking-wider mb-3">Submitted Evidence</p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {r.evidence.map((ev, i) => (
                                            <a 
                                                key={i} 
                                                href={ev.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-[72px] h-[72px] rounded-xl overflow-hidden border border-white/10 hover:border-primary-blue/30 transition-all cursor-pointer bg-white/5 flex flex-col items-center justify-center p-1.5 group"
                                                title={`View ${ev.name}`}
                                            >
                                                {ev.type === 'image' ? (
                                                    <img src={ev.url} alt="Evidence" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <FileText size={20} className="text-state-error/70" />
                                                        <span className="text-[9px] text-text-tertiary truncate w-full text-center">{ev.name}</span>
                                                    </div>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card variant="card" padding="p-lg">
                        <div className="flex items-center gap-2 mb-5"><UserX size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Offender Profile</span></div>
                        <div className="flex flex-col items-center text-center mb-5">
                            <img src={avatar(r.offender.name, r.offender.avatar)} alt={r.offender.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                            <h3 className="text-body-large-bold text-text-primary mt-3">{r.offender.name}</h3>
                            <p className="text-body-small text-text-secondary">{r.offender.handle} • ID: {r.offender.id}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <Button variant="outline" size="small" onClick={() => navigate(r.offender.role === "Business" ? `/active-businesses/${r.offender.id}` : `/student-management/${r.offender.id}`)}>View Profile</Button>
                                <Button variant="outline" size="small" onClick={() => navigate('/messages')}>Message</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div><p className="text-body-extra-small text-text-tertiary">Account Age</p><p className="text-body-small-bold text-text-primary">{r.offender.accountAge}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Last Active</p><p className="text-body-small-bold text-text-primary">{r.offender.lastActive}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Email Status</p><p className={`text-body-small-bold ${r.offender.emailStatus === 'Verified' ? 'text-state-success' : 'text-state-error'}`}>✓ {r.offender.emailStatus}</p></div>
                            <div><p className="text-body-extra-small text-text-tertiary">Region</p><p className="text-body-small-bold text-text-primary">🏳 {r.offender.region}</p></div>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            {r.violationHistory.length > 0 && (
                                <>
                                    <h4 className="text-body-small-bold text-text-primary mb-3">Violation History</h4>
                                    <div className="flex flex-col gap-3">
                                        {(showAllViolations ? r.violationHistory : r.violationHistory.slice(0, 3)).map((v, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div><p className="text-body-small-bold text-text-primary">{v.type}</p><p className="text-body-extra-small text-state-error">{v.date}</p></div>
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${v.status === 'Action Taken' ? 'bg-state-error/20 text-state-error' : v.status === 'Dismissed' ? 'bg-white/10 text-text-secondary' : 'bg-state-warning/20 text-state-warning'}`}>{v.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {r.violationHistory.length > 3 && (
                                        <button 
                                            className="w-full mt-4 text-center text-body-small-bold text-primary-blue hover:underline"
                                            onClick={() => setShowAllViolations(!showAllViolations)}
                                        >
                                            {showAllViolations ? 'Show Less' : `View All History (${r.violationHistory.length})`}
                                        </button>
                                    )}
                                </>
                            )}
                            {r.violationHistory.length === 0 && (
                                <>
                                    <h4 className="text-body-small-bold text-text-primary mb-3">Violation History</h4>
                                    <p className="text-body-extra-small text-text-secondary italic">No prior violations</p>
                                </>
                            )}
                        </div>
                    </Card>

                    <div className="flex flex-col gap-md">
                        <Card variant="card" padding="p-lg">
                            <div className="flex items-center gap-2 mb-4"><Flag size={16} className="text-primary-blue" /><span className="text-body-medium-bold text-text-primary">Actions</span></div>
                            <div className="mb-4">
                                <p className="text-body-extra-small text-text-tertiary uppercase tracking-wider mb-2">Resolution Note</p>
                                <textarea value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Add internal note explaining the decision..." className="w-full h-20 bg-white/5 rounded-xl border border-white/10 p-3 text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <Button variant="outline" fullWidth size="small" icon={AlertTriangle} onClick={handleAddNote} disabled={isFinalized}>Add Note</Button>
                                <Button variant="outline" fullWidth size="small" icon={AlertTriangle} onClick={() => openModal('dismiss')} disabled={isFinalized}>
                                    {effectiveStatus === 'Dismissed' ? '✓ Dismissed' : 'Dismiss Report'}
                                </Button>
                                <Button variant="dangerOutline" fullWidth size="small" icon={Trash2} onClick={() => openModal('delete')} disabled={isFinalized}>
                                    Delete {String(r.reportedContent.id).startsWith('comment_') ? 'Comment' : 'Post'}
                                </Button>
                                <Button variant="dangerOutline" fullWidth size="small" icon={UserX} onClick={() => openModal('suspend')} disabled={isFinalized}>Suspend User</Button>
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

            {modal === 'delete' && (
                <DeleteModal
                    open={true}
                    onClose={closeModal}
                    actionLoading={actionLoading}
                    deleteCategory={deleteCategory}
                    onDeleteCategoryChange={setDeleteCategory}
                    notifyUser={notifyUser}
                    onNotifyUserChange={setNotifyUser}
                    onConfirm={() => confirmAction('deleted')}
                    report={r}
                    avatar={avatar}
                    deleteOptions={deleteOptions}
                />
            )}
            {modal === 'dismiss' && (
                <DismissModal
                    open={true}
                    onClose={closeModal}
                    actionLoading={actionLoading}
                    dismissReason={dismissReason}
                    onDismissReasonChange={setDismissReason}
                    dismissNotes={dismissNotes}
                    onDismissNotesChange={setDismissNotes}
                    onConfirm={() => confirmAction('dismissed')}
                    report={r}
                    dismissOptions={dismissOptions}
                />
            )}
            {modal === 'resolve' && (
                <ResolveModal
                    open={true}
                    onClose={closeModal}
                    actionLoading={actionLoading}
                    resolveNote={resolveNote}
                    onResolveNoteChange={setResolveNote}
                    onConfirm={() => confirmAction('resolved')}
                    report={r}
                />
            )}
            {modal === 'suspend' && (
                <SuspendModal
                    open={true}
                    onClose={closeModal}
                    loading={actionLoading}
                    onConfirm={() => confirmAction('suspended')}
                    userName={r.offender.name}
                    userEmail={r.offender.email || ''}
                    userAvatar={avatar(r.offender.name, r.offender.avatar)}
                    suspendReason={suspendReason}
                    onSuspendReasonChange={setSuspendReason}
                    suspendDetail={suspendDetail}
                    onSuspendDetailChange={setSuspendDetail}
                    sendEmail={sendEmail}
                    onSendEmailChange={setSendEmail}
                    reasons={['Violation of Terms', 'Spam Activity', 'Non-payment']}
                />
            )}
            {success !== null && (
                <SuccessModal
                    open={true}
                    success={success}
                    report={r}
                    avatar={avatar}
                    onPrimaryAction={() => closeSuccess('dashboard')}
                    onSecondaryAction={() => setSuccess(null)}
                    onClose={() => setSuccess(null)}
                />
            )}
        </MainLayout>
    );
};

export default ReportDetail;
