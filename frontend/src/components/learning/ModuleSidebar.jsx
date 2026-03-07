import React, { useState } from "react";
import { Folder, FolderOpen, ChevronRight, Plus } from "lucide-react";
import Button from "../common/Button";
import AddModuleModal from "./AddModuleModal";

/**
 * Renders the left sidebar for Semesters and Modules
 */
const ModuleSidebar = ({
  semesters = [],
  activeSemesterId,
  activeModuleId,
  onSelectModule,
  onAddModule,
}) => {
  const [expandedSemesters, setExpandedSemesters] = useState([
    activeSemesterId,
  ]);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);

  const toggleSemester = (id) => {
    setExpandedSemesters((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full lg:w-60 h-[calc(100vh-165px)] min-h-[400px] bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-2 pb-[60px] no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col gap-1">
          {semesters.map((semester) => {
            const isExpanded = expandedSemesters.includes(semester.id);
            return (
              <div key={semester.id} className="flex flex-col gap-1">
                {/* Semester Header */}
                <Button
                  variant="ghost-hoverless"
                  onClick={() => toggleSemester(semester.id)}
                  className={`!w-full !px-2.5 !py-1.5 !rounded-lg flex items-center justify-start text-left gap-2 transition-colors !h-auto ${
                    isExpanded ? "bg-blue-900/20" : "hover:bg-slate-700/50"
                  }`}
                >
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                  {isExpanded ? (
                    <FolderOpen size={16} className="text-white shrink-0" />
                  ) : (
                    <Folder size={16} className="text-gray-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-bold font-inter leading-5 truncate w-full text-left ${
                      isExpanded ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {semester.name}
                  </span>
                </Button>

                {/* Modules List */}
                {isExpanded && semester.modules && (
                  <div className="pl-4 ml-3 border-l-[1.5px] border-slate-700 flex flex-col gap-0.5 mt-1 mb-2">
                    {semester.modules.map((mod) => {
                      const isActive = mod.id === activeModuleId;
                      return (
                        <Button
                          key={mod.id}
                          variant="ghost-hoverless"
                          onClick={() => onSelectModule(mod.id)}
                          title={mod.name}
                          className={`!w-full !px-2.5 !py-1.5 flex items-center justify-start gap-2 !rounded-md overflow-hidden text-left transition-colors !h-auto ${
                            isActive
                              ? "bg-blue-900/10 text-white"
                              : "text-gray-400 hover:bg-slate-700/30"
                          }`}
                        >
                          <Folder
                            size={14}
                            className={`shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}
                          />
                          <span className="text-xs font-bold font-inter leading-5 w-full text-left truncate">
                            {mod.name}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Module Button Pinned to Bottom */}
      <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-800 border-t border-gray-700">
        <Button
          variant="ghost-hoverless"
          onClick={() => setIsAddModuleOpen(true)}
          className="!w-full !px-2.5 !py-2 !rounded-lg outline outline-1 outline-indigo-500/40 flex justify-start items-center text-left gap-2 hover:bg-slate-700/50 transition-colors !h-auto"
        >
          <Plus size={14} className="text-gray-400" />
          <span className="text-gray-400 text-xs font-bold font-inter leading-5">
            Add Module
          </span>
        </Button>
      </div>

      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onSave={(data) => {
          if (onAddModule) {
            onAddModule(data);
          }
          setIsAddModuleOpen(false);
          // Auto-expand the semester where the module was added so it is visible immediately
          if (!expandedSemesters.includes(data.semester)) {
            setExpandedSemesters((prev) => [...prev, data.semester]);
          }
        }}
      />
    </div>
  );
};

export default ModuleSidebar;
