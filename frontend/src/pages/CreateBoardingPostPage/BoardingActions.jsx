import { Loader2 } from "lucide-react";

const BoardingActions = ({ loading, onCancel, onPublish }) => (
  <div className="flex gap-4 mb-8">
    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="flex-1 py-3 bg-[#1A2536] hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5 disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={onPublish}
      disabled={loading}
      className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? "Publishing..." : "Publish Boarding"}
    </button>
  </div>
);

export default BoardingActions;
