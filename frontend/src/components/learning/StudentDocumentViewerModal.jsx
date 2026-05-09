import React, { useEffect } from "react";
import { X, FileText } from "lucide-react";

const StudentDocumentViewerModal = ({ isOpen, onClose, file }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-gradient-to-b from-gray-900 to-slate-800 overflow-hidden flex justify-center items-center backdrop-blur-md">
      <div className="w-96 h-96 left-0 top-0 absolute bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="w-96 h-96 right-0 bottom-0 absolute bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[90%] max-w-4xl h-[85vh] relative z-10 bg-white/5 rounded-3xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-white/20 flex flex-col backdrop-blur-sm">
        <div className="w-full px-6 py-4 bg-gray-800 rounded-tl-3xl rounded-tr-3xl border-b border-blue-500/20 flex justify-between items-center shrink-0">
          <div className="flex justify-start items-center gap-4">
            <div className="w-10 h-10 bg-red-900/20 rounded-lg flex justify-center items-center">
              <FileText size={20} className="text-red-400" />
            </div>
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col justify-start items-start">
                <div className="justify-center text-white text-base font-bold font-inter leading-5 w-60 truncate">
                  {file?.name || "Document"}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="w-60 justify-center text-slate-400 text-sm font-normal font-inter leading-5">
                  {file?.size ? `${file.size} • ` : ""}
                  {file?.modifiedDate || file?.dateModified
                    ? `Uploaded ${file.modifiedDate || file.dateModified}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="w-full flex-1 p-4 sm:p-8 bg-gray-800 flex justify-center items-start overflow-y-auto no-scrollbar">
          <iframe
            src={file?.fileUrl || file?.url}
            className="w-full h-full rounded shadow-lg bg-white"
            title={file?.name || "Document Viewer"}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentViewerModal;
