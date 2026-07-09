import { XCircle, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";

const VerificationActions = ({ status, onWithdraw, onRevoke, onResubmit }) => {
  return (
    <div className="pt-4 border-t border-blue-500/20 flex flex-col gap-3">
      {status === "pending" && (
        <>
          <Button
            variant="secondary"
            className="w-full h-10 rounded-xl bg-dark-4 border-none hover:bg-white/5 flex items-center justify-center gap-2 text-text-secondary hover:text-white"
            onClick={onWithdraw}
          >
            <XCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">
              Withdraw Application
            </span>
          </Button>
          <p className="text-zinc-400 text-xs text-center">
            Withdrawing your application will remove all submitted data.
          </p>
        </>
      )}

      {status === "approved" && (
        <>
          <Button
            variant="dangerOutline"
            size="small"
            fullWidth
            onClick={onRevoke}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove as Batch Rep
          </Button>
          <p className="text-zinc-400 text-xs text-center">
            Revoking your status will remove access to administrative tools
            immediately.
          </p>
        </>
      )}

      {status === "declined" && (
        <>
          <button
            className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-colors"
            onClick={onResubmit}
          >
            <span className="font-bold text-sm text-white">
              Resubmit Document
            </span>
          </button>
          <p className="text-zinc-400 text-xs text-center">
            You can update your document and try again immediately.
          </p>
        </>
      )}

      {status === "removed" && (
        <>
          <button
            className="w-full h-10 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group transition-colors"
            onClick={onResubmit}
          >
            <span className="font-bold text-sm text-white">
              Resubmit Verification
            </span>
          </button>
          <p className="text-zinc-400 text-xs text-center">
            You can upload a new document to request verification again.
          </p>
        </>
      )}
    </div>
  );
};

export default VerificationActions;
