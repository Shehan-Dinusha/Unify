import Overlay from "./Overlay";
import Card from "./Card";
import { Gavel, X, Send, ChevronDown } from "lucide-react";

const WarningModal = ({
  open, onClose, loading, onConfirm,
  userName, userId, userFaculty, userAvatar,
  warningCategory, onWarningCategoryChange,
  warningLevel, onWarningLevelChange,
  officialStatement, onOfficialStatementChange,
  violationCategories, severityLevels,
}) => {
  return (
    <Overlay open={open} className="overflow-y-auto">
      <div className="min-h-full flex items-center justify-center py-6">
        <Card variant="modal" padding="p-0" className="w-full max-w-[560px]">
          <div className="p-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-state-error/15 rounded-full flex items-center justify-center">
                  <Gavel size={20} className="text-state-error" />
                </div>
                <div>
                  <h3 className="text-body-large-bold text-text-primary font-inter">Issue Official Warning</h3>
                  <p className="text-body-extra-small text-text-secondary font-inter">This action will be logged in the student&apos;s permanent record.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-6">
              <img src={userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border border-white/20" />
              <div className="flex-1 min-w-0">
                <p className="text-body-small-bold text-text-primary font-inter">{userName}</p>
                <p className="text-body-extra-small text-text-secondary font-inter">ID: #{userId} • {userFaculty}</p>
              </div>
              <span className="inline-flex items-center text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30 whitespace-nowrap">
                Active Standing
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Violation Category</label>
                <div className="relative">
                  <select
                    value={warningCategory}
                    onChange={(e) => onWarningCategoryChange(e.target.value)}
                    className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary font-inter cursor-pointer focus:outline-none focus:border-primary-blue/50 transition-colors pr-10"
                  >
                    {violationCategories.map(opt => <option key={opt} value={opt} className="bg-dark-2 text-text-primary">{opt}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Severity Level</label>
                <div className="relative">
                  <select
                    value={warningLevel}
                    onChange={(e) => onWarningLevelChange(e.target.value)}
                    className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary font-inter cursor-pointer focus:outline-none focus:border-primary-blue/50 transition-colors pr-10"
                  >
                    {severityLevels.map(opt => <option key={opt} value={opt} className="bg-dark-2 text-text-primary">{opt}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-body-small-bold text-text-primary font-inter mb-2 block">Official Statement</label>
              <textarea
                value={officialStatement}
                onChange={(e) => onOfficialStatementChange(e.target.value)}
                placeholder="Please describe the specific incident and reference the violated university by-laws..."
                className={`w-full h-28 bg-white/5 rounded-2xl border ${!officialStatement.trim() ? 'border-state-error/50' : 'border-white/10'} p-md text-body-small text-text-primary font-inter placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-2`}
              />
              {!officialStatement.trim() && (
                <p className="text-[10px] text-state-error italic font-medium">* Official statement is required to issue a warning</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">Cancel</button>
              <button
                onClick={() => officialStatement.trim() && onConfirm()}
                disabled={!officialStatement.trim() || loading}
                className={`flex-1 h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!officialStatement.trim() || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                <Send size={16} /> {loading ? 'Sending...' : 'Send Warning'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Overlay>
  );
};

export default WarningModal;
