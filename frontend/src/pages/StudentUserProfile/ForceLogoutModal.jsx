import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import { X, LogOut } from "lucide-react";

const ForceLogoutModal = ({ open, onClose, onConfirm, loading, userName, userAvatar, userFaculty, isOnline, activeSessions }) => {
  return (
    <Overlay open={open} className="overflow-y-auto">
      <div className="min-h-full flex items-center justify-center py-6">
        <Card variant="modal" padding="p-0" className="">
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-state-error/15 flex items-center justify-center mb-5 ring-4 ring-state-error/10">
              <div className="w-10 h-10 rounded-full bg-state-error flex items-center justify-center shadow-[0_0_15px_rgba(255,99,102,0.4)]">
                <X size={22} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white font-inter mb-3">Confirm Force Logout</h2>
            <p className="text-body-small text-text-secondary font-inter leading-relaxed mb-6 max-w-[360px]">This action is irreversible. The user will be instantly disconnected. Any unsaved data on their active screens may be lost.</p>
            <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-6">
              <img src={userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-body-small-bold text-text-primary font-inter">{userName}</p>
                <p className="text-body-extra-small text-text-secondary font-inter">{userFaculty}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center gap-xs text-body-extra-small-bold ${isOnline ? 'text-state-success' : 'text-text-secondary'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-state-success' : 'bg-text-secondary'}`} />
                  {isOnline ? 'Active' : 'Offline'}
                </span>
                <p className="text-body-extra-small text-text-secondary font-inter mt-0.5">{isOnline ? (activeSessions || 1) : 0} Sessions</p>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={onClose} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
              <button
                onClick={() => isOnline && onConfirm()}
                disabled={!isOnline || loading}
                className={`flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!isOnline || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                <LogOut size={16} /> {loading ? 'Processing...' : 'Execute Logout'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Overlay>
  );
};

export default ForceLogoutModal;
