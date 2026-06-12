import { AlertTriangle } from "lucide-react";
import Card from "../../components/common/Card";

const DeleteConfirmModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4" />
    <Card variant="modal" padding="p-6 sm:p-8" className="animate-in fade-in zoom-in-95 duration-200 text-center" onClick={(e) => e.stopPropagation()}>
      <div className="w-14 h-14 rounded-full bg-state-error/15 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={28} className="text-state-error" />
      </div>
      <h3 className="text-body-large-bold text-text-primary mb-2">Delete this post?</h3>
      <p className="text-body-small text-text-secondary leading-relaxed mb-6">
        Are you sure you want to permanently remove this post?{" "}
        <span className="text-text-primary font-medium">This action cannot be undone.</span>
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-body-small-bold text-text-primary hover:bg-white/10 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-state-error hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]">
          Delete Post
        </button>
      </div>
    </Card>
  </div>
);

export default DeleteConfirmModal;
