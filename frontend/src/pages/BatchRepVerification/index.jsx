import React, { useState, useEffect } from "react";
import {
  Info,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import FileUpload from "../../components/common/FileUpload";
import DocumentPreviewModal from "../../components/common/DocumentPreviewModal";
import verificationService from "../../services/verificationService";
import {
  ActionErrorModal,
  WithdrawalSuccessModal,
  RevocationSuccessModal,
} from "../../components/common/VerificationModals";
import ApplicationCard from "./ApplicationCard";
import VerificationActions from "./VerificationActions";
import WithdrawModal from "./WithdrawModal";
import RevokeModal from "./RevokeModal";

const BatchRepVerification = () => {
  const navigate = useNavigate();
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [submittedFile, setSubmittedFile] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [declineReason, setDeclineReason] = useState("");
  const [approvedRole, setApprovedRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);
  const [showRevokeSuccessModal, setShowRevokeSuccessModal] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getStatus();
      if (response.success && response.data.hasRequest) {
        if (response.data.requestedRole !== "Batch Rep") {
          setSubmissionStatus("idle");
          return;
        }
        setSubmissionStatus(response.data.status);
        setDeclineReason(response.data.declineReason || "");
        setApprovedRole(response.data.requestedRole || response.data.role || "");

        if (response.data.document) {
          setSubmittedFile({
            name: response.data.document.name,
            size: response.data.document.size,
            url: response.data.document.url,
          });
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to load verification status.",
      );
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSubmittedFile(file);
  };

  const handleSubmit = async () => {
    if (!submittedFile) return;

    setSubmitError("");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("document", submittedFile);
      formData.append("requestedRole", "Batch Rep");

      const response = await verificationService.submitRequest(formData);
      if (response.success) {
        setSubmissionStatus("pending");
      }
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to submit verification",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawConfirm = async () => {
    try {
      setLoading(true);
      const response = await verificationService.withdrawRequest();
      if (response.success) {
        setSubmissionStatus("idle");
        setSubmittedFile(null);
        setConfirmPassword("");
        setShowWithdrawModal(false);
        setShowWithdrawSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to withdraw submission",
      );
      setShowErrorModal(true);
      setShowWithdrawModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!confirmPassword) {
      setPasswordError("Password is required to revoke status.");
      return;
    }

    try {
      setLoading(true);
      const response =
        await verificationService.revokeBatchRepStatus(confirmPassword);
      if (response.success) {
        setSubmissionStatus("idle");
        setSubmittedFile(null);
        setConfirmPassword("");
        setPasswordError("");
        setShowRevokeModal(false);
        setShowRevokeSuccessModal(true);
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Failed to revoke status");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePreview = (doc) => {
    setPreviewDocument(doc);
    setShowPreviewModal(true);
  };

  const getStatusConfig = () => {
    switch (submissionStatus) {
      case "pending":
        return {
          icon: <Clock className="w-5 h-5 text-amber-400" />,
          iconBg: "bg-amber-500/10",
          iconBorder: "border-amber-500/20",
          badgeBg: "bg-amber-500/20",
          badgeBorder: "border-amber-500/30",
          badgeText: "text-amber-400",
          badgeLabel: "Verification Pending",
          badgeDot: "bg-amber-400",
        };
      case "approved":
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          iconBg: "bg-green-500/10",
          iconBorder: "border-green-500/20",
          badgeBg: "bg-green-500/20",
          badgeBorder: "border-green-500/30",
          badgeText: "text-green-400",
          badgeLabel: "Approved",
          badgeDot: "bg-green-400",
        };
      case "declined":
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          iconBg: "bg-red-500/10",
          iconBorder: "border-red-500/20",
          badgeBg: "bg-red-500/20",
          badgeBorder: "border-red-500/30",
          badgeText: "text-red-400",
          badgeLabel: "Declined",
          badgeDot: "bg-red-400",
        };
      case "removed":
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          iconBg: "bg-red-500/10",
          iconBorder: "border-red-500/20",
          badgeBg: "bg-red-500/20",
          badgeBorder: "border-red-500/30",
          badgeText: "text-red-400",
          badgeLabel: "Verification Removed",
          badgeDot: "bg-red-400",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-slate-800 relative overflow-hidden flex items-center justify-center font-inter p-4">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-4 z-10 w-full max-w-2xl">
        <Card
          variant="card"
          className="w-full max-w-[600px]"
          padding="p-4 sm:p-6"
        >
          <div className="text-center mb-4">
            {submissionStatus !== "idle" && config && (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 border ${config.iconBg} ${config.iconBorder}`}
              >
                {config.icon}
              </div>
            )}

            <h1 className="text-xl sm:text-heading-medium text-white mb-2 font-inter font-bold">
              Batch Rep Verification
            </h1>

            {submissionStatus !== "idle" && config && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.badgeBg} ${config.badgeBorder}`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.badgeDot}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${config.badgeDot}`}
                  ></span>
                </span>
                <span className={`text-xs font-bold ${config.badgeText}`}>
                  {config.badgeLabel}
                </span>
              </div>
            )}
          </div>

          {submissionStatus === "idle" ? (
            <>
              <div className="bg-white/5 rounded-xl border border-white/20 p-2.5 mb-3 flex gap-3 items-center">
                <Info className="w-4 h-4 text-primary-blue shrink-0" />
                <p className="text-primary-blue text-sm leading-tight">
                  Personal details are already collected during registration.
                </p>
              </div>

              {submitError && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-2.5 mb-3 flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm leading-snug">
                    {submitError}
                  </p>
                </div>
              )}

              <p className="text-text-secondary text-sm text-center mb-4 leading-relaxed">
                To complete your verification, please upload an acceptable
                document such as an official letter of nomination, a student ID
                card confirming batch enrollment, or a formal endorsement from
                the faculty advisor.
              </p>

              <div className="mb-4">
                <FileUpload onFileSelect={handleFileSelect} maxSizeMB={10} />
              </div>

              <Button
                variant="primary"
                className="w-full h-10 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group bg-blue-500 hover:bg-blue-600 border-none"
                disabled={!submittedFile || loading}
                onClick={handleSubmit}
              >
                <span className="font-bold text-sm">Submit Document</span>
                <div className="bg-white/20 p-0.5 rounded-full">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Button>
            </>
          ) : (
            <>
              <p className="text-text-secondary text-sm text-center mb-3 leading-relaxed font-bold px-4">
                {submissionStatus === "pending" && (
                  <>
                    Your document has been submitted and is currently <br />
                    under review by the administration. You will be notified via
                    email once the process is complete.
                  </>
                )}
                {submissionStatus === "approved" && (
                  <>
                    The verification for{" "}
                    {approvedRole || "Batch Representative"} is complete.
                    <br />
                    You have been granted full representative privileges.
                  </>
                )}
                {submissionStatus === "declined" && (
                  <>
                    Your registration request for{" "}
                    {approvedRole || "Batch Representative"}
                    has been reviewed and declined by the administration.
                  </>
                )}
                {submissionStatus === "removed" && (
                  <>
                    Your verified status as {approvedRole || "Batch Representative"}
                    has been removed by the administration.
                  </>
                )}
              </p>

              {(submissionStatus === "declined" || submissionStatus === "removed") && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-3 mb-3 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400 text-xs font-bold">
                      {submissionStatus === "declined" ? "Reason for Decline" : "Reason for Removal"}
                    </span>
                  </div>
                  <p className="text-red-400 text-xs leading-snug pl-5 opacity-90">
                    {declineReason}
                  </p>
                </div>
              )}

              <ApplicationCard
                submittedFile={submittedFile}
                status={submissionStatus}
                formatFileSize={formatFileSize}
                onPreview={handlePreview}
              />

              <VerificationActions
                status={submissionStatus}
                onWithdraw={() => setShowWithdrawModal(true)}
                onRevoke={() => setShowRevokeModal(true)}
                onResubmit={() => setSubmissionStatus("idle")}
              />
            </>
          )}
        </Card>

        <Link
          to="/profile?role=student"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mt-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Profile</span>
        </Link>
      </div>

      <WithdrawModal
        open={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdrawConfirm}
        loading={loading}
      />

      {previewDocument && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDocument}
        />
      )}

      <RevokeModal
        open={showRevokeModal}
        onClose={() => { setShowRevokeModal(false); setConfirmPassword(""); setPasswordError(""); }}
        onConfirm={handleRevokeConfirm}
        loading={loading}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordError={passwordError}
      />

      <WithdrawalSuccessModal
        isOpen={showWithdrawSuccessModal}
        onClose={() => setShowWithdrawSuccessModal(false)}
      />

      <RevocationSuccessModal
        isOpen={showRevokeSuccessModal}
        onClose={() => setShowRevokeSuccessModal(false)}
      />

      <ActionErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage("");
        }}
        title="Action Failed"
        message={errorMessage}
      />
    </div>
  );
};

export default BatchRepVerification;
