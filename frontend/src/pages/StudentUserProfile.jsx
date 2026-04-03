import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockRequests } from '../data/mockData';
import { studentProfiles } from '../data/mockStudentProfiles';
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
  const user = studentProfiles.find((u) => String(u.id) === String(id)) || studentProfiles[0];
  const [activeTab, setActiveTab] = useState('All');

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
  const confirmAction = (type) => { closeModal(); setSuccess(type); };
  const closeSuccess = (dest) => {
    setSuccess(null);
    if (dest === 'dashboard') navigate('/admin');
    else navigate('/student-management');
  };

  const avatar = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`;

  const filteredLog = tabTypeMap[activeTab]
    ? user.activityLog.filter((e) => e.type === tabTypeMap[activeTab])
    : user.activityLog;

  const statsArray = [
    { key: 'totalPosts', label: 'Total Posts', ...user.stats.totalPosts },
    { key: 'comments', label: 'Comments', ...user.stats.comments },
    { key: 'reputation', label: 'Reputation', ...user.stats.reputation },
    { key: 'reports', label: 'Reports', ...user.stats.reports },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     WARNING MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderWarningModal = () => {
    if (modal !== 'warning') return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6">
          <Card variant="card" padding="p-0" className="w-full max-w-[560px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
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
                <img src={avatar(user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
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
                  className="w-full h-28 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary font-inter placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
                <button onClick={() => confirmAction('warning')} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><Send size={16} /> Send Warning</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     FORCE LOGOUT CONFIRM MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderForceLogoutModal = () => {
    if (modal !== 'forceLogout') return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6">
          <Card variant="card" padding="p-0" className="w-full max-w-[480px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-state-error/15 flex items-center justify-center mb-5 ring-4 ring-state-error/10">
                <div className="w-10 h-10 rounded-full bg-state-error flex items-center justify-center shadow-[0_0_15px_rgba(255,99,102,0.4)]">
                  <X size={22} className="text-white" strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white font-inter mb-3">Confirm Force Logout</h2>
              <p className="text-body-small text-text-secondary font-inter leading-relaxed mb-6 max-w-[360px]">This action is irreversible. The user will be instantly disconnected. Any unsaved data on their active screens may be lost.</p>
              <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-6">
                <img src={avatar(user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-body-small-bold text-text-primary font-inter">{user.name}</p>
                  <p className="text-body-extra-small text-text-secondary font-inter">{user.faculty || 'Faculty of Engineering'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-xs text-body-extra-small-bold text-state-success"><span className="w-1.5 h-1.5 rounded-full bg-state-success" />Active</span>
                  <p className="text-body-extra-small text-text-secondary font-inter mt-0.5">{user.activeSessions || 3} Sessions</p>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={closeModal} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
                <button onClick={() => confirmAction('forceLogout')} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><LogOut size={16} /> Execute Logout</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SUSPEND MODAL
     ═══════════════════════════════════════════════════════════════════════ */
  const renderSuspendModal = () => {
    if (modal !== 'suspend') return null;
    const reasons = ['Violation of Terms', 'Spam Activity', 'Harassment'];
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
                <img src={avatar(user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
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
              <textarea value={suspendDetail} onChange={(e) => setSuspendDetail(e.target.value)} placeholder="Enter detailed reason here...." className="w-full h-24 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-4" />
              <label className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setSendEmail(!sendEmail)}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sendEmail ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>{sendEmail && <CheckCircle2 size={14} className="text-white" />}</div>
                <span className="text-body-small text-text-secondary">Send email notification to user</span>
              </label>
              <div className="flex flex-col gap-3">
                <button onClick={() => confirmAction('suspend')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><UserX size={18} /> Confirm Suspension</button>
                <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     SUCCESS SCREENS
     ═══════════════════════════════════════════════════════════════════════ */
  const renderSuccessModal = () => {
    if (!success) return null;

    if (success === 'warning') {
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
          <div className="min-h-full flex items-center justify-center px-4 py-6">
            <Card variant="card" padding="p-0" className="w-full max-w-[480px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-blue-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><ShieldCheck size={36} className="text-primary-blue" /></div>
                  <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-state-success border-2 border-dark-1" />
                </div>
                <h2 className="text-xl font-bold text-white font-inter mb-3">Warning Issued Successfully</h2>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The official warning has been issued and logged in the student's disciplinary record.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                  <img src={avatar(user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{user.name}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {user.studentCode || user.userId}</p></div>
                  <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">
                    {warningLevel.includes('Level 1') ? 'Level 1 Warning' : warningLevel.includes('Level 2') ? 'Level 2 Warning' : warningLevel.includes('Level 3') ? 'Level 3 Warning' : 'Level 4 Warning'}
                  </span>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex gap-3">
                <button onClick={() => closeSuccess('dashboard')} className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><ArrowLeft size={16} /> Return to Dashboard</button>
                <button onClick={() => closeSuccess('list')} className="flex-1 h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Queue</button>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (success === 'forceLogout') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
          <div className="min-h-full flex items-center justify-center px-4 py-6">
            <Card variant="card" padding="p-0" className="w-full max-w-[480px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-cyan-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><Power size={36} className="text-primary-blue" /></div>
                </div>
                <h2 className="text-xl font-bold text-white font-inter mb-1">Force Logout Executed</h2>
                <p className="text-state-success text-sm font-inter font-medium mb-4 uppercase tracking-widest">• System Confirmation</p>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[380px]">Student <span className="text-primary-blue bg-primary-blue/10 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{user.studentCode || 'ENG-22-045'}</span> has been successfully disconnected.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden text-left mb-2">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-3 border-b border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Target User</p><div className="flex items-center gap-2"><img src={avatar(user.name)} alt="" className="w-6 h-6 rounded-full object-cover border border-white/20" /><span className="text-body-small text-text-primary truncate">{user.name.split(' ')[0].charAt(0)}. {user.name.split(' ').slice(1).join(' ')}</span></div></div>
                    <div className="px-4 py-3 border-b border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Session ID</p><p className="text-body-small text-text-primary font-mono">#SESS-8922-LK-UNI</p></div>
                    <div className="px-4 py-3 border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Action Time</p><p className="text-body-small text-text-primary">{timeStr} LKT</p></div>
                    <div className="px-4 py-3"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Admin</p><p className="text-body-small text-text-primary">SysAdmin_01</p></div>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <button onClick={() => closeSuccess('dashboard')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><ArrowLeft size={16} /> Return to Dashboard</button>
                <button onClick={() => closeSuccess('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    if (success === 'suspend') {
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
          <div className="min-h-full flex items-center justify-center px-4 py-6">
            <Card variant="card" padding="p-0" className="w-full max-w-[480px] outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
              <div className="p-8 pb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5 bg-state-success/10"><CheckCircle2 size={36} className="text-state-success" /></div>
                <h2 className="text-xl font-bold text-white font-inter mb-3">Suspension Applied Successfully</h2>
                <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The user has been suspended from the platform. Access has been revoked immediately.</p>
                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                  <img src={avatar(user.name)} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{user.name}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {user.studentCode || user.userId}</p></div>
                  <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">Suspended</span>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <button onClick={() => closeSuccess('dashboard')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><ArrowLeft size={16} /> Return to Dashboard</button>
                <button onClick={() => closeSuccess('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
              </div>
            </Card>
          </div>
        </div>
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

  return (
    <MainLayout user={{ name: 'Alex Johnson', role: 'admin' }} pageTitle={`${user.name}'s Profile`} verificationCount={mockRequests.length}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <Card variant="container">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-lg">
              <div className="relative shrink-0"><div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-br from-primary-blue via-primary-accent to-primary-blue"><img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-dark-1" /></div>{user.isOnline && <span className="absolute bottom-1 left-2 w-3.5 h-3.5 rounded-full bg-state-success border-2 border-dark-1" />}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-sm mb-xs"><h2 className="text-heading-small text-text-primary font-inter">{user.name}</h2><span className="px-sm py-xs rounded-lg text-body-extra-small-bold bg-state-success/15 text-state-success border border-state-success/30">{user.status}</span>{user.tier === 'Premium' && <span className="px-sm py-xs rounded-lg text-body-extra-small-bold bg-primary-blue/15 text-primary-blue border border-primary-blue/30">Premium</span>}</div>
                <div className="flex flex-wrap items-center gap-md text-body-extra-small text-text-secondary font-inter"><span className="flex items-center gap-xs"><Mail size={12} /> {user.email}</span><span className="flex items-center gap-xs">⊙ ID: {user.userId}</span><span className="flex items-center gap-xs">📅 {user.joinDate}</span></div>
                <button className="mt-md px-lg py-sm rounded-xl bg-primary-blue text-white text-body-small-bold font-inter inline-flex items-center gap-sm hover:brightness-110 transition-all shadow-lg shadow-primary-blue/20"><Mail size={14} /> Message</button>
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
                  <p className={`text-body-extra-small font-inter mt-xs ${stat.isWarning ? 'text-state-error' : 'text-state-success'}`}>{stat.isWarning ? '' : '↗ '}{stat.trend}</p>
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
              <button onClick={() => openModal('warning')} className="w-full h-11 rounded-2xl border-2 border-state-error/40 text-state-error text-body-small-bold font-inter inline-flex items-center justify-center gap-sm hover:bg-state-error/10 transition-all"><MinusCircle size={16} /> Send Warning</button>
              <button onClick={() => openModal('forceLogout')} className="w-full h-11 rounded-2xl border-2 border-state-error/40 text-state-error text-body-small-bold font-inter inline-flex items-center justify-center gap-sm hover:bg-state-error/10 transition-all"><LogOut size={16} /> Force Logout</button>
              <button onClick={() => openModal('suspend')} className="w-full h-11 rounded-2xl border-2 border-state-error/40 text-state-error text-body-small-bold font-inter inline-flex items-center justify-center gap-sm hover:bg-state-error/10 transition-all"><Ban size={16} /> Suspend Account</button>
            </div>
          </Card>
          
          <Card variant="container" className="flex-1">
            <div className="flex items-center justify-between mb-lg"><h3 className="text-body-large-bold text-text-primary font-inter">Internal Notes</h3><button className="text-primary-blue text-body-small-bold font-inter hover:brightness-110 transition-all">Save</button></div>
            <div className="flex flex-col gap-md">{user.internalNotes.map((note, idx) => (<div key={idx} className="rounded-xl bg-white/[0.03] border border-white/10 p-md"><p className="text-body-small text-text-secondary font-inter leading-relaxed">{note}</p></div>))}</div>
            {user.lastNoteUpdate && <p className="text-body-extra-small text-text-secondary font-inter mt-lg text-right">{user.lastNoteUpdate}</p>}
          </Card>
        </div>
      </div>
      {renderWarningModal()}{renderForceLogoutModal()}{renderSuspendModal()}{renderSuccessModal()}
    </MainLayout>
  );
};

export default StudentUserProfile;
