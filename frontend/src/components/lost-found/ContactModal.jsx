import React, { useState } from "react";
import { Phone, MessageSquare, CheckCircle, X, Loader2 } from "lucide-react";

/**
 * ContactModal
 *
 * Displayed when a user clicks "I Found This" or "Claim This Item".
 * Collects a contact number and an identification description,
 * then calls onSubmit({ contactNumber, description }).
 *
 * Props:
 *   isLost      {boolean}  - true if the parent item type is "lost"
 *   itemTitle   {string}   - title of the item (shown in the header)
 *   onClose     {function} - called when the modal should close
 *   onSubmit    {function} - async ({ contactNumber, description }) => void
 */
const ContactModal = ({ isLost, itemTitle, onClose, onSubmit }) => {
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (contactNumber.trim().length < 7 || contactNumber.trim().length > 15) {
      newErrors.contactNumber = "Must be between 7 and 15 characters";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Please provide at least 10 characters";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    setAttempted(true);
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      await onSubmit({ contactNumber: contactNumber.trim(), description: description.trim() });
      setIsSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (attempted) {
      setErrors((prev) => {
        const updated = { ...prev };
        if (field === "contactNumber") {
          if (!value.trim() || value.trim().length < 7 || value.trim().length > 15) {
            updated.contactNumber = !value.trim()
              ? "Contact number is required"
              : "Must be between 7 and 15 characters";
          } else {
            delete updated.contactNumber;
          }
        }
        if (field === "description") {
          if (!value.trim() || value.trim().length < 10) {
            updated.description = !value.trim()
              ? "Description is required"
              : "Please provide at least 10 characters";
          } else {
            delete updated.description;
          }
        }
        return updated;
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" />

      {/* Modal card */}
      <div
        className="relative w-full max-w-lg bg-dark-2 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-custom-shadow animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X size={15} />
        </button>

        {/* ── Success state ── */}
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-state-success/10 border border-state-success/30 flex items-center justify-center">
              <CheckCircle size={32} className="text-state-success" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-small text-text-primary">
                Request Sent!
              </h2>
              <p className="text-body-small text-text-secondary max-w-xs">
                The item owner has been notified with your contact details. They
                will reach out to you soon.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="mb-6">
              <h2 className="text-heading-small text-text-primary mb-1">
                {isLost ? "I Found This Item" : "Claim This Item"}
              </h2>
              <p className="text-body-small text-text-secondary">
                {isLost
                  ? `Let the owner of "${itemTitle}" know you found it.`
                  : `Tell the finder you believe "${itemTitle}" belongs to you.`}
              </p>
            </div>

            {/* ── Form ── */}
            <div className="flex flex-col gap-4">
              {/* Contact Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-small-bold text-text-primary flex items-center gap-1">
                  Your Contact Number
                  <span className="text-state-error text-xs">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                  />
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) =>
                      handleFieldChange(
                        "contactNumber",
                        e.target.value,
                        setContactNumber
                      )
                    }
                    placeholder="e.g. +94 77 123 4567"
                    className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-2.5 text-body-small text-text-primary placeholder:text-text-tertiary outline-none transition-colors ${
                      errors.contactNumber
                        ? "border-state-error/60 focus:border-state-error"
                        : "border-white/10 focus:border-primary-blue/50"
                    }`}
                  />
                </div>
                {errors.contactNumber && (
                  <span className="text-[11px] text-state-error animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.contactNumber}
                  </span>
                )}
              </div>

              {/* Identification Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-small-bold text-text-primary flex items-center gap-1">
                  {isLost
                    ? "How can you identify this item?"
                    : "Describe how this item is yours"}
                  <span className="text-state-error text-xs">*</span>
                </label>
                <div className="relative">
                  <MessageSquare
                    size={15}
                    className="absolute left-3.5 top-3.5 text-text-tertiary pointer-events-none"
                  />
                  <textarea
                    rows={4}
                    maxLength={400}
                    value={description}
                    onChange={(e) =>
                      handleFieldChange(
                        "description",
                        e.target.value,
                        setDescription
                      )
                    }
                    placeholder={
                      isLost
                        ? "e.g. I found a blue wallet near the library canteen around 2 PM today..."
                        : "e.g. It has my student ID inside, there's a scratch on the back cover..."
                    }
                    className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-body-small text-text-primary placeholder:text-text-tertiary outline-none transition-colors resize-none ${
                      errors.description
                        ? "border-state-error/60 focus:border-state-error"
                        : "border-white/10 focus:border-primary-blue/50"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  {errors.description ? (
                    <span className="text-[11px] text-state-error animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.description}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[11px] text-text-tertiary">
                    {description.length}/400
                  </span>
                </div>
              </div>

              {/* API error */}
              {apiError && (
                <div className="rounded-xl border border-state-error/30 bg-state-error/10 px-4 py-3">
                  <p className="text-[12px] text-state-error">{apiError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-body-small text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-2.5 rounded-xl text-white text-body-small-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-blue to-[#60A5FA] hover:brightness-110"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={15} />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
