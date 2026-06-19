import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusIcon from "../../components/common/StatusIcon";
import { Save } from "lucide-react";

const SaveConfirmModal = ({ open, onCancel, onConfirm, isEditing, packageName }) => {
  return (
    <Overlay open={open} onClose={onCancel}>
      <Card variant="modal" padding="p-0" className="max-w-sm">
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <StatusIcon variant="info" size="lg" icon={<Save size={32} className="text-primary-blue" />} />
          <h2 className="text-xl font-bold text-white mb-3">{isEditing ? "Update Package?" : "Save New Package?"}</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-sm">
            {isEditing
              ? <>Are you sure you want to update the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? Changes will take effect immediately.</>
              : <>Are you sure you want to create the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? It will be available for businesses immediately.</>}
          </p>
        </div>
        <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
          <Button onClick={onConfirm} variant="gradient" fullWidth size="medium" className="gap-2.5">
            <Save size={18} /> {isEditing ? "Yes, Update Package" : "Yes, Save Package"}
          </Button>
          <button onClick={onCancel} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
            Cancel
          </button>
        </div>
      </Card>
    </Overlay>
  );
};

export default SaveConfirmModal;
