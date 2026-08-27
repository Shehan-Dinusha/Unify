import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import WarningModal from '../../components/common/WarningModal';
import SuspendModal from '../../components/common/SuspendModal';
import { useToast } from '../../components/common/Toast';

import {
  getStudentProfile,
  updateStudentStatus,
  forceLogoutStudent,
  sendStudentWarning,
} from '../../services/studentService';
import {
  AlertTriangle,
  MinusCircle,
  LogOut,
  Ban,
} from 'lucide-react';
import { getAvatarUrl } from '../../utils/formatters';
import { getCurrentUser } from '../../services/authService';
import ProfileHeader from './ProfileHeader';
import ActivityLog from './ActivityLog';
import ForceLogoutModal from './ForceLogoutModal';
import SuccessModal from './SuccessModal';

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

const SUSPEND_REASONS = [
  'Violation of Terms',
  'Spam Activity',
  'Non-payment',
];

const StudentUserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getStudentProfile(id);
        setUser(result.data);
      } catch (err) {
        setError('Failed to load student profile. Please check backend.');
        toast.error('Connection Error', 'Could not load student profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState(null);

  const [warningCategory, setWarningCategory] = useState('Academic Integrity Violation');
  const [warningLevel, setWarningLevel] = useState('Level 1 - Formal Caution');
  const [officialStatement, setOfficialStatement] = useState('');

  const [suspendReason, setSuspendReason] = useState('Violation of Terms');
  const [suspendDetail, setSuspendDetail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const openModal = (m) => setModal(m);
  const closeModal = () => { setModal(null); setOfficialStatement(''); setSuspendDetail(''); };

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

      try {
        const result = await getStudentProfile(id);
        setUser(result.data);
      } catch (e) {
        toast.error("Error", "Failed to refresh user data");
      }
    } catch (error) {
      const msg = error.message || 'Action failed. Please try again.';
      toast.error('Action Failed', msg);
      if (error.isNetworkError) {
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

  const statsArray = user ? [
    { key: 'totalPosts', label: 'Total Posts', ...user.stats.totalPosts },
    { key: 'comments', label: 'Comments', ...user.stats.comments },
    { key: 'reputation', label: 'Reputation', ...user.stats.reputation },
    { key: 'reports', label: 'Reports', ...user.stats.reports },
  ] : [];

  const userForHeader = user ? {
    ...user,
    avatarUrl: getAvatarUrl(user.avatar, user.name),
  } : null;

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
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <ProfileHeader user={userForHeader} statsArray={statsArray} />

          <ActivityLog
            log={user.activityLog || []}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

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

      <WarningModal
        open={modal === 'warning'}
        onClose={closeModal}
        loading={actionLoading}
        onConfirm={() => confirmAction('warning')}
        userName={user.name}
        userId={user.studentCode || user.userId}
        userFaculty={user.faculty || 'Faculty of Engineering'}
        userAvatar={getAvatarUrl(user.avatar, user.name)}
        warningCategory={warningCategory}
        onWarningCategoryChange={setWarningCategory}
        warningLevel={warningLevel}
        onWarningLevelChange={setWarningLevel}
        officialStatement={officialStatement}
        onOfficialStatementChange={setOfficialStatement}
        violationCategories={VIOLATION_CATEGORIES}
        severityLevels={SEVERITY_LEVELS}
      />

      <ForceLogoutModal
        open={modal === 'forceLogout'}
        onClose={closeModal}
        onConfirm={() => confirmAction('forceLogout')}
        loading={actionLoading}
        userName={user.name}
        userAvatar={getAvatarUrl(user.avatar, user.name)}
        userFaculty={user.faculty || 'Faculty of Engineering'}
        isOnline={user.isOnline}
        activeSessions={user.activeSessions}
      />

      <SuspendModal
        open={modal === 'suspend'}
        onClose={closeModal}
        loading={actionLoading}
        onConfirm={() => confirmAction('suspend')}
        userName={user.name}
        userEmail={user.email}
        userAvatar={getAvatarUrl(user.avatar, user.name)}
        suspendReason={suspendReason}
        onSuspendReasonChange={setSuspendReason}
        suspendDetail={suspendDetail}
        onSuspendDetailChange={setSuspendDetail}
        sendEmail={sendEmail}
        onSendEmailChange={setSendEmail}
        reasons={SUSPEND_REASONS}
      />

      <SuccessModal
        open={success !== null}
        type={success}
        onClose={closeSuccess}
        userName={user.name}
        userId={user.studentCode || user.userId}
        userAvatar={getAvatarUrl(user.avatar, user.name)}
        warningLevel={warningLevel}
      />
    </MainLayout>
  );
};

export default StudentUserProfile;
