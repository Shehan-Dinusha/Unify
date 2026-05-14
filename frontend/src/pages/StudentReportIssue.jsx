import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { useToast } from "../components/common/Toast";
import { submitReport } from "../services/reportService";
import { getCurrentUser } from "../services/authService";
import {
  FileText,
  MessageSquare,
  UserCircle,
  Send,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";

const reportTypes = [
  {
    id: "post",
    label: "Post",
    description: "Report a specific post on the feed",
    icon: FileText,
  },
  {
    id: "comment",
    label: "Comment",
    description: "Report a comment on a discussion",
    icon: MessageSquare,
  },
  {
    id: "user",
    label: "User Profile",
    description: "Report a fake or abusive account",
    icon: UserCircle,
  },
];

const reportReasons = [
  {
    id: "inappropriate",
    label: "Inappropriate Content",
    description: "Contains offensive or adult material",
  },
  {
    id: "spam",
    label: "Spam",
    description: "Promotional, repetitive or irrelevant content",
  },
  {
    id: "harassment",
    label: "Harassment or Bullying",
    description: "Targeted attacks or abusive behavior",
  },
  {
    id: "misinformation",
    label: "Misinformation",
    description: "False or misleading academic information",
  },
];

const StudentReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const postData = location.state?.postData || null;

  const [selectedType, setSelectedType] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [externalLink, setExternalLink] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-select type if data is passed from a specific context
  React.useEffect(() => {
    if (postData?.type) {
      setSelectedType(postData.type);
    } else if (postData?.id) {
      // If it has an ID but no explicit type, it's likely a post from the news feed
      setSelectedType("post");
    }
  }, [postData]);

  const user = getCurrentUser() || { name: "Student", role: "student" };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // Store the actual File objects for submission, and metadata for UI
    const newFiles = files.map((f) => ({
      file: f, // Keep reference to the actual blob
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + " MB",
      type: f.name.endsWith(".pdf") ? "pdf" : "image",
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [submitting, setSubmitting] = useState(false);

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      // Map frontend reason IDs to backend category values
      const categoryMap = { inappropriate: 'inappropriate', spam: 'spam', harassment: 'harassment', misinformation: 'misinformation' };
      
      // Use FormData to support file uploads
      const formData = new FormData();
      formData.append('reportType', selectedType);
      formData.append('category', categoryMap[selectedReason] || selectedReason);
      
      // Map entity ID based on type
      const entityId = postData?.id || postData?.authorId || postData?.userId;
      formData.append('reportedEntityId', entityId || `manual-${Date.now()}`);
      
      if (additionalDetails) formData.append('additionalDetails', additionalDetails);
      if (externalLink) formData.append('evidenceUrl', externalLink);
      
      // Append each file buffer
      uploadedFiles.forEach(item => {
        formData.append('evidenceFiles', item.file);
      });

      const result = await submitReport(formData);
      
      toast.success('Report Submitted', 'Your report has been sent to the administration.');
      navigate("/student/report-success", {
        state: {
          reportId: result.data?.reportId || '',
          reportType: selectedType,
          reason: selectedReason,
        },
      });
    } catch (err) {
      console.error('[StudentReportIssue] Submit failed:', err);
      const msg = err.response?.data?.message || 'Failed to submit report. Please try again.';
      toast.error('Submission Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/news-feed");
    }
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!selectedType) newErrors.type = "Please select a report type.";
    if (!selectedReason) newErrors.reason = "Please select a reason for reporting.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShowConfirm = () => {
    if (validate()) {
      setShowConfirm(true);
    } else {
      toast.error("Required Fields Missing", "Please select a report type and reason before submitting.");
    }
  };

  const canSubmit = selectedType !== null && selectedReason !== null;

  return (
    <MainLayout user={user} pageTitle="News Feed" verificationCount={0}>
      {/* ── Backdrop blur overlay covering the full screen ── */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6 sm:py-10">
          {/* ── ONE single glass card containing everything ── */}
          <Card
            variant="card"
            padding="p-0"
            className="w-full max-w-[600px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
          >
            {/* Card Header */}
            <div className="p-5 sm:p-6 pb-0 flex items-start justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-inter tracking-tight">
                  Report an Issue
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary font-inter mt-1">
                  Help us keep the university community safe and professional.
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content area inside the single card */}
            <div className="p-5 sm:p-6 flex flex-col gap-6 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">

              {/* ── Section 1: What are you reporting? ── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-bold">1</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-inter">
                    What are you reporting? <span className="text-state-error text-xs font-normal ml-1">*Required</span>
                  </h3>
                </div>
                {errors.type && <p className="text-state-error text-[10px] mb-2 px-1">{errors.type}</p>}
                <div className="flex flex-col gap-2.5">
                  {reportTypes.map((type) => {
                    const IconComp = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary-blue/60 bg-primary-blue/10"
                            : "border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-primary-blue/20" : "bg-white/10"
                          }`}
                        >
                          <IconComp
                            size={18}
                            className={
                              isSelected
                                ? "text-primary-blue"
                                : "text-text-secondary"
                            }
                          />
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                          <span className="text-sm sm:text-base font-bold text-white font-inter">
                            {type.label}
                          </span>
                          <span className="text-[11px] sm:text-xs text-text-secondary font-inter mt-0.5">
                            {type.description}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-primary-blue"
                              : "border-white/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10" />

              {/* ── Section 2: Why are you reporting? ── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-bold">2</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-inter">
                    Why are you reporting this? <span className="text-state-error text-xs font-normal ml-1">*Required</span>
                  </h3>
                </div>
                {errors.reason && <p className="text-state-error text-[10px] mb-2 px-1">{errors.reason}</p>}
                <div className="flex flex-col gap-2.5">
                  {reportReasons.map((reason) => {
                    const isSelected = selectedReason === reason.id;
                    return (
                      <button
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary-blue/60 bg-primary-blue/10"
                            : "border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-primary-blue"
                              : "border-white/30"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm sm:text-base font-bold text-white font-inter">
                            {reason.label}
                          </span>
                          <span className="text-[11px] sm:text-xs text-text-secondary font-inter mt-0.5">
                            {reason.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/10" />

              {/* ── Section 3: Provide Report Details ── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[12px] font-bold">3</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-inter">
                    Provide Report Details
                  </h3>
                </div>

                {/* Additional Comments */}
                <div className="mb-5">
                  <h4 className="text-sm font-bold text-white font-inter mb-1">
                    Additional Comments{" "}
                    <span className="text-text-tertiary font-normal text-xs">
                      (Optional)
                    </span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-text-secondary font-inter mb-3">
                    Describe what happened, who was involved, and the
                    approximate time.
                  </p>
                  <textarea
                    rows={3}
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Type your detailed report here....."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-tertiary font-inter outline-none focus:border-primary-blue/50 transition-colors resize-none"
                  />
                </div>

                {/* Supporting Evidence */}
                <div>
                  <h4 className="text-sm font-bold text-white font-inter mb-1">
                    Supporting Evidence
                  </h4>
                  <p className="text-[11px] sm:text-xs text-text-secondary font-inter mb-3">
                    Upload screenshots, photos, PDFs, or provide links.
                  </p>

                  {/* Upload Area */}
                  <label className="block w-full border-2 border-dashed border-white/20 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-primary-blue/40 hover:bg-white/[0.02] transition-all">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Upload size={16} className="text-primary-blue" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white font-inter">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[10px] sm:text-xs text-text-tertiary font-inter mt-1">
                      SVG, PNG, JPG or PDF (max. 10MB)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-inter font-bold block mb-2">
                        UPLOADED FILES
                      </span>
                      <div className="flex flex-col gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
                          >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-state-error/10 flex items-center justify-center flex-shrink-0">
                              <FileText
                                size={14}
                                className="text-state-error"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-white font-inter truncate">
                                {file.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-text-tertiary font-inter">
                                {file.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFile(idx)}
                              className="p-1 text-text-secondary hover:text-state-error transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-white font-inter block mb-2">
                      External Video/Document Links
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 gap-2 focus-within:border-primary-blue/50 transition-colors">
                        <LinkIcon
                          size={14}
                          className="text-text-secondary flex-shrink-0"
                        />
                        <input
                          type="url"
                          value={externalLink}
                          onChange={(e) => setExternalLink(e.target.value)}
                          placeholder="https://"
                          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-text-tertiary outline-none font-inter"
                        />
                      </div>
                      <button className="h-[38px] sm:h-[42px] px-3 sm:px-5 rounded-xl bg-white/5 text-white border border-white/10 text-xs sm:text-sm font-bold hover:bg-white/10 transition-all duration-200 whitespace-nowrap font-inter">
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer buttons (sticky at bottom of card) ── */}
            <div className="p-5 sm:p-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-inter order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleShowConfirm}
                className={`w-full sm:w-auto h-11 px-6 rounded-full font-inter font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 order-1 sm:order-2 ${
                  canSubmit
                    ? "bg-primary-blue text-white hover:brightness-110 active:scale-[0.98]"
                    : "bg-white/5 border border-white/10 text-text-tertiary"
                }`}
              >
                Submit Report <Send size={16} />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
          <div className="min-h-full flex items-center justify-center px-4 py-8">
            <Card
              variant="card"
              padding="p-0"
              className="w-full max-w-[420px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
            >
              <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-primary-blue/5">
                  <Send size={28} className="text-primary-blue sm:hidden" />
                  <Send
                    size={32}
                    className="text-primary-blue hidden sm:block"
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 font-inter">
                  Submit Report?
                </h2>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-2 max-w-sm font-inter">
                  Are you sure you want to submit this report? Your report will
                  be sent to the{" "}
                  <span className="text-white font-semibold">
                    University Administration
                  </span>{" "}
                  for review. This action cannot be undone.
                </p>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
                <button
                  onClick={confirmSubmit}
                  disabled={submitting}
                  className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                >
                  <CheckCircle2 size={18} /> Yes, Submit Report
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-white font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default StudentReportIssue;
