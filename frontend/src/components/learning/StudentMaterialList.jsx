import React, { useState, useRef, useEffect } from "react";
import {
  PlayCircle,
  FileText,
  Link as LinkIcon,
  Download,
  MoreVertical,
  Share2,
} from "lucide-react";
import StudentVideoViewerModal from "./StudentVideoViewerModal";
import StudentDocumentViewerModal from "./StudentDocumentViewerModal";

/**
 * Helper to get styling and icon based on file type/name (mocking logic)
 */
const getFileIconConfig = (fileName = "", type = "file") => {
  const lowerName = fileName.toLowerCase();
  if (
    lowerName.includes("video") ||
    lowerName.includes("lecture") ||
    lowerName.includes("recording") ||
    type === "video"
  ) {
    return {
      type: "video",
      icon: <PlayCircle size={24} className="text-indigo-500" />,
      bg: "bg-indigo-500/10 outline-indigo-500/20",
    };
  }
  if (
    lowerName.includes("link") ||
    lowerName.includes("reference") ||
    type === "link"
  ) {
    return {
      type: "link",
      icon: <LinkIcon size={24} className="text-teal-500" />,
      bg: "bg-teal-500/10 outline-teal-500/20",
    };
  }
  return {
    type: "document",
    icon: <FileText size={24} className="text-red-500" />,
    bg: "bg-red-500/10 outline-red-500/20",
  };
};

/**
 * Represents a single file record in the student materials view
 */
const StudentFileRecord = ({ file, onClick, onShare }) => {
  const { icon, bg } = getFileIconConfig(file.name, file.type);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleShare = (e) => {
    e.stopPropagation();
    const urlToCopy = file.url || window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    setShowMenu(false);
    if (onShare) onShare(file);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    // Mock download logic
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  return (
    <div
      onClick={() => !showMenu && onClick?.(file)}
      className="w-full p-3 sm:p-3.5 bg-slate-800 rounded-xl outline outline-1 outline-offset-[-0.91px] outline-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 hover:bg-slate-700/50 transition-colors cursor-pointer group"
    >
      <div className="flex justify-start items-center gap-3.5 min-w-0 flex-1">
        <div
          className={`w-11 h-11 shrink-0 rounded-lg outline outline-1 outline-offset-[-0.91px] flex justify-center items-center ${bg}`}
        >
          {icon}
        </div>
        <div className="flex flex-col justify-start items-start gap-1 min-w-0">
          <div className="w-full flex flex-col justify-start items-start overflow-hidden">
            <div className="w-full text-white text-sm font-normal font-inter leading-5 truncate">
              {file.name}
            </div>
          </div>
          <div className="w-full flex flex-wrap justify-start items-center gap-2">
            <div className="flex flex-col justify-start items-start">
              <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-5">
                {file.size || "1.2 MB"}
              </div>
            </div>
            <div className="flex flex-col justify-start items-start">
              <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-4">
                •
              </div>
            </div>
            <div className="flex flex-col justify-start items-start">
              <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-5">
                {file.dateModified || "Added recently"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-end items-center gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity shrink-0 relative"
        ref={menuRef}
      >
        <button
          className={`p-2 rounded-lg flex flex-col justify-center items-center hover:bg-white/10 transition-colors ${showMenu ? "bg-white/10" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <div className="flex justify-center items-start">
            <MoreVertical size={20} className="text-gray-400" />
          </div>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 rounded-xl shadow-lg shadow-black/40 outline outline-1 outline-white/10 overflow-hidden z-50 flex flex-col py-1">
            <button
              className="w-full px-3 py-2 flex items-center gap-2.5 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={handleDownload}
            >
              <Download size={16} />
              <span className="font-medium font-inter">Download</span>
            </button>
            <button
              className="w-full px-3 py-2 flex items-center gap-2.5 text-sm text-gray-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={handleShare}
            >
              <Share2 size={16} />
              <span className="font-medium font-inter">Share Link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * List layout for the student dashboard showing a styled record list
 */
const StudentMaterialList = ({ categoryName = "Notes", files = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(""), 2000);
  };

  const handleFileClick = (file) => {
    const config = getFileIconConfig(file.name, file.type);
    if (config.type === "video") {
      setModalType("video");
    } else if (config.type === "document") {
      setModalType("document");
    } else {
      // It's a link, standard behavior could be to open the link in a new tab
      // But for now, we'll just log or show document modal if needed.
    }
    setSelectedFile(file);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="w-full flex flex-col justify-start items-start gap-3.5">
          <div className="w-full flex justify-start items-center">
            <div className="flex flex-col justify-start items-start">
              <div className="justify-center text-white text-sm font-bold font-inter leading-5">
                {categoryName}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-3">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <StudentFileRecord
                  key={file.id || idx}
                  file={file}
                  onClick={handleFileClick}
                  onShare={() => showToast("Link copied to clipboard!")}
                />
              ))
            ) : (
              <div className="w-full p-8 text-center text-gray-500 font-inter text-sm bg-slate-800 rounded-xl outline outline-1 outline-white/5">
                No files in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <StudentVideoViewerModal
        isOpen={modalType === "video"}
        onClose={handleCloseModal}
        file={selectedFile}
      />

      <StudentDocumentViewerModal
        isOpen={modalType === "document"}
        onClose={handleCloseModal}
        file={selectedFile}
      />

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-5 py-3 rounded-full border border-white/10 shadow-xl shadow-black/50 text-sm font-medium font-inter flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Share2 size={16} className="text-gray-400" />
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default StudentMaterialList;
