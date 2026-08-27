import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { ShieldCheck, Power, CheckCircle2, ArrowLeft, RotateCcw } from "lucide-react";

const SuccessModal = ({ open, onClose, type, userName, userId, userAvatar, warningLevel }) => {
  if (!type) return null;

  if (type === 'warning') {
    return (
      <Overlay open={open} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="max-w-lg">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-blue-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><ShieldCheck size={36} className="text-primary-blue" /></div>
                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-state-success border-2 border-dark-1" />
              </div>
              <h2 className="text-xl font-bold text-white font-inter mb-3">Warning Issued Successfully</h2>
              <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The official warning has been issued and logged in the student&apos;s disciplinary record.</p>
              <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                <img src={userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{userName}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {userId}</p></div>
                <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">
                  {warningLevel.includes('Level 1') ? 'Level 1 Warning' : warningLevel.includes('Level 2') ? 'Level 2 Warning' : warningLevel.includes('Level 3') ? 'Level 3 Warning' : 'Level 4 Warning'}
                </span>
              </div>
            </div>
            <div className="px-8 pb-8 pt-2 flex gap-3">
              <Button onClick={() => onClose('dashboard')} variant="gradient" size="medium" className="flex-1 gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
              <button onClick={() => onClose('list')} className="flex-1 h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Queue</button>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  }

  if (type === 'forceLogout') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    return (
      <Overlay open={open} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="max-w-lg">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-blue/20 to-cyan-500/20 flex items-center justify-center ring-4 ring-primary-blue/10 shadow-[0_0_40px_rgba(43,140,238,0.3)]"><Power size={36} className="text-primary-blue" /></div>
              </div>
              <h2 className="text-xl font-bold text-white font-inter mb-1">Force Logout Executed</h2>
              <p className="text-state-success text-sm font-inter font-medium mb-4 uppercase tracking-widest">• System Confirmation</p>
              <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[380px]">Student <span className="text-primary-blue bg-primary-blue/10 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{userId}</span> has been successfully disconnected.</p>
              <div className="w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden text-left mb-2">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 border-b border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Target User</p><div className="flex items-center gap-2"><img src={userAvatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/20" /><span className="text-body-small text-text-primary truncate">{userName.split(' ')[0].charAt(0)}. {userName.split(' ').slice(1).join(' ')}</span></div></div>
                  <div className="px-4 py-3 border-b border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Session ID</p><p className="text-body-small text-text-primary font-mono">#SESS-8922-LK-UNI</p></div>
                  <div className="px-4 py-3 border-r border-white/5"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Action Time</p><p className="text-body-small text-text-primary">{timeStr} LKT</p></div>
                  <div className="px-4 py-3"><p className="text-body-extra-small text-text-secondary mb-1.5 uppercase tracking-wider">Admin</p><p className="text-body-small text-text-primary">SysAdmin_01</p></div>
                </div>
              </div>
            </div>
            <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
              <Button onClick={() => onClose('dashboard')} variant="gradient" fullWidth size="medium" className="gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
              <button onClick={() => onClose('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  }

  if (type === 'suspend') {
    return (
      <Overlay open={open} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6">
          <Card variant="modal" padding="p-0" className="max-w-lg">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5 bg-state-success/10"><CheckCircle2 size={36} className="text-state-success" /></div>
              <h2 className="text-xl font-bold text-white font-inter mb-3">Suspension Applied Successfully</h2>
              <p className="text-text-secondary text-sm font-inter leading-relaxed mb-6 max-w-[340px]">The user has been suspended from the platform. Access has been revoked immediately.</p>
              <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left mb-2">
                <img src={userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{userName}</p><p className="text-body-extra-small text-text-secondary font-inter">ID: {userId}</p></div>
                <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30 whitespace-nowrap uppercase tracking-wide">Suspended</span>
              </div>
            </div>
            <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
              <Button onClick={() => onClose('dashboard')} variant="gradient" fullWidth size="medium" className="gap-2.5"><ArrowLeft size={16} /> Return to Dashboard</Button>
              <button onClick={() => onClose('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={16} className="text-text-secondary" /> View Moderation Queue</button>
            </div>
          </Card>
        </div>
      </Overlay>
    );
  }

  return null;
};

export default SuccessModal;
