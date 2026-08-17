import React, { useState, useEffect } from 'react';
import {
  Info, ArrowRight, ArrowLeft, Clock, XCircle, CheckCircle, AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotFound from '../NotFound';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUpload from '../../components/common/FileUpload';
import DocumentPreviewModal from '../../components/common/DocumentPreviewModal';
import { getCurrentUser } from '../../services/authService';
import verificationService from '../../services/verificationService';
import {
  ActionErrorModal, WithdrawalSuccessModal,
} from '../../components/common/VerificationModals';
import VerificationStatusHeader from './VerificationStatusHeader';
import SubmittedDocumentCard from './SubmittedDocumentCard';
import WithdrawVerificationModal from './WithdrawVerificationModal';

const getStatusConfig = (submissionStatus) => {
  switch (submissionStatus) {
    case 'pending':
      return {
        icon: <Clock className="w-6 h-6 text-amber-400" />,
        iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/20',
        badgeBg: 'bg-amber-500/20', badgeBorder: 'border-amber-500/30',
        badgeText: 'text-amber-400', badgeLabel: 'Verification Pending', badgeDot: 'bg-amber-400',
      };
    case 'approved':
      return {
        icon: <CheckCircle className="w-6 h-6 text-green-400" />,
        iconBg: 'bg-green-500/10', iconBorder: 'border-green-500/20',
        badgeBg: 'bg-green-500/20', badgeBorder: 'border-green-500/30',
        badgeText: 'text-green-400', badgeLabel: 'Approved', badgeDot: 'bg-green-400',
      };
    case 'declined':
      return {
        icon: <XCircle className="w-6 h-6 text-red-400" />,
        iconBg: 'bg-red-500/10', iconBorder: 'border-red-500/20',
        badgeBg: 'bg-red-500/20', badgeBorder: 'border-red-500/30',
        badgeText: 'text-red-400', badgeLabel: 'Declined', badgeDot: 'bg-red-400',
      };
    case 'removed':
      return {
        icon: <XCircle className="w-6 h-6 text-red-400" />,
        iconBg: 'bg-red-500/10', iconBorder: 'border-red-500/20',
        badgeBg: 'bg-red-500/20', badgeBorder: 'border-red-500/30',
        badgeText: 'text-red-400', badgeLabel: 'Verification Removed', badgeDot: 'bg-red-400',
      };
    default:
      return null;
  }
};

const ClubVerification = () => {
  const navigate = useNavigate();
  const [errorStatus, setErrorStatus] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(
    getCurrentUser()?.isVerified ? 'approved' : 'idle',
  );
  const [submittedFile, setSubmittedFile] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [declineReason, setDeclineReason] = useState('');
  const [approvedRole, setApprovedRole] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getStatus();
      if (response.success && response.data.hasRequest) {
        if (response.data.requestedRole !== 'Club') {
          setErrorStatus(403);
          return;
        }
        setSubmissionStatus(response.data.status);
        setDeclineReason(response.data.declineReason || '');
        setApprovedRole(response.data.requestedRole || response.data.role || '');
        if (response.data.document) {
          setSubmittedFile({
            name: response.data.document.name,
            size: response.data.document.size,
            url: response.data.document.url,
          });
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load verification status.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submittedFile) return;
    setSubmitError('');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('document', submittedFile);
      formData.append('requestedRole', 'Club');
      const response = await verificationService.submitRequest(formData);
      if (response.success) setSubmissionStatus('pending');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawConfirm = async () => {
    try {
      setLoading(true);
      const response = await verificationService.withdrawRequest();
      if (response.success) {
        setSubmissionStatus('idle');
        setSubmittedFile(null);
        setShowWithdrawModal(false);
        setShowWithdrawSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to withdraw submission');
      setShowErrorModal(true);
      setShowWithdrawModal(false);
    } finally {
      setLoading(false);
    }
  };

  const config = getStatusConfig(submissionStatus);

  if (errorStatus) return <NotFound />;

  if (initialLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-slate-800 relative overflow-hidden flex items-center justify-center font-inter p-4">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="z-10 flex items-center gap-3 text-gray-400">
          <span className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-bold">Loading verification status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-slate-800 relative overflow-hidden flex items-center justify-center font-inter p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-2xl">
        <Card variant="card" className="w-full max-w-[600px]" padding="p-4 sm:p-8">
          <VerificationStatusHeader config={config} submissionStatus={submissionStatus} />

          {submissionStatus === 'idle' ? (
            <>
              <div className="bg-white/5 rounded-xl border border-white/20 p-2.5 mb-4 flex gap-3 items-center">
                <Info className="w-4 h-4 text-primary-blue shrink-0" />
                <p className="text-primary-blue text-sm leading-tight">General club details are already collected during registration.</p>
              </div>
              {submitError && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-2.5 mb-4 flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm leading-snug">{submitError}</p>
                </div>
              )}
              <p className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
                To finalize the verification of your club account, we require official documentation to validate the organization's legitimacy and faculty approval.
              </p>
              <div className="mb-6">
                <FileUpload onFileSelect={(file) => setSubmittedFile(file)} maxSizeMB={10} />
              </div>
              <Button
                variant="primary"
                className="w-full h-10 rounded-xl shadow-lg shadow-primary-blue/25 flex items-center justify-center gap-2 group"
                disabled={!submittedFile || loading}
                onClick={handleSubmit}
              >
                <span>Submit Document</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-text-secondary text-sm text-center mb-4 leading-relaxed font-bold px-4">
                {submissionStatus === 'pending' && <>Your document has been submitted and is currently <br />under review by the administration.</>}
                {submissionStatus === 'approved' && <>The verification for {approvedRole || 'your account'} is complete.<br />You have been granted full privileges.</>}
                {submissionStatus === 'declined' && <>Your registration request for {approvedRole || 'your account'} has been reviewed and declined.</>}
                {submissionStatus === 'removed' && <>Your verified status as {approvedRole || 'Club'} has been removed by the administration.</>}
              </p>

              {(submissionStatus === 'declined' || submissionStatus === 'removed') && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400 text-xs font-bold">
                      {submissionStatus === 'declined' ? 'Reason for Decline' : 'Reason for Removal'}
                    </span>
                  </div>
                  <p className="text-red-400 text-xs leading-snug pl-5 opacity-90">{declineReason}</p>
                </div>
              )}

              <SubmittedDocumentCard
                submittedFile={submittedFile}
                submissionStatus={submissionStatus}
                onPreview={(doc) => { setSubmittedFile(doc); setShowPreviewModal(true); }}
              />

              {submissionStatus !== 'approved' && (
                <div className="pt-4 border-t border-primary-blue/20 flex flex-col gap-2">
                  {submissionStatus === 'pending' && (
                    <>
                      <Button
                        variant="secondary"
                        className="w-full h-10 rounded-xl bg-dark-4 border-none hover:bg-white/5 flex items-center justify-center gap-2 text-text-secondary hover:text-white"
                        onClick={() => setShowWithdrawModal(true)}
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="font-semibold text-sm">Withdraw Application</span>
                      </Button>
                      <p className="text-text-tertiary text-xs text-center">Withdrawing your application will remove all submitted data.</p>
                    </>
                  )}
                  {(submissionStatus === 'declined' || submissionStatus === 'removed') && (
                    <>
                      <Button
                        variant="primary"
                        className="w-full h-10 rounded-xl shadow-lg shadow-primary-blue/25 flex items-center justify-center gap-2 group"
                        onClick={() => setSubmissionStatus('idle')}
                      >
                        <span className="font-semibold text-sm">
                          {submissionStatus === 'declined' ? 'Resubmit Document' : 'Resubmit Verification'}
                        </span>
                      </Button>
                      <p className="text-text-tertiary text-xs text-center">
                        {submissionStatus === 'declined'
                          ? 'You can update your document and try again immediately.'
                          : 'You can upload a new document to request verification again.'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Card>

        <Link to="/profile?role=club_society" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Profile</span>
        </Link>
      </div>

      <WithdrawVerificationModal
        open={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdrawConfirm}
        loading={loading}
      />

      {submittedFile && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={submittedFile}
        />
      )}

      <WithdrawalSuccessModal
        isOpen={showWithdrawSuccessModal}
        onClose={() => setShowWithdrawSuccessModal(false)}
      />

      <ActionErrorModal
        isOpen={showErrorModal}
        onClose={() => { setShowErrorModal(false); setErrorMessage(''); }}
        title="Action Failed"
        message={errorMessage}
      />
    </div>
  );
};

export default ClubVerification;
