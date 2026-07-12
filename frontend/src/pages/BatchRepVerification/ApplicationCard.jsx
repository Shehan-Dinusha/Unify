import { FileText, Clock, AlertCircle, Eye } from "lucide-react";

const ApplicationCard = ({ submittedFile, status, formatFileSize, onPreview }) => {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs font-bold">
          Submitted Document
        </span>
        <div className="flex items-center gap-1">
          {(status === "pending" || status === "approved") && (
            <Clock className={`w-3 h-3 ${status === "approved" ? "text-green-400" : "text-amber-400"}`} />
          )}
          {(status === "declined" || status === "removed") && (
            <AlertCircle className="w-3 h-3 text-red-400" />
          )}
          <span
            className={`text-xs font-bold ${
              status === "pending"
                ? "text-amber-400"
                : status === "approved"
                  ? "text-green-400"
                  : "text-red-400"
            }`}
          >
            {status === "pending"
              ? "Review in progress"
              : status === "approved"
                ? "Verified"
                : status === "removed"
                  ? "Removed"
                  : "Needs Update"}
          </span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
        <div className="p-2 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => onPreview(submittedFile)}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                status === "approved"
                  ? "bg-green-500/20 border-green-500/30"
                  : status === "pending"
                    ? "bg-amber-500/20 border-amber-500/30"
                    : "bg-red-500/20 border-red-500/30"
              }`}
            >
              <FileText
                className={`w-4 h-4 ${
                  status === "approved"
                    ? "text-green-400"
                    : status === "pending"
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span
                className={`text-sm font-bold truncate ${status === "declined" || status === "removed" ? "text-red-400 line-through" : "text-neutral-100"}`}
              >
                {submittedFile?.name || "Document unavailable"}
              </span>
              <span className="text-zinc-400 text-xs">
                {submittedFile
                  ? formatFileSize(submittedFile.size)
                  : "File details available in preview"}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onPreview(submittedFile)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
              title="View Document"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
