import React, { useState, useEffect } from "react";
import { Folder, FolderOpen, ChevronRight, Plus, Eye } from "lucide-react";
import Button from "../common/Button";
import AddModuleModal from "./AddModuleModal";
import SemesterVisibilityModal from "./SemesterVisibilityModal";
import * as learningService from "../../services/learningService";

/**
 * Renders the left sidebar for Semesters and Modules
 */
const ModuleSidebar = ({
  semesters = [],
  activeSemesterId,
  activeModuleId,
  onSelectModule,
  readOnly = false,
  title,
  className = "",
  degreeId = 18,
  availableDegrees = [],
  primaryDegree = "Bsc.(Hons) IT",
}) => {
  const [expandedSemesters, setExpandedSemesters] = useState([
    activeSemesterId,
  ]);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [visibilitySemester, setVisibilitySemester] = useState(null);
  const [currentVisibility, setCurrentVisibility] = useState([]);

  useEffect(() => {
    if (activeSemesterId && !expandedSemesters.includes(activeSemesterId)) {
      setExpandedSemesters([activeSemesterId]);
    }
  }, [activeSemesterId]);

  const toggleSemester = (id) => {
    setExpandedSemesters((prev) => (prev.includes(id) ? [] : [id]));
  };

  const handleOpenVisibility = async (e, semester) => {
    e.stopPropagation();
    setVisibilitySemester(semester);
    try {
      // It expects semester visibility for a given degree and semester
      // It returns an array of visible batch IDs or similar
      const res = await learningService.getSemesterVisibility(degreeId, semester.id);
      // Fallback depending on backend structure
      const batches = res?.data || [];
      // Assuming it returns array of batch objects or batch ids. 
      // Based on validator: visibleBatchIds
      // Actually validator updateSemesterVisibilityValidator expects visibleBatchIds.
      // So let's assume it returns { visibleBatchIds: [...] } or array of objects with id.
      // We will parse it depending on what we get.
      setCurrentVisibility(res?.data?.visibleBatchIds || (Array.isArray(res?.data) ? res.data.map(b => b.id || b) : []));
    } catch (err) {
      console.error("Failed to fetch semester visibility", err);
      setCurrentVisibility([]);
    }
  };

  return (
    <div className={`w-full lg:w-60 h-auto lg:h-[calc(100vh-165px)] lg:min-h-[400px] bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col overflow-hidden relative ${className}`}>
      <div className="flex-1 overflow-y-auto p-2 pb-[60px] no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {title && (
          <div className="w-full pl-2.5 pt-2 flex flex-col justify-start items-start pb-2">
            <div className="justify-center text-gray-500 text-[9px] font-bold font-inter uppercase leading-3 tracking-wide">{title}</div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {semesters.map((semester) => {
            const isExpanded = expandedSemesters.includes(semester.id);
            return (
              <div key={semester.id} className="flex flex-col gap-1">
                {/* Semester Header */}
                <Button
                  variant="ghost-hoverless"
                  onClick={() => toggleSemester(semester.id)}
                  className={`!w-full !px-2.5 !py-1.5 !rounded-lg flex items-center justify-between text-left gap-2 transition-colors !h-auto group ${
                    isExpanded ? "bg-blue-900/20" : "hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full">
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
                  </div>
                  {!readOnly && (
                    <div
                      onClick={(e) => handleOpenVisibility(e, semester)}
                      className={`p-1 hover:bg-white/10 rounded-md shrink-0 transition-opacity ${
                        isExpanded
                          ? "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                      title="Visibility Settings"
                    >
                      <Eye
                        size={16}
                        className="text-gray-400 hover:text-white transition-colors"
                      />
                    </div>
                  )}
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

      {!readOnly && (
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
      )}

      <AddModuleModal
        isOpen={isAddModuleOpen}
        onClose={() => setIsAddModuleOpen(false)}
        onSave={(data) => {
          if (onAddModule) {
            onAddModule(data);
          }
          setIsAddModuleOpen(false);
          // Set only the new semester to be open
          setExpandedSemesters([data.semester]);
        }}
        availableDegrees={availableDegrees}
        primaryDegree={primaryDegree}
        semesters={semesters}
      />

      <SemesterVisibilityModal
        isOpen={!!visibilitySemester}
        onClose={() => setVisibilitySemester(null)}
        semesterName={visibilitySemester?.name}
        availableBatches={[
          {
            id: "b25",
            short: "'25",
            name: "Batch 25",
            colorBg: "bg-orange-900/30",
            colorText: "text-orange-400",
          },
          {
            id: "b24",
            short: "'24",
            name: "Batch 24",
            colorBg: "bg-indigo-900/30",
            colorText: "text-indigo-400",
          },
          {
            id: "b23",
            short: "'23",
            name: "Batch 23",
            colorBg: "bg-emerald-900/30",
            colorText: "text-emerald-400",
          },
          {
            id: "b22",
            short: "'22",
            name: "Batch 22",
            colorBg: "bg-indigo-900/30",
            colorText: "text-indigo-400",
          },
        ]}
        // Default visibility is none by default per requirements.
        currentVisibility={currentVisibility}
        onSaveVisibility={async (data) => {
          try {
            await learningService.updateSemesterVisibility(degreeId, visibilitySemester.id, {
              visibleBatchIds: data.visibleBatchIds,
              notifyReps: data.notifyReps,
            });
            setVisibilitySemester(null);
          } catch (err) {
            console.error("Failed to update semester visibility", err);
            alert("Failed to update semester visibility");
          }
        }}
      />
    </div>
  );
};

export default ModuleSidebar;
