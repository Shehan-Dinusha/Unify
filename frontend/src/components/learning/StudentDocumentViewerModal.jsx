import React, { useEffect, useState } from "react";
import { X, FileText, ImageIcon, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const isImageFile = (file) => {
  const mime = (file?.fileType || file?.type || "").toLowerCase();
  const name = (file?.name || "").toLowerCase();
  return (
    mime.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/.test(name)
  );
};

const StudentDocumentViewerModal = ({ isOpen, onClose, file }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const image = isImageFile(file);

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-gradient-to-b from-gray-900 to-slate-800 overflow-hidden flex justify-center items-center backdrop-blur-md">
      <div className="w-96 h-96 left-0 top-0 absolute bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="w-96 h-96 right-0 bottom-0 absolute bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[90%] max-w-4xl h-[85vh] relative z-10 bg-white/5 rounded-3xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-white/20 flex flex-col backdrop-blur-sm">
        <div className="w-full px-6 py-4 bg-gray-800 rounded-tl-3xl rounded-tr-3xl border-b border-blue-500/20 flex justify-between items-center shrink-0">
          <div className="flex justify-start items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex justify-center items-center ${image ? "bg-pink-900/20" : "bg-red-900/20"}`}>
              {image ? (
                <ImageIcon size={20} className="text-pink-400" />
              ) : (
                <FileText size={20} className="text-red-400" />
              )}
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

        <div className="w-full flex-1 p-4 sm:p-8 bg-gray-800 flex flex-col justify-start items-center gap-3 overflow-hidden">
          {image && (
            <div className="flex items-center gap-2 bg-gray-900/80 rounded-lg border border-white/10 p-1 shrink-0 self-start">
              <button
                onClick={() => setZoomLevel((p) => Math.max(25, p - 25))}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-gray-300 min-w-[3rem] text-center select-none">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((p) => Math.min(200, p + 25))}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                title="Reset zoom"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          )}

          <div className="w-full flex-1 overflow-auto no-scrollbar flex justify-center">
            {image ? (
              <img
                src={file?.fileUrl || file?.url}
                alt={file?.name || "Image"}
                className="transition-all duration-200 object-contain rounded-lg shadow-lg"
                style={{
                  width: `${zoomLevel}%`,
                  maxWidth: "none",
                  height: "auto",
                  alignSelf: "flex-start",
                }}
              />
            ) : (
              <iframe
                src={file?.fileUrl || file?.url}
                className="w-full h-full rounded shadow-lg bg-white"
                title={file?.name || "Document Viewer"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentViewerModal;
