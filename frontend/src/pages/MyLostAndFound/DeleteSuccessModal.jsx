import { CheckCircle, X } from "lucide-react";
import Card from "../../components/common/Card";

const DeleteSuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4" />
    <Card variant="modal" padding="p-6 sm:p-8" className="max-w-sm animate-in fade-in zoom-in-95 duration-200 text-center relative" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors">
        <X size={18} />
      </button>
      <div className="w-14 h-14 rounded-full bg-state-success/15 flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={28} className="text-state-success" />
      </div>
      <h3 className="text-body-large-bold text-text-primary mb-2">Deleted Successfully</h3>
      <p className="text-body-small text-text-secondary leading-relaxed mb-6">
        The post has been removed from the platform and will no longer appear in listings or search results.
      </p>
      <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]">
        Done
      </button>
    </Card>
  </div>
);

export default DeleteSuccessModal;
