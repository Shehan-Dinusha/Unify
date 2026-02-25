import React, { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import { Check, ChevronDown, X } from "lucide-react";

export const ReportReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const reasons = [
    "Spam or fake review",
    "Inappropriate content",
    "Harassment or hate speech",
    "Conflict of interest",
    "Other",
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ reason, details });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[512px] !p-0 flex flex-col relative overflow-visible outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-500/20 flex justify-between items-center">
          <h2 className="text-white text-lg font-bold font-lexend leading-7">
            Report Review
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-10 flex flex-col gap-6 flex-1">
          <p className="text-slate-400 text-sm font-normal font-noto-sans leading-5">
            Please select a reason for reporting this review to the
            administrators.
          </p>

          <div className="flex flex-col gap-5">
            {/* Reason Dropdown */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-white text-xs font-bold font-inter leading-5">
                Reason for reporting
              </label>
              <div
                className="w-full h-11 bg-white/5 rounded-2xl outline outline-1 outline-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)] px-4 flex justify-between items-center cursor-pointer relative"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span
                  className={`text-sm font-inter leading-5 ${reason ? "text-white" : "text-gray-400"}`}
                >
                  {reason || "Select a reason"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-[72px] left-0 w-full bg-slate-800 rounded-xl border border-white/10 shadow-lg z-10 overflow-hidden">
                  {reasons.map((r) => (
                    <div
                      key={r}
                      className="px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors font-inter"
                      onClick={() => {
                        setReason(r);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-xs font-bold font-inter leading-5">
                Reason for reporting
              </label>
              <textarea
                className="w-full h-24 bg-white/5 rounded-2xl outline outline-1 outline-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)] p-4 text-white text-sm font-inter leading-5 placeholder:text-gray-400 resize-none focus:outline-blue-500 focus:outline-2"
                placeholder="Please provide specific details to help us understand the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue-500/20 flex justify-end items-center gap-3 mt-auto rounded-b-3xl">
          <Button
            variant="ghost-hoverless"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={!reason}
            className="w-auto px-6 whitespace-nowrap justify-center"
          >
            Submit Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const ReportSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[440px] !p-0 overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center relative overflow-hidden">
          {/* Success Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-state-success">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3]" />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 text-center">
            Review reported successfully!
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4 text-center px-2">
            Thank you for your report. Administrators will review this content
            against our guidelines shortly.
          </div>
        </div>

        {/* Button */}
        <div className="p-6 pt-2 w-full">
          <Button
            variant="primary"
            onClick={onClose}
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold justify-center"
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};
