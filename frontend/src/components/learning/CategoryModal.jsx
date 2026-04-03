import React, { useState, useEffect } from "react";
import {
  FolderPlus,
  X,
  FileText,
  Play,
  BookOpen,
  FlaskConical,
  PenTool,
  ClipboardList,
  MonitorPlay,
  HelpCircle,
  Users,
  MoreHorizontal,
} from "lucide-react";
import Card from "../common/Card";

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  mode = "create",
  initialData = null,
}) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FileText");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.title || "");
        setSelectedIcon(initialData.iconName || "FileText");
      } else {
        setName("");
        setSelectedIcon("FileText");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const ICONS = [
    { name: "FileText", icon: FileText },
    { name: "Play", icon: Play },
    { name: "BookOpen", icon: BookOpen },
    { name: "FlaskConical", icon: FlaskConical },
    { name: "PenTool", icon: PenTool },
    { name: "ClipboardList", icon: ClipboardList },
    { name: "MonitorPlay", icon: MonitorPlay },
    { name: "HelpCircle", icon: HelpCircle },
    { name: "Users", icon: Users },
    { name: "MoreHorizontal", icon: MoreHorizontal },
  ];

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initialData?.id || Date.now().toString(),
      title: name,
      iconName: selectedIcon,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
      <Card
        variant="card"
        className="w-96 !p-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content area */}
        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <FolderPlus className="text-blue-500 w-6 h-6" />
              <div className="text-white text-xl font-bold font-inter leading-5">
                {mode === "create" ? "Create New Category" : "Edit Category"}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors flex justify-center items-center"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-sm font-bold font-inter leading-5">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Assignments, Tutorials, Case Studies"
                className="w-full px-4 py-3 bg-blue-500/20 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-600 focus:outline-blue-500 text-white placeholder-gray-400 text-base font-normal font-inter leading-5 focus:ring-0"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-gray-300 text-sm font-bold font-inter leading-5">
                Select Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ICONS.map((iconObj) => {
                  const IconComp = iconObj.icon;
                  const isSelected = selectedIcon === iconObj.name;
                  return (
                    <button
                      key={iconObj.name}
                      onClick={() => setSelectedIcon(iconObj.name)}
                      className={`h-10 rounded-lg flex justify-center items-center transition-all ${
                        isSelected
                          ? "bg-blue-900/20 outline outline-2 outline-offset-[-2px] outline-indigo-500"
                          : "bg-gray-800 outline outline-2 outline-offset-[-2px] outline-transparent hover:outline-gray-600"
                      }`}
                    >
                      <IconComp
                        className={
                          isSelected ? "text-indigo-500" : "text-gray-400"
                        }
                        size={18}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex w-full items-center gap-3 border-t border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex justify-center items-center text-neutral-100 text-sm font-bold font-inter leading-5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !selectedIcon}
            className={`flex-1 h-10 rounded-xl flex justify-center items-center text-sm font-bold font-inter leading-5 transition-colors ${
              !name.trim() || !selectedIcon
                ? "bg-blue-500/30 text-white/50 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-[0px_10px_15px_-3px_rgba(43,140,238,0.25)]"
            }`}
          >
            {mode === "create" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CategoryModal;
