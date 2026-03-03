import { FolderOpen, Upload, Edit2, Plus } from "lucide-react";
import Button from "../common/Button";

/**
 * Renders the top header for the selected module showing details and access
 */
const ModuleHeader = ({
  moduleName = "Programming Fundamentals",
  moduleCode = "IN1101",
  semesterName = "Semester 1",
  degrees = ["Bsc.(Hons) IT", "Bsc.(Hons) AI"],
  lastUpdated = "2 hours ago",
  isPublic = true,
}) => {
  return (
    <div className="w-full p-5 bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col gap-3.5">
      <div className="w-full flex justify-between items-start">
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
              <div
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => console.log("Add Degree")}
              >
                <Plus size={14} />
                <span className="text-xs font-bold font-inter leading-5">
                  Add
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="small"
            className="!px-3 !rounded-lg border border-gray-700 bg-transparent hover:bg-slate-700/50 h-10"
            onClick={() => console.log("Edit")}
          >
            <Edit2 size={16} className="text-gray-400" />
          </Button>
          <Button
            variant="primary"
            size="small"
            className="!bg-indigo-500 hover:!bg-indigo-600 shadow-[0_8.8px_13.2px_-2.6px_rgba(59,130,246,0.30)] !rounded-lg flex items-center gap-2 h-10 !px-3.5"
            onClick={() => console.log("Upload")}
          >
            <Upload size={14} className="text-white" />
            <span className="text-white font-medium">Upload File</span>
          </Button>
        </div>
      </div>

      {/* Access Footer */}
      <div className="w-full pt-3.5 border-t border-gray-700 flex items-center gap-2">
        <div className="px-2 py-0.5 bg-green-900 rounded flex justify-center items-center">
          <span className="text-neutral-100 text-xs font-normal font-inter leading-5">
            {isPublic ? "Public Access" : "Restricted Access"}
          </span>
        </div>
        <div className="px-2 py-0.5 bg-gray-700 rounded flex justify-center items-center">
          <span className="text-neutral-100 text-xs font-normal font-inter leading-5">
            Last Updated: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
