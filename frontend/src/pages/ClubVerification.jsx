import React, { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FileUpload from "../components/common/FileUpload";
import DocumentPreviewModal from "../components/common/DocumentPreviewModal";
import { mockFullDocument } from "../data/mockData";

const ClubVerification = () => {
  const [submissionStatus, setSubmissionStatus] = useState("idle"); // 'idle' | 'pending' | 'approved' | 'declined'
  const [submittedFile, setSubmittedFile] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mock Data
  const declineReason =
    "The submitted constitution document is missing the required Faculty Advisor signature on page 3. Please acquire the signature and resubmit.";

  const handleFileSelect = (file) => {
    setSubmittedFile(file);
  };

  const handleSubmit = () => {
    if (submittedFile) {
      console.log("Submitting file:", submittedFile.name);
      setSubmissionStatus("pending");
    }
  };

  const handleWithdrawConfirm = () => {
    console.log("Withdrawing application");
    setSubmissionStatus("idle");
    setSubmittedFile(null);
    setShowWithdrawModal(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper to render logic for icon, title, badge based on status
  const getStatusConfig = () => {
    switch (submissionStatus) {
      case "pending":
        return {
          icon: <Clock className="w-6 h-6 text-amber-400" />,
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
          icon: <CheckCircle className="w-6 h-6 text-green-400" />,
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
          icon: <XCircle className="w-6 h-6 text-red-400" />,
          iconBg: "bg-red-500/10",
          iconBorder: "border-red-500/20",
          badgeBg: "bg-red-500/20",
          badgeBorder: "border-red-500/30",
          badgeText: "text-red-400",
          badgeLabel: "Declined",
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

      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-2xl">
        {/* Glass Card */}
        <Card variant="card" className="w-full max-w-[600px]" padding="p-8">
          <div className="text-center mb-6">
            {/* Icon - only show when not idle */}
            {submissionStatus !== "idle" && config && (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border ${config.iconBg} ${config.iconBorder}`}
              >
                {config.icon}
              </div>
            )}

            {/* Title */}
            <h1 className="text-heading-medium text-white mb-2">
              Club Verification
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
              {/* Info Banner */}
              <div className="bg-white/5 rounded-xl border border-white/20 p-2.5 mb-4 flex gap-3 items-center">
                <Info className="w-4 h-4 text-primary-blue shrink-0" />
                <p className="text-primary-blue text-sm leading-tight">
                  General club details are already collected during
                  registration.
                </p>
              </div>

              {/* Instructions */}
              <p className="text-text-secondary text-sm text-center mb-6 leading-relaxed">
                To finalize the verification of your club account, we require
                official documentation to validate the organization's legitimacy
                and faculty approval.
              </p>

              {/* Upload Section */}
              <div className="mb-6">
                <FileUpload onFileSelect={handleFileSelect} maxSizeMB={10} />
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                className="w-full h-10 rounded-xl shadow-lg shadow-primary-blue/25 flex items-center justify-center gap-2 group"
                disabled={!submittedFile}
                onClick={handleSubmit}
              >
                <span>Submit Document</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </>
          ) : (
            <>
              {/* Status Message */}
              <p className="text-text-secondary text-sm text-center mb-4 leading-relaxed font-bold px-4">
                {submissionStatus === "pending" && (
                  <>
                    Your document have been submitted and are currently <br />
                    under review by the administration. You will be notified via
                    email once the process is complete.
                  </>
                )}
                {submissionStatus === "approved" && (
                  <>
                    The verification for Robotics Club is complete.
                    <br />
                    You have been granted the full club privileges.
                  </>
                )}
                {submissionStatus === "declined" && (
                  <>
                    Your club registration request for "Robotics & AI Society"
                    has been reviewed and declined by the administration.
                  </>
                )}
              </p>

              {/* Declined Reason */}
              {submissionStatus === "declined" && (
                <div className="bg-red-400/5 rounded-xl border border-red-400/20 p-3 mb-4">
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

              {/* Submitted Document Section */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-xs font-bold">
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
                          : "Needs Update"}
                    </span>
                  </div>
                </div>

                {/* File Card */}
                <div className="bg-dark-4 rounded-xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="p-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          submissionStatus === "declined"
                            ? "bg-red-500/20 border-red-500/30"
                            : "bg-red-500/20 border-red-500/30"
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${submissionStatus === "declined" ? "text-red-400" : "text-red-400"}`}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span
                          className={`text-sm font-bold truncate ${submissionStatus === "declined" ? "text-red-400 line-through" : "text-text-primary"}`}
                        >
                          {submittedFile?.name || "Club_Constitution.pdf"}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {submittedFile
                            ? formatFileSize(submittedFile.size)
                            : "3.2 MB"}{" "}
                          • Uploaded Today
                        </span>
                      </div>
                    </div>

                    {/* View/Download Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setShowPreviewModal(true)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              {/* Footer Actions - Hide in approved state as there are no actions */}
              {submissionStatus !== "approved" && (
                <div className="pt-4 border-t border-primary-blue/20 flex flex-col gap-2">
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
                      <p className="text-text-tertiary text-xs text-center">
                        Withdrawing your application will remove all submitted
                        data.
                      </p>
                    </>
                  )}

                  {submissionStatus === "declined" && (
                    <>
                      <Button
                        variant="primary"
                        className="w-full h-10 rounded-xl shadow-lg shadow-primary-blue/25 flex items-center justify-center gap-2 group"
                        onClick={() => setSubmissionStatus("idle")}
                      >
                        <span className="font-semibold text-sm">
                          Resubmit Document
                        </span>
                      </Button>
                      <p className="text-text-tertiary text-xs text-center">
                        You can update your document and try again immediately.
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
          <Card
            variant="card"
            padding="p-0"
            className="w-full max-w-[440px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-state-error/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-error/5">
                <AlertCircle className="w-8 h-8 text-state-error" />
              </div>

              <h2 className="text-xl font-bold text-white mb-3">
                Withdraw Application?
              </h2>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                Are you sure you want to withdraw your club verification
                application? This will{" "}
                <span className="text-white font-bold">
                  permanently delete all uploaded documents
                </span>{" "}
                and reset your status.
              </p>
            </div>

            <div className="p-6 pt-2 bg-transparent flex gap-4">
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
              >
                Withdraw Application
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={{
          ...mockFullDocument,
          // Override with actual file if present
          file: submittedFile,
          name: submittedFile?.name || mockFullDocument.name,
          size: submittedFile
            ? formatFileSize(submittedFile.size)
            : mockFullDocument.size,
        }}
      />

      {/* DEBUG: Temporary controls to visualize states */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-50 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
        <button
          onClick={() => setSubmissionStatus("idle")}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
        >
          Idle
        </button>
        <button
          onClick={() => setSubmissionStatus("pending")}
          className="px-3 py-1 bg-amber-900/50 hover:bg-amber-900/70 text-amber-400 text-xs rounded border border-amber-500/30 transition-colors"
        >
          Pending
        </button>
        <button
          onClick={() => setSubmissionStatus("approved")}
          className="px-3 py-1 bg-green-900/50 hover:bg-green-900/70 text-green-400 text-xs rounded border border-green-500/30 transition-colors"
        >
          Approved
        </button>
        <button
          onClick={() => setSubmissionStatus("declined")}
          className="px-3 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-400 text-xs rounded border border-red-500/30 transition-colors"
        >
          Declined
        </button>
      </div>
    </div>
  );
};

export default ClubVerification;
