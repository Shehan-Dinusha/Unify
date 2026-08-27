import { useState } from "react";
import { X, CheckCircle, Phone, FileText } from "lucide-react";
import { useToast } from "../common/Toast";
import api from "../../services/api";

const ClaimItemModal = ({ item, onClose, onSuccess }) => {
  const toast = useToast();
  const isLost = item.type === "Lost" || item.type === "lost";
  
  const [formData, setFormData] = useState({
    contactNumber: "",
    description: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.contactNumber || !formData.description) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await api.post(`/lost-and-found/${item.id}/claim`, formData);
      
      if (response.data.success) {
        toast.success(response.data.message || "Claim submitted successfully!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to submit claim.");
      }
    } catch (err) {
      console.error("Claim submission error:", err);
      const message = err.response?.data?.message || "An error occurred while submitting your claim.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md bg-dark-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex flex-col">
            <h3 className="text-heading-small text-white">
              {isLost ? "I Found This Item" : "Claim This Item"}
            </h3>
            <p className="text-body-small text-text-secondary mt-1">
              Let the owner of &quot;{item.title}&quot; know.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-body-small-bold text-white flex items-center gap-1.5">
              Your Contact Number <span className="text-state-error">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
                className="w-full bg-dark-3 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-body-medium placeholder:text-text-tertiary focus:outline-none focus:border-primary-blue/50 focus:ring-1 focus:ring-primary-blue/50 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-body-small-bold text-white flex items-center gap-1.5">
              {isLost ? "Where and when did you find it?" : "How can you identify this item?"} <span className="text-state-error">*</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3.5 text-text-tertiary" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={isLost ? "I found it at the library desk..." : "It has a scratch on the back..."}
                rows={4}
                maxLength={400}
                className="w-full bg-dark-3 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-body-medium placeholder:text-text-tertiary focus:outline-none focus:border-primary-blue/50 focus:ring-1 focus:ring-primary-blue/50 transition-all resize-none"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-[10px] text-text-tertiary">{formData.description.length}/400</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-state-error/10 border border-state-error/20 text-state-error text-body-small">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 text-body-medium-bold transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-white bg-primary-blue hover:brightness-110 active:scale-95 text-body-medium-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={18} />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimItemModal;
