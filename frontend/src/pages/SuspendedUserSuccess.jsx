import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { CheckSmallIcon } from '../components/common/Icons';
import { ShieldCheck, LayoutDashboard, UserX, Loader2 } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { getSuspendedUserById } from '../services/suspensionService';

const SuspendedUserSuccess = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const location = useLocation();
  const [notifyStudent, setNotifyStudent] = useState(true);

  // Get data from navigation state (set by reactivation page)
  const stateData = location.state || {};
  const [userName, setUserName] = useState(stateData.userName || '');
  const [studentId, setStudentId] = useState(stateData.studentId || '');
  const [caseReference, setCaseReference] = useState(stateData.caseReference || '');
  const [loading, setLoading] = useState(!stateData.userName);

  // Fallback: If no state data, fetch from API
  useEffect(() => {
    if (stateData.userName) return; // Already have data from navigation state

    const fetchFallback = async () => {
      setLoading(true);
      try {
        const response = await getSuspendedUserById(id);
        if (response.success) {
          const data = response.data;
          setUserName(data.user?.name || 'Unknown User');
          setStudentId(data.user?.studentId || '');
          setCaseReference(data.suspension?.caseRef || '');
        }
      } catch (err) {
        toast.warning('Info', 'Could not load full details. Displaying available information.');
      } finally {
        setLoading(false);
      }
    };
    fetchFallback();
  }, [id, stateData.userName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle notification toggle feedback
  const handleNotifyToggle = () => {
    const next = !notifyStudent;
    setNotifyStudent(next);
    if (next) {
      toast.info('Notification Enabled', 'Student will be notified about account restoration.');
    } else {
      toast.info('Notification Disabled', 'Student will not receive a notification.');
    }
  };

  return (
    <MainLayout
      user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
      pageTitle="Reactivation Successful"
      verificationCount={0}
    >
      {/* Success Modal — inside MainLayout so sidebar shows behind blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
        <Card variant="modal" padding="p-0" className="w-full max-w-[480px] my-auto">

          {/* Loading State */}
          {loading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-primary-blue animate-spin mb-md" />
              <p className="text-body-small text-text-secondary font-inter">Loading...</p>
            </div>
          )}

          {/* Success Content */}
          {!loading && (
            <>
              <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
                  <ShieldCheck size={28} className="text-state-success sm:hidden" />
                  <ShieldCheck size={32} className="text-state-success hidden sm:block" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Account Restored Successful</h2>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm">
                  Student ID{' '}
                  <span className="text-primary-blue font-semibold">#{studentId || '—'}</span>
                  {' '}has been restored. They now have full access to all university portal modules.
                </p>
                <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-md sm:p-lg mb-4 sm:mb-6">
                  <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                    <span className="text-body-extra-small text-text-secondary font-inter">Student Name</span>
                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{userName || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                    <span className="text-body-extra-small text-text-secondary font-inter">Case Reference</span>
                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{caseReference || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-xs sm:py-sm">
                    <span className="text-body-extra-small text-text-secondary font-inter">Notify Student</span>
                    <button
                      onClick={handleNotifyToggle}
                      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${notifyStudent ? 'bg-primary-blue' : 'bg-white/20'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 flex items-center justify-center ${notifyStudent ? 'left-[22px]' : 'left-0.5'}`}>
                        {notifyStudent && <CheckSmallIcon className="text-primary-blue" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
                <button onClick={() => navigate("/admin")} className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200">
                  <LayoutDashboard size={18} /> Return to Dashboard
                </button>
                <button onClick={() => navigate("/suspended-users")} className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
                  <UserX size={18} className="text-text-secondary" /> View Suspended Users
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default SuspendedUserSuccess;
