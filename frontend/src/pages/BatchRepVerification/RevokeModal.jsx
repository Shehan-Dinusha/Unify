import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Trash2, AlertCircle } from "lucide-react";

const RevokeModal = ({
  open, onClose, onConfirm, loading,
  confirmPassword, setConfirmPassword, passwordError,
}) => {
  return (
    <Overlay open={open} onClose={() => { onClose(); setConfirmPassword(""); }} className="!transition-none">
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
                onClose();
                setConfirmPassword("");
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 text-text-secondary h-11 border-none font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              className="flex-1 h-11 shadow-lg shadow-state-error/20 font-semibold"
              disabled={loading}
            >
              Revoke Status
            </Button>
          </div>
        </div>
      </Card>
    </Overlay>
  );
};

export default RevokeModal;
