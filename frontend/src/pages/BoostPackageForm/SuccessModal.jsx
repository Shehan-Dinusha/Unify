import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { CheckCircle2, LayoutDashboard, Settings } from "lucide-react";

const SuccessModal = ({ open, data, onReturnDashboard, onManagePackages }) => {
  if (!data) return null;

  return (
    <Overlay open={open} onClose={() => {}} className="py-6 overflow-y-auto">
      <Card variant="modal" padding="p-0" className="max-w-sm my-auto">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
            <CheckCircle2 size={28} className="text-state-success sm:hidden" />
            <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Package Successfully {data.isEdit ? "Updated" : "Added"}</h2>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm">
            The "{data.packageTier}" boosting package has been successfully {data.isEdit ? "applied to your active campaign" : "added to your active campaign"}. Your ad visibility will increase immediately.
          </p>
          <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-md sm:p-lg mb-4 sm:mb-6">
            <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
              <span className="text-body-extra-small text-text-secondary font-inter">Operation ID</span>
              <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{data.operationId}</span>
            </div>
            <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
              <span className="text-body-extra-small text-text-secondary font-inter">Activation Date</span>
              <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{data.activationDate}</span>
            </div>
            <div className="flex items-center justify-between py-xs sm:py-sm">
              <span className="text-body-extra-small text-text-secondary font-inter">Package Tier</span>
              <span className="text-body-extra-small sm:text-body-small-bold text-primary-blue font-inter flex items-center gap-1">⚡ {data.packageTier.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
          <Button onClick={onReturnDashboard} variant="gradient" fullWidth size="medium" className="h-11 sm:h-12 gap-2.5">
            <LayoutDashboard size={18} /> Return to Dashboard
          </Button>
          <button onClick={onManagePackages} className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
            <Settings size={18} className="text-text-secondary" /> Manage All Packages
          </button>
        </div>
      </Card>
    </Overlay>
  );
};

export default SuccessModal;
