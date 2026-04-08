import React, { useEffect } from "react";
import {
  X,
  Play,
  Volume2,
  Maximize,
  Settings,
  MessageSquare,
  PlayCircle,
  FastForward,
} from "lucide-react";

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
                {file?.name || "Lecture 4: Introduction to Data Structures"}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="justify-center text-slate-400 text-sm font-normal font-inter leading-5">
                {file?.subtitle ||
                  "CS101 - Fall Semester • Prof. Sarah Jenkins"}
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
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="https://placehold.co/1120x630/1a1a2e/ffffff?text=Video+Player"
            alt="Video poster"
          />

          {/* Big Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 flex justify-center items-center cursor-pointer hover:bg-black/10 transition-colors">
            <div className="w-20 h-20 pl-1 bg-blue-500 hover:bg-blue-600 transition-colors rounded-full shadow-lg backdrop-blur-[2px] flex justify-center items-center overflow-hidden">
              <Play size={32} fill="white" className="text-white" />
            </div>
          </div>

          {/* Top Gradient */}
          <div className="absolute inset-x-0 top-0 h-24 opacity-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Bottom Controls Area */}
          <div className="absolute inset-x-0 bottom-0 px-6 pt-20 pb-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end items-start w-full">
            {/* Scrubber */}
            <div className="self-stretch h-7 pb-2 flex flex-col justify-start items-start cursor-pointer group">
              <div className="self-stretch h-5 relative flex justify-center items-center">
                <div className="flex-1 h-1 relative bg-white/30 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
                  <div className="w-1/2 h-full absolute left-0 top-0 bg-white/20" />
                </div>
                {/* Progress bar fill */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40%] h-1 group-hover:h-1.5 bg-blue-500 rounded-full transition-all" />
                {/* Thumb */}
                <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Tooltip */}
                <div className="absolute left-[40%] -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-black/80 rounded px-2 py-1 outline outline-1 outline-white/10 transition-opacity">
                  <div className="text-white text-xs font-normal font-lexend leading-4">
                    14:20
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="self-stretch flex justify-between items-center w-full">
              {/* Left Controls */}
              <div className="flex justify-start items-center gap-4">
                <button className="flex justify-center items-center hover:text-blue-400 transition-colors group">
                  <Play
                    size={20}
                    fill="white"
                    className="text-white group-hover:text-blue-400"
                  />
                </button>
                <div className="flex justify-start items-center group cursor-pointer">
                  <button className="flex justify-center items-center hover:text-blue-400 transition-colors pr-2">
                    <Volume2
                      size={20}
                      className="text-white group-hover:text-blue-400"
                    />
                  </button>
                  {/* Volume Slider (hidden typically until hover, but keeping layout simple) */}
                </div>
                <div className="pl-2 flex flex-col justify-start items-start">
                  <div className="flex items-center gap-1">
                    <div className="text-white text-sm font-bold font-inter leading-5">
                      14:20
                    </div>
                    <div className="text-white/50 text-sm font-medium font-lexend leading-5 tracking-tight">
                      /
                    </div>
                    <div className="text-white/70 text-sm font-bold font-inter leading-5">
                      45:00
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex justify-start items-center gap-4">
                <button className="p-1 rounded hover:bg-white/20 transition-colors">
                  <MessageSquare size={20} className="text-white/90" />
                </button>
                <button className="p-1 rounded hover:bg-white/20 transition-colors">
                  <Settings size={20} className="text-white/90" />
                </button>
                <div className="pl-2 flex justify-start items-start">
                  <button className="p-1 rounded hover:bg-white/20 transition-colors">
                    <Maximize size={20} className="text-white/90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentVideoViewerModal;
