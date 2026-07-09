import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Full-screen video player modal mimicking the provided design
 */
const StudentVideoViewerModal = ({ isOpen, onClose, file }) => {
  // Prevent body scroll when open
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
      {/* Background decorations */}
      <div className="w-96 h-96 left-0 top-0 absolute bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="w-96 h-96 right-0 bottom-0 absolute bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-[90%] max-w-5xl relative z-10 flex flex-col justify-start items-start gap-5 px-6 max-h-[90vh]">
        {/* Header */}
        <div className="self-stretch flex justify-between items-start">
          <div className="flex flex-col justify-start items-start gap-1">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-white text-3xl font-bold font-inter leading-9">
                {file?.name || "Video Presentation"}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-slate-400 text-sm font-normal font-inter leading-5">
                {file?.uploader?.name
                  ? `Uploaded by ${file.uploader.name}`
                  : ""}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 transition-colors rounded-full outline outline-1 outline-offset-[-1px] outline-transparent hover:outline-white/20 flex justify-center items-center cursor-pointer"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="w-full relative bg-black rounded-xl shadow-2xl ring-1 ring-white/10 flex flex-col justify-center items-start overflow-hidden aspect-video shrink-0">
          <video
            className="absolute inset-0 w-full h-full object-contain"
            src={file?.fileUrl || file?.url}
            controls
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default StudentVideoViewerModal;
