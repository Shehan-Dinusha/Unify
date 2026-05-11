import { FolderOpen, Upload, Edit2, Plus } from "lucide-react";
import Button from "../common/Button";
import { useState } from "react";
import UploadMaterialModal from "./UploadMaterialModal";
import EditModuleModal from "./EditModuleModal";
import { useToast } from "../common/Toast";

/**
 * Renders the top header for the selected module showing details and access
 */
const ModuleHeader = ({
  moduleName,
  moduleCode,
  semesterName,
  degrees = [],
  lastUpdated,
  isPublic = true,
  onEditSave,
  onDelete,
  moduleId,
  onMaterialUploaded,
  availableDegrees = [],
  primaryDegree,
  semesters = [],
  categories = [],
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  return (
    <div className="w-full p-4 sm:p-5 bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col gap-3.5">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <div className="flex items-center gap-2">
            <FolderOpen size={20} className="text-indigo-500" />
            <h3 className="text-white text-base font-bold font-inter leading-5">
              {moduleName}
            </h3>
          </div>

          {/* Meta Information Tags */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                🏷️ {moduleCode}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                📅 {semesterName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                Degrees:
              </span>
              {degrees.map((deg, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded flex justify-center items-center ${
                    idx === 0
                      ? "bg-blue-900 text-blue-200"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <span className="text-xs font-normal font-inter leading-5">
                    {deg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="small"
            className="!px-3 !rounded-lg border border-gray-700 bg-transparent hover:bg-slate-700/50 h-10"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 size={16} className="text-gray-400" />
          </Button>
          <Button
            variant="primary"
            size="small"
            className="!bg-indigo-500 hover:!bg-indigo-600 shadow-[0_8.8px_13.2px_-2.6px_rgba(59,130,246,0.30)] !rounded-lg flex items-center gap-2 h-10 !px-3.5"
            onClick={() => {
              if (!categories || categories.length === 0) {
                toast.warning(
                  "Category Required",
                  "Please create at least one category before uploading a file.",
                );
                return;
              }
              setIsUploadModalOpen(true);
            }}
          >
            <Upload size={14} className="text-white" />
            <span className="text-white font-medium">Upload File</span>
          </Button>
        </div>
      </div>

      {/* Access Footer */}
      <div className="w-full pt-3.5 border-t border-gray-700 flex items-center gap-2">
        <div
          className={`px-2 py-0.5 ${isPublic ? "bg-green-900" : "bg-red-900/50 outline outline-1 outline-red-800/50"} rounded flex justify-center items-center`}
        >
          <span
            className={`text-xs font-normal font-inter leading-5 ${isPublic ? "text-neutral-100" : "text-red-300"}`}
          >
            {isPublic ? "Public Access" : "Restricted Access"}
          </span>
        </div>
        <div className="px-2 py-0.5 bg-gray-700 rounded flex justify-center items-center">
          <span className="text-neutral-100 text-xs font-normal font-inter leading-5">
            Last Updated: {lastUpdated}
          </span>
        </div>
      </div>

      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        moduleName={moduleName}
        moduleId={moduleId}
        categories={categories}
        onSuccess={onMaterialUploaded}
      />

      <EditModuleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          if (onEditSave) {
            onEditSave(data);
          }
          setIsEditModalOpen(false);
        }}
        onDelete={() => {
          if (onDelete) {
            onDelete();
          }
          setIsEditModalOpen(false);
        }}
        initialData={{
          moduleName,
          moduleCode,
          semesterName,
          degrees,
        }}
        availableDegrees={availableDegrees}
        primaryDegree={primaryDegree}
        semesters={semesters}
      />
    </div>
  );
};

export default ModuleHeader;
