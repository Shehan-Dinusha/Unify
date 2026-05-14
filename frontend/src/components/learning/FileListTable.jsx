import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  PlayCircle,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  FileArchive,
  FileCode,
} from "lucide-react";
import Button from "../common/Button";
import { EditMaterialModal, DeleteMaterialModal } from "./MaterialActionModals";
import * as learningService from "../../services/learningService";
import { useToast } from "../common/Toast";
import StudentVideoViewerModal from "./StudentVideoViewerModal";
import StudentDocumentViewerModal from "./StudentDocumentViewerModal";

const getFileIconConfig = (fileName = "", type = "file") => {
  const lowerName = fileName.toLowerCase();
  const lowerType = type ? type.toLowerCase() : "";

  if (
    lowerType.startsWith("video/") ||
    lowerType === "video" ||
    lowerName.match(/\.(mp4|mov|avi|wmv|flv|mkv|webm)$/)
  ) {
    return {
      type: "video",
      icon: <PlayCircle size={20} className="text-indigo-500" />,
      bg: "bg-indigo-500/10 outline-indigo-500/20",
    };
  }
  if (
    lowerType === "link" ||
    lowerName.includes("link") ||
    lowerName.includes("reference")
  ) {
    return {
      type: "link",
      icon: <LinkIcon size={20} className="text-teal-500" />,
      bg: "bg-teal-500/10 outline-teal-500/20",
    };
  }
  if (
    lowerType.startsWith("image/") ||
    lowerName.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)
  ) {
    return {
      type: "image",
      icon: <ImageIcon size={20} className="text-pink-500" />,
      bg: "bg-pink-500/10 outline-pink-500/20",
    };
  }
  if (
    lowerType.includes("zip") ||
    lowerType.includes("tar") ||
    lowerType.includes("rar") ||
    lowerName.match(/\.(zip|rar|tar|gz|7z)$/)
  ) {
    return {
      type: "archive",
      icon: <FileArchive size={20} className="text-amber-500" />,
      bg: "bg-amber-500/10 outline-amber-500/20",
    };
  }
  if (
    lowerType.includes("json") ||
    lowerType.includes("javascript") ||
    lowerType.includes("html") ||
    lowerName.match(/\.(js|jsx|ts|tsx|html|css|json|py|java|cpp|c|cs)$/)
  ) {
    return {
      type: "code",
      icon: <FileCode size={20} className="text-emerald-500" />,
      bg: "bg-emerald-500/10 outline-emerald-500/20",
    };
  }
  return {
    type: "document",
    icon: <FileText size={20} className="text-red-500" />,
    bg: "bg-red-500/10 outline-red-500/20",
  };
};

/**
 * Represents the table view showing files inside a specific category (e.g., Video Files)
 */
const FileListTable = ({
  categoryName,
  categories = [],
  files: initialFiles = [],
  onRefresh,
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [editingFile, setEditingFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const [modalType, setModalType] = useState(null);
  const toast = useToast();

  React.useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleEditSave = async (updatedFile) => {
    try {
      await learningService.editMaterial(updatedFile.id, {
        title: updatedFile.name,
        categoryId: updatedFile.categoryId,
      });
      onRefresh?.();
    } catch (err) {
      console.error("Failed to edit material", err);
      toast.error("Error", "Failed to edit material");
    }
  };

  const handleDeleteConfirm = async (fileToDelete) => {
    try {
      await learningService.deleteMaterial(fileToDelete.id);
      onRefresh?.();
    } catch (err) {
      console.error("Failed to delete material", err);
      toast.error("Error", "Failed to delete material");
    }
  };
  return (
    <div className="w-full bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col overflow-x-auto">
      {/* Header */}
      <div className="w-full min-w-[700px] h-12 px-5 py-3 border-b border-gray-700 flex items-center">
        <h3 className="text-white text-sm font-bold font-inter leading-5">
          Files in "{categoryName}"
        </h3>
      </div>

      {/* Table columns */}
      <div className="w-full min-w-[700px] bg-gray-800/50 flex">
        <div className="w-80 px-5 py-3 flex items-center">
          <span className="text-gray-400 text-xs font-bold font-inter leading-5 uppercase tracking-wider">
            FILE
          </span>
        </div>
        <div className="w-40 px-5 py-3 flex items-center">
          <span className="text-gray-400 text-xs font-bold font-inter leading-5 uppercase tracking-wider">
            UPLOADED BY
          </span>
        </div>
        <div className="flex-1 px-5 py-3 flex items-center">
          <span className="text-gray-400 text-xs font-bold font-inter leading-5 uppercase tracking-wider">
            DATE MODIFIED
          </span>
        </div>
      </div>

      {/* Table rows */}
      <div className="w-full min-w-[700px] flex flex-col overflow-y-auto max-h-[320px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full border-b border-transparent">
        {files.map((file, idx) => {
          const iconConfig = getFileIconConfig(
            file.name,
            file.fileType || file.type,
          );
          return (
            <div
              key={idx}
              onClick={() => {
                if (iconConfig.type === "link") {
                  window.open(file.fileUrl || file.url, "_blank");
                } else {
                  setViewingFile(file);
                  setModalType(
                    iconConfig.type === "video" ? "video" : "document",
                  );
                }
              }}
              className="shrink-0 w-full h-20 px-5 flex items-center border-t border-gray-700 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              {/* File Column */}
              <div className="w-80 flex items-center gap-3.5 pr-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconConfig.bg}`}
                >
                  {iconConfig.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-white text-sm font-bold font-inter leading-5 truncate">
                    {file.name}
                  </h4>
                  <p className="text-gray-400 text-xs font-normal font-inter leading-5">
                    {file.size}
                  </p>
                </div>
              </div>

              {/* Uploader Column */}
              <div className="w-40 flex items-center gap-2 pr-4">
                {file.uploader.avatar ? (
                  <img
                    src={file.uploader.avatar}
                    alt={file.uploader.name}
                    className="w-6 h-6 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center border border-gray-700">
                    <span className="text-white text-[10px] font-medium font-inter">
                      {file.uploader.initials}
                    </span>
                  </div>
                )}
                <span className="text-gray-300 text-xs font-normal font-inter leading-5 truncate">
                  {file.uploader.name}
                </span>
              </div>

              {/* Date Column and Actions */}
              <div className="flex-1 flex justify-between items-center">
                <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                  {file.modifiedDate || file.dateModified}
                </span>
                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFile(file);
                    }}
                    className="!px-2 !py-2 text-gray-400 hover:text-white transition-colors rounded hover:bg-white/10 relative z-10"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFile(file);
                    }}
                    className="!px-2 !py-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-white/10 relative z-10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {files.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-inter text-sm">
            No files uploaded yet.
          </div>
        )}
      </div>

      <EditMaterialModal
        isOpen={!!editingFile}
        onClose={() => setEditingFile(null)}
        file={editingFile}
        categories={categories}
        onSave={handleEditSave}
      />

      <DeleteMaterialModal
        isOpen={!!deletingFile}
        onClose={() => setDeletingFile(null)}
        file={deletingFile}
        onDelete={handleDeleteConfirm}
      />

      <StudentVideoViewerModal
        isOpen={modalType === "video"}
        onClose={() => {
          setViewingFile(null);
          setModalType(null);
        }}
        file={viewingFile}
      />

      <StudentDocumentViewerModal
        isOpen={modalType === "document"}
        onClose={() => {
          setViewingFile(null);
          setModalType(null);
        }}
        file={viewingFile}
      />
    </div>
  );
};

export default FileListTable;
