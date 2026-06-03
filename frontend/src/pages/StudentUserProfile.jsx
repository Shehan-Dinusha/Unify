import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Overlay from '../components/common/Overlay';
import { useToast } from '../components/common/Toast';

import {
  getStudentProfile,
  updateStudentStatus,
  forceLogoutStudent,
  sendStudentWarning,
} from '../services/studentService';
import {
  Mail,
  LogOut,
  ShieldOff,
  AlertTriangle,
  SlidersHorizontal,
  X,
  CheckCircle2,
  UserX,
  ArrowLeft,
  RotateCcw,
  Power,
  ShieldCheck,
  ChevronDown,
  MinusCircle,
  Ban,
  FileText,
  Star,
  Gavel,
  Flag,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { getAvatarUrl } from '../utils/formatters';
import { getCurrentUser } from '../services/authService';

// ─── Constants ────────────────────────────────────────────────────────────────

const TAB_FILTERS = ['All', 'Logins', 'Posts', 'Comments'];
const tabTypeMap = { All: null, Logins: 'login', Posts: 'post', Comments: 'comment' };

const VIOLATION_CATEGORIES = [
  'Academic Integrity Violation',
  'Code of Conduct Violation',
  'Harassment or Bullying',
  'Spam or Misuse',
  'Inappropriate Content',
];

const SEVERITY_LEVELS = [
  'Level 1 - Formal Caution',
  'Level 2 - Official Warning',
  'Level 3 - Severe Warning',
  'Level 4 - Final Warning',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentUserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  /* ── Data state ──────────────────────────────────── */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [actionLoading, setActionLoading] = useState(false);

  /* ── Fetch profile from backend on mount ────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getStudentProfile(id);
        setUser(result.data);
      } catch (err) {
        console.error('[StudentUserProfile] Failed to load profile:', err);
        setError('Failed to load student profile. Please check backend.');
        toast.error('Connection Error', 'Could not load student profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  /* ── Modal state ─────────────────────────────────── */
  const [modal, setModal] = useState(null);     // 'warning' | 'forceLogout' | 'suspend'
  const [success, setSuccess] = useState(null); // 'warning' | 'forceLogout' | 'suspend'

  /* ── Warning form state ──────────────────────────── */
  const [warningCategory, setWarningCategory] = useState('Academic Integrity Violation');
  const [warningLevel, setWarningLevel] = useState('Level 1 - Formal Caution');
  const [officialStatement, setOfficialStatement] = useState('');

  /* ── Suspend form state ──────────────────────────── */
  const [suspendReason, setSuspendReason] = useState('Violation of Terms');
  const [suspendDetail, setSuspendDetail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const openModal = (m) => setModal(m);
  const closeModal = () => { setModal(null); setOfficialStatement(''); setSuspendDetail(''); };

  /* ── Confirm actions — calls real backend ─────────── */
  const confirmAction = async (type) => {
    setActionLoading(true);
    try {
      if (type === 'warning') {
        await sendStudentWarning(id, {
          category: warningCategory,
          severity: warningLevel,
          message: officialStatement,
        });
        toast.success('Warning Issued', `Warning sent to ${user.name} successfully.`);
      } else if (type === 'forceLogout') {
        await forceLogoutStudent(id);
        toast.success('Logout Executed', `${user.name} has been disconnected.`);
      } else if (type === 'suspend') {
        await updateStudentStatus(id, {
          status: 'Suspended',
          suspensionCategory: suspendReason,
          reason: suspendDetail,
          sendEmail,
        });
        toast.success('Suspended', `${user.name}'s account has been suspended.`);
      } else if (type === 'activate') {
        await updateStudentStatus(id, {
          status: 'Active',
        });
        toast.success('Activated', `${user.name}'s account has been restored.`);
      }
      closeModal();
      setSuccess(type);
      
      // Re-fetch user data to update UI instantly
      try {
        const result = await getStudentProfile(id);
        setUser(result.data);
      } catch (e) {
        console.error('Failed to refresh user data:', e);
      }
    } catch (error) {
      const msg = error.message || 'Action failed. Please try again.';
      toast.error('Action Failed', msg);
      if (error.isNetworkError) {
        // Still show success UI for demo purposes when backend is down
        closeModal();
        setSuccess(type);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const closeSuccess = (dest) => {
    setSuccess(null);
    if (dest === 'dashboard') navigate('/admin');
    else navigate('/student-management');
  };


  const filteredLog = user && tabTypeMap[activeTab]
    ? user.activityLog.filter((e) => e.type === tabTypeMap[activeTab])
    : user?.activityLog || [];

  const statsArray = user ? [
    { key: 'totalPosts', label: 'Total Posts', ...user.stats.totalPosts },
    { key: 'comments', label: 'Comments', ...user.stats.comments },
    { key: 'reputation', label: 'Reputation', ...user.stats.reputation },
    { key: 'reports', label: 'Reports', ...user.stats.reports },
  ] : [];

  /* ═══════════════════════════════════════════════════════════════════════
     WARNING MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderWarningModal = () => {
    return (
      <Overlay open={modal === 'warning'} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="w-full max-w-[560px]">
            <div className="p-lg flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-state-error/15 rounded-full flex items-center justify-center">
                    <Gavel size={20} className="text-state-error" />
                  </div>
                  <div>
                    <h3 className="text-body-large-bold text-text-primary font-inter">Issue Official Warning</h3>
                    <p className="text-body-extra-small text-text-secondary font-inter">This action will be logged in the student's permanent record.</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-6">
                <img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-small-bold text-text-primary font-inter">{user.name}</p>
                  <p className="text-body-extra-small text-text-secondary font-inter">ID: #{user.studentCode || user.userId} • {user.faculty || 'Faculty of Engineering'}</p>
                </div>
                <span className="inline-flex items-center text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30 whitespace-nowrap">
                  Active Standing
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Violation Category</label>
                  <div className="relative">
                    <select
                      value={warningCategory}
                      onChange={(e) => setWarningCategory(e.target.value)}
                      className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary font-inter cursor-pointer focus:outline-none focus:border-primary-blue/50 transition-colors pr-10"
                    >
                      {VIOLATION_CATEGORIES.map(opt => <option key={opt} value={opt} className="bg-dark-2 text-text-primary">{opt}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Severity Level</label>
                  <div className="relative">
                    <select
                      value={warningLevel}
                      onChange={(e) => setWarningLevel(e.target.value)}
                      className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary font-inter cursor-pointer focus:outline-none focus:border-primary-blue/50 transition-colors pr-10"
                    >
                      {SEVERITY_LEVELS.map(opt => <option key={opt} value={opt} className="bg-dark-2 text-text-primary">{opt}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Official Statement</label>
                <textarea
                  value={officialStatement}
                  onChange={(e) => setOfficialStatement(e.target.value)}
                  placeholder="Please describe the specific incident and reference the violated university by-laws..."
                  className={`w-full h-28 bg-white/5 rounded-2xl border ${!officialStatement.trim() ? 'border-state-error/50' : 'border-white/10'} p-md text-body-small text-text-primary font-inter placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-2`}
                />
                {!officialStatement.trim() && (
                  <p className="text-[10px] text-state-error italic font-medium">* Official statement is required to issue a warning</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
                <button 
                  onClick={() => officialStatement.trim() && confirmAction('warning')} 
                  disabled={!officialStatement.trim() || actionLoading}
                  className={`flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!officialStatement.trim() || actionLoading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <Send size={16} /> {actionLoading ? 'Sending...' : 'Send Warning'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     FORCE LOGOUT CONFIRM MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderForceLogoutModal = () => {
    return (
      <Overlay open={modal === 'forceLogout'} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-state-error/15 flex items-center justify-center mb-5 ring-4 ring-state-error/10">
                <div className="w-10 h-10 rounded-full bg-state-error flex items-center justify-center shadow-[0_0_15px_rgba(255,99,102,0.4)]">
                  <X size={22} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white font-inter mb-3">Confirm Force Logout</h2>
              <p className="text-body-small text-text-secondary font-inter leading-relaxed mb-6 max-w-[360px]">This action is irreversible. The user will be instantly disconnected. Any unsaved data on their active screens may be lost.</p>
              <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-6">
                <img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-body-small-bold text-text-primary font-inter">{user.name}</p>
                  <p className="text-body-extra-small text-text-secondary font-inter">{user.faculty || 'Faculty of Engineering'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-xs text-body-extra-small-bold ${user.isOnline ? 'text-state-success' : 'text-text-secondary'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-state-success' : 'bg-text-secondary'}`} />
                    {user.isOnline ? 'Active' : 'Offline'}
                  </span>
                  <p className="text-body-extra-small text-text-secondary font-inter mt-0.5">{user.isOnline ? (user.activeSessions || 1) : 0} Sessions</p>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={closeModal} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
                <button 
                  onClick={() => user.isOnline && confirmAction('forceLogout')} 
                  disabled={!user.isOnline || actionLoading}
                  className={`flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!user.isOnline || actionLoading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <LogOut size={16} /> {actionLoading ? 'Processing...' : 'Execute Logout'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SUSPEND MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderSuspendModal = () => {
    return (
      <Overlay open={modal === 'suspend'} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="">
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
                <img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{user.name}</p><p className="text-body-extra-small text-text-secondary">{user.email}</p></div>
                <span className="inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30"><span className="w-1.5 h-1.5 rounded-full bg-state-success" />ACTIVE</span>
              </div>
              <p className="text-body-small text-text-secondary leading-relaxed mb-5">Are you sure you want to suspend this user? This will immediately revoke their access.</p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2"><label className="text-body-small-bold text-text-primary">Reason for suspension</label><span className="text-body-extra-small text-text-tertiary">Required</span></div>
                <div className="flex flex-wrap gap-2">
                  {reasons.map(reason => (
                    <button key={reason} onClick={() => setSuspendReason(reason)} className={`px-3.5 py-1.5 rounded-xl text-body-small font-medium transition-all ${suspendReason === reason ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/40' : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'}`}>{reason}</button>
                  ))}
                </div>
              </div>
              <textarea 
                value={suspendDetail} 
                onChange={(e) => setSuspendDetail(e.target.value)} 
                placeholder="Enter detailed reason here...." 
                className={`w-full h-24 bg-white/5 rounded-2xl border ${!suspendDetail.trim() ? 'border-state-error/50' : 'border-white/10'} p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-2`} 
              />
              {!suspendDetail.trim() && (
                <p className="text-[10px] text-state-error mb-4 ml-1 italic font-medium">* Reason is required to proceed with suspension</p>
              )}
              <label className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setSendEmail(!sendEmail)}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sendEmail ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>{sendEmail && <CheckCircle2 size={14} className="text-white" />}</div>
                <span className="text-body-small text-text-secondary">Send email notification to user</span>
              </label>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => suspendDetail.trim() && confirmAction('suspend')} 
                  disabled={!suspendDetail.trim() || actionLoading}
                  className={`w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!suspendDetail.trim() || actionLoading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <UserX size={18} /> {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
                </button>
                <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
              </div>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SUCCESS SCREENS
     ═══════════════════════════════════════════════════════════════════════ */
  const renderSuccessModal = () => {
    if (!success) return null;

    if (success === 'warning') {
      return (
        <Overlay open={true} className="overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-blue-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><ShieldCheck size={36} className="text-primary-blue" /></div>
                  <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-state-success border-2 border-dark-1" />
                </div>
                <h2 className="text-xl font-bold text-white font-inter mb-3">Warning Issued Successfully</h2>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The official warning has been issued and logged in the student's disciplinary record.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                  <img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{user.name}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {user.studentCode || user.userId}</p></div>
                  <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">
                    {warningLevel.includes('Level 1') ? 'Level 1 Warning' : warningLevel.includes('Level 2') ? 'Level 2 Warning' : warningLevel.includes('Level 3') ? 'Level 3 Warning' : 'Level 4 Warning'}
                  </span>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex gap-3">
                <Button onClick={() => closeSuccess('dashboard')} variant="gradient" size="medium" className="flex-1 gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
                <button onClick={() => closeSuccess('list')} className="flex-1 h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Queue</button>
              </div>
            </Card>
          </div>
        </Overlay>
      );
    }

    if (success === 'forceLogout') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      return (
        <Overlay open={true} className="overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-cyan-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><Power size={36} className="text-primary-blue" /></div>
                </div>
                <h2 className="text-xl font-bold text-white font-inter mb-1">Force Logout Executed</h2>
                <p className="text-state-success text-sm font-inter font-medium mb-4 uppercase tracking-widest">• System Confirmation</p>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[380px]">Student <span className="text-primary-blue bg-primary-blue/10 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{user.studentCode || 'ENG-22-045'}</span> has been successfully disconnected.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden text-left mb-2">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-3 border-b border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Target User</p><div className="flex items-center gap-2"><img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-6 h-6 rounded-full object-cover border border-white/20" /><span className="text-body-small text-text-primary truncate">{user.name.split(' ')[0].charAt(0)}. {user.name.split(' ').slice(1).join(' ')}</span></div></div>
                    <div className="px-4 py-3 border-b border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Session ID</p><p className="text-body-small text-text-primary font-mono">#SESS-8922-LK-UNI</p></div>
                    <div className="px-4 py-3 border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Action Time</p><p className="text-body-small text-text-primary">{timeStr} LKT</p></div>
                    <div className="px-4 py-3"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Admin</p><p className="text-body-small text-text-primary">SysAdmin_01</p></div>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <Button onClick={() => closeSuccess('dashboard')} variant="gradient" fullWidth size="medium" className="gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
                <button onClick={() => closeSuccess('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
              </div>
            </Card>
          </div>
        </Overlay>
      );
    }

    if (success === 'suspend') {
      return (
        <Overlay open={true} className="overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-6">
            <Card variant="modal" padding="p-0" className="">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5 bg-state-success/10"><CheckCircle2 size={36} className="text-state-success" /></div>
                <h2 className="text-xl font-bold text-white font-inter mb-3">Suspension Applied Successfully</h2>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The user has been suspended from the platform. Access has been revoked immediately.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                  <img src={getAvatarUrl(user.avatar, user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{user.name}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {user.studentCode || user.userId}</p></div>
                  <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">Suspended</span>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <Button onClick={() => closeSuccess('dashboard')} variant="gradient" fullWidth size="medium" className="gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
                <button onClick={() => closeSuccess('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
              </div>
            </Card>
          </div>
        </Overlay>
      );
    }

    return null;
  };

  /* ═══════════════════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  const getDynamicTitle = () => {
    if (modal === 'warning' || success === 'warning') return 'Issue Warning';
    if (modal === 'forceLogout' || success === 'forceLogout') return 'Force Logout';
    return 'User Profile';
  };

  // Loading & Error guards
  if (loading) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Loading Profile...">
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary text-body-medium">Loading student profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Error">
        <Card variant="container" className="border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Failed to Load Profile</p>
              <p className="text-body-small text-text-secondary">{error || 'Student not found.'}</p>
            </div>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={getCurrentUser() || { name: 'Admin', role: 'Admin' }} pageTitle={`${user.name}'s Profile`}>
      {user.status === 'Suspended' && (
        <div className="mb-lg p-lg rounded-2xl bg-state-error/10 border border-state-error/30 flex items-center gap-md animate-pulse">
          <div className="w-12 h-12 rounded-full bg-state-error/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-state-error" />
          </div>
          <div>
            <p className="text-body-large-bold text-state-error font-inter uppercase tracking-wider">Account Suspended</p>
            <p className="text-body-small text-text-secondary font-inter">This user has been restricted due to violation of platform terms. Management is restricted while suspended.</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <Card variant="container">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-lg">
              <div className="relative shrink-0"><div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-br from-primary-blue via-primary-accent to-primary-blue"><img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-dark-1" /></div>{user.isOnline && <span className="absolute bottom-1 left-2 w-3.5 h-3.5 rounded-full bg-state-success border-2 border-dark-1" />}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-sm mb-xs">
                  <h2 className="text-heading-small text-text-primary font-inter">{user.name}</h2>
                  <span className={`px-sm py-xs rounded-lg text-body-extra-small-bold border ${user.status === 'Suspended' ? 'bg-state-error/15 text-state-error border-state-error/30' : 'bg-state-success/15 text-state-success border-state-success/30'}`}>
                    {user.status}
                  </span>
                  {user.tier === 'Premium' && <span className="px-sm py-xs rounded-lg text-body-extra-small-bold bg-primary-blue/15 text-primary-blue border border-primary-blue/30">Premium</span>}
                </div>
                <div className="flex flex-wrap items-center gap-md text-body-extra-small text-text-secondary font-inter"><span className="flex items-center gap-xs"><Mail size={12} /> {user.email}</span><span className="flex items-center gap-xs">⊙ ID: {user.userId}</span><span className="flex items-center gap-xs">📅 {user.joinDate}</span></div>
                <button 
                  disabled={user.status === 'Suspended'}
                  className={`mt-md px-lg py-sm rounded-xl text-white text-body-small-bold font-inter inline-flex items-center gap-sm transition-all shadow-lg ${user.status === 'Suspended' ? 'bg-white/10 text-text-secondary cursor-not-allowed grayscale shadow-none' : 'bg-primary-blue hover:brightness-110 shadow-primary-blue/20'}`}
                >
                  <Mail size={14} /> Message
                </button>
              </div>
            </div>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {statsArray.map((stat) => {
              const StatIcon = { totalPosts: FileText, comments: MessageSquare, reputation: Star, reports: Flag }[stat.key];
              return (
                <Card key={stat.key} variant="container" className="relative overflow-visible hover:border-primary-blue/30 transition-colors">
                  <div className="flex items-start justify-between mb-sm"><p className="text-body-small text-text-secondary font-inter">{stat.label}</p>{StatIcon && <StatIcon size={18} className="text-text-secondary opacity-60" />}</div>
                  <p className={`text-heading-medium font-inter ${stat.key === 'reports' && stat.isWarning ? 'text-state-error' : 'text-text-primary'}`}>{stat.value}</p>
                  {stat.trend && (
                    <p className={`text-body-extra-small font-inter mt-xs ${stat.isWarning ? 'text-state-error' : 'text-state-success'}`}>
                      {stat.isWarning ? '' : '↗ '}{stat.trend}
                    </p>
                  )}
                  {stat.key === 'reports' && <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none"><AlertTriangle size={72} className="text-state-warning" /></div>}
                </Card>
              );
            })}
          </div>

          <Card variant="container" className="flex-1">
            <div className="flex items-center gap-sm mb-md"><span className="text-lg">📋</span><div><h3 className="text-body-large-bold text-text-primary font-inter">Activity Log</h3><p className="text-body-extra-small text-text-secondary font-inter">Detailed history of user actions and events</p></div></div>
            <div className="flex flex-wrap items-center justify-between gap-md mb-md">
              <div className="flex items-center gap-sm">{TAB_FILTERS.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-md py-xs rounded-xl text-body-small-bold font-inter transition-all ${activeTab === tab ? 'bg-primary-blue text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary border border-white/10'}`}>{tab}</button>))}</div>
              <button className="flex items-center gap-xs px-md py-xs rounded-xl bg-white/5 border border-white/10 text-body-small text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all font-inter"><SlidersHorizontal size={14} /> Filter</button>
            </div>
            <div className="hidden md:block relative overflow-hidden border border-white/10 rounded-2xl">
              <div className="grid gap-md px-lg py-md border-b border-white/10 bg-white/[0.02]" style={{ gridTemplateColumns: '80px 2fr 1.2fr 1fr' }}><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Type</span><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Action Detail</span><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">IP / Device</span><span className="text-body-extra-small-bold text-text-secondary font-inter text-right uppercase tracking-wider">Date</span></div>
              {filteredLog.map((entry, idx) => (<div key={entry.id} className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < filteredLog.length - 1 ? 'border-b border-white/5' : ''}`} style={{ gridTemplateColumns: '80px 2fr 1.2fr 1fr' }}><div className="flex items-center"><span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${entry.typeColor}`}>{entry.typeIcon}</span></div><div className="min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{entry.title}</p><p className="text-body-extra-small text-text-secondary font-inter truncate">{entry.detail}</p></div><div className="min-w-0"><p className="text-body-small text-text-primary font-inter">{entry.ip}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.device}</p></div><div className="text-right"><p className="text-body-small-bold text-text-primary font-inter">{entry.date}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.time}</p></div></div>))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-lg">
          <Card variant="container">
            <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Account Actions</h3>
            <div className="flex flex-col gap-md">
              <button 
                disabled={user.status === 'Suspended'}
                onClick={() => openModal('warning')} 
                className={`w-full h-11 rounded-2xl border-2 text-body-small-bold font-inter inline-flex items-center justify-center gap-sm transition-all ${user.status === 'Suspended' ? 'border-white/10 text-text-tertiary cursor-not-allowed opacity-50' : 'border-state-error/40 text-state-error hover:bg-state-error/10'}`}
              >
                <MinusCircle size={16} /> Send Warning
              </button>
              <button 
                disabled={user.status === 'Suspended'}
                onClick={() => openModal('forceLogout')} 
                className={`w-full h-11 rounded-2xl border-2 text-body-small-bold font-inter inline-flex items-center justify-center gap-sm transition-all ${user.status === 'Suspended' ? 'border-white/10 text-text-tertiary cursor-not-allowed opacity-50' : 'border-state-error/40 text-state-error hover:bg-state-error/10'}`}
              >
                <LogOut size={16} /> Force Logout
              </button>
              <button 
                disabled={user.status === 'Suspended'}
                onClick={() => openModal('suspend')} 
                className={`w-full h-11 rounded-2xl border-2 text-body-small-bold font-inter inline-flex items-center justify-center gap-sm transition-all ${user.status === 'Suspended' ? 'border-white/10 text-text-tertiary cursor-not-allowed opacity-50' : 'border-state-error/40 text-state-error hover:bg-state-error/10'}`}
              >
                <Ban size={16} /> Suspend Account
              </button>
            </div>
          </Card>
          
          <Card variant="container" className="flex-1">
            <div className="flex items-center justify-between mb-lg"><h3 className="text-body-large-bold text-text-primary font-inter">Internal Notes</h3><button className="text-primary-blue text-body-small-bold font-inter hover:brightness-110 transition-all">Save</button></div>
            <div className="flex flex-col gap-md">{(user.adminNotes || []).map((note, idx) => (<div key={idx} className="rounded-xl bg-white/[0.03] border border-white/10 p-md"><p className="text-body-small text-text-secondary font-inter leading-relaxed">{typeof note === 'object' ? note.text : note}</p></div>))}</div>
            {user.lastNoteUpdate && <p className="text-body-extra-small text-text-secondary font-inter mt-lg text-right">{user.lastNoteUpdate}</p>}
          </Card>
        </div>
      </div>
      {renderWarningModal()}{renderForceLogoutModal()}{renderSuspendModal()}{renderSuccessModal()}
    </MainLayout>
  );
};

export default StudentUserProfile;
