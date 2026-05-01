import React, { useState, useEffect } from "react";
import {
  Info,
  ArrowRight,
  ArrowLeft,
  Clock,
  FileText,
  XCircle,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Upload,
  Users,
  FileType,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FileUpload from "../components/common/FileUpload";
import DocumentPreviewModal from "../components/common/DocumentPreviewModal";
import verificationService from "../services/verificationService";
import {
  ActionErrorModal,
  WithdrawalSuccessModal,
  RevocationSuccessModal,
} from "../components/common/VerificationModals";

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

  // Modal State
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
      console.error("Error fetching status:", error);
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
        setTimeout(() => navigate("/profile?role=student"), 1500);
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

  // Helper to render logic for icon, title, badge based on status
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
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-4 z-10 w-full max-w-2xl">
        {/* Glass Card - Reduced padding from p-8 to p-6 */}
        <Card
          variant="card"
          className="w-full max-w-[600px]"
          padding="p-4 sm:p-6"
        >
          <div className="text-center mb-4">
            {/* Icon - only show when not idle */}
            {submissionStatus !== "idle" && config && (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 border ${config.iconBg} ${config.iconBorder}`}
              >
                {config.icon}
              </div>
            )}

            {/* Title */}
            <h1 className="text-xl sm:text-heading-medium text-white mb-2 font-inter font-bold">
              Batch Rep Verification
            </h1>

            {/* Status Badge */}
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
              {/* Info Banner - Reduced margin */}
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

              {/* Instructions - Reduced margin */}
              <p className="text-text-secondary text-sm text-center mb-4 leading-relaxed">
                To complete your verification, please upload an acceptable
                document such as an official letter of nomination, a student ID
                card confirming batch enrollment, or a formal endorsement from
                the faculty advisor.
              </p>

              {/* Verification Document Section - Reduced margin */}
              <div className="mb-4">
                <FileUpload onFileSelect={handleFileSelect} maxSizeMB={10} />
              </div>

              {/* Submit Button */}
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
              {/* Status Message - Reduced margin/font if needed */}
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

              {/* Declined Reason - Compact */}
              {submissionStatus === "declined" && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-3 mb-3 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400 text-xs font-bold">
                      Reason for Decline
                    </span>
                  </div>
                  <p className="text-red-400 text-xs leading-snug pl-5 opacity-90">
                    {declineReason}
                  </p>
                </div>
              )}

              {submissionStatus === "removed" && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-3 mb-3 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400 text-xs font-bold">
                      Reason for Removal
                    </span>
                  </div>
                  <p className="text-red-400 text-xs leading-snug pl-5 opacity-90">
                    {declineReason}
                  </p>
                </div>
              )}

              {/* Submitted Document Section - Reduced margin */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs font-bold">
                    Submitted Document
                  </span>
                  <div className="flex items-center gap-1">
                    {submissionStatus === "pending" && (
                      <Clock className="w-3 h-3 text-amber-400" />
                    )}
                    {submissionStatus === "approved" && (
                      <Clock className="w-3 h-3 text-green-400" />
                    )}
                    {submissionStatus === "declined" && (
                      <AlertCircle className="w-3 h-3 text-red-400" />
                    )}
                    {submissionStatus === "removed" && (
                      <AlertCircle className="w-3 h-3 text-red-400" />
                    )}

                    <span
                      className={`text-xs font-bold ${
                        submissionStatus === "pending"
                          ? "text-amber-400"
                          : submissionStatus === "approved"
                            ? "text-green-400"
                            : "text-red-400"
                      }`}
                    >
                      {submissionStatus === "pending"
                        ? "Review in progress"
                        : submissionStatus === "approved"
                          ? "Verified"
                          : submissionStatus === "removed"
                            ? "Removed"
                            : "Needs Update"}
                    </span>
                  </div>
                </div>

                {/* File Card - Single Document */}
                <div className="bg-gray-800 rounded-xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="p-2 flex items-center justify-between gap-3">
                    <div
                      className="flex items-center gap-3 overflow-hidden cursor-pointer"
                      onClick={() => handlePreview(submittedFile)}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          submissionStatus === "declined" || submissionStatus === "removed"
                            ? "bg-red-500/20 border-red-500/30"
                            : "bg-red-500/20 border-red-500/30"
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${submissionStatus === "declined" || submissionStatus === "removed" ? "text-red-400" : "text-red-400"}`}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span
                          className={`text-sm font-bold truncate ${submissionStatus === "declined" || submissionStatus === "removed" ? "text-red-400 line-through" : "text-neutral-100"}`}
                        >
                          {submittedFile?.name || "Batch_rep_nomination.pdf"}
                        </span>
                        <span className="text-zinc-400 text-xs">
                          {submittedFile
                            ? formatFileSize(submittedFile.size)
                            : "File details available in preview"}
                        </span>
                      </div>
                    </div>

                    {/* View/Download Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePreview(submittedFile)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions - Reduced pt */}
              <div className="pt-4 border-t border-blue-500/20 flex flex-col gap-3">
                {submissionStatus === "pending" && (
                  <>
                    <Button
                      variant="secondary"
                      className="w-full h-10 rounded-xl bg-dark-4 border-none hover:bg-white/5 flex items-center justify-center gap-2 text-text-secondary hover:text-white"
                      onClick={() => setShowWithdrawModal(true)}
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm">
                        Withdraw Application
                      </span>
                    </Button>
                    <p className="text-zinc-400 text-xs text-center">
                      Withdrawing your application will remove all submitted
                      data.
                    </p>
                  </>
                )}

                {submissionStatus === "approved" && (
                  <>
                    <Button
                      variant="dangerOutline"
                      size="small"
                      fullWidth
                      onClick={() => setShowRevokeModal(true)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove as Batch Rep
                    </Button>
                    <p className="text-zinc-400 text-xs text-center">
                      Revoking your status will remove access to administrative
                      tools immediately.
                    </p>
                  </>
                )}

                {submissionStatus === "declined" && (
                  <>
                    <button
                      className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-colors"
                      onClick={() => setSubmissionStatus("idle")}
                    >
                      <span className="font-bold text-sm text-white">
                        Resubmit Document
                      </span>
                    </button>
                    <p className="text-zinc-400 text-xs text-center">
                      You can update your document and try again immediately.
                    </p>
                  </>
                )}

                {submissionStatus === "removed" && (
                  <>
                    <button
                      className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-colors"
                      onClick={() => setSubmissionStatus("idle")}
                    >
                      <span className="font-bold text-sm text-white">
                        Resubmit Verification
                      </span>
                    </button>
                    <p className="text-zinc-400 text-xs text-center">
                      You can upload a new document to request verification
                      again.
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Back Link - Reduced margin */}
        <Link
          to="/profile?role=student"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mt-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Profile</span>
        </Link>
      </div>

      {/* Withdraw Confirmation Modal - Matched size and style with Club Verif */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
          <Card
            variant="card"
            padding="p-0"
            className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="p-6 sm:p-8 sm:pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
                <AlertCircle className="w-8 h-8 text-state-error" />
              </div>

              <h2 className="text-xl font-bold text-white mb-3">
                Withdraw Application?
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Are you sure you want to withdraw your Rep verification
                application? This will{" "}
                <span className="text-white font-bold">
                  permanently delete all uploaded documents
                </span>{" "}
                and reset your status.
              </p>
            </div>

            <div className="p-4 sm:p-6 sm:pt-2 bg-transparent flex gap-4">
              <Button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdrawConfirm}
                variant="danger"
                className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
                disabled={loading}
              >
                Withdraw Application
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDocument}
        />
      )}

      {/* Revoke Privileges Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl px-4">
          <Card
            variant="card"
            padding="p-0"
            className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-white/10 shadow-2xl"
          >
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-state-error" />
              </div>

              <h2 className="text-xl font-bold text-white mb-3">
                Revoke Batch Rep Status?
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Are you sure you want to resign as Batch Representative? This
                will{" "}
                <span className="text-white font-bold text-state-error">
                  remove all administrative privileges
                </span>{" "}
                and remove your verified badge.
              </p>

              <div className="w-full space-y-2 mb-6 text-left">
                <label className="text-body-small-bold text-text-secondary ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your account password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full h-11 px-4 bg-dark-4 rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                    passwordError
                      ? "border border-state-error focus:border-state-error"
                      : "border border-white/10 focus:border-primary-blue/50"
                  }`}
                />
                {passwordError && (
                  <div className="flex items-center gap-1.5 mt-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5 text-state-error shrink-0" />
                    <span className="text-state-error text-xs">{passwordError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 w-full">
                <Button
                  onClick={() => {
                    setShowRevokeModal(false);
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRevokeConfirm}
                  variant="danger"
                  className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
                  disabled={loading}
                >
                  Revoke Status
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Withdrawal Success Modal */}
      <WithdrawalSuccessModal
        isOpen={showWithdrawSuccessModal}
        onClose={() => setShowWithdrawSuccessModal(false)}
      />

      {/* Revocation Success Modal */}
      <RevocationSuccessModal
        isOpen={showRevokeSuccessModal}
        onClose={() => setShowRevokeSuccessModal(false)}
      />

      {/* Error Modal */}
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
