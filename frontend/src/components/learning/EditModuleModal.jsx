import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import { X, Lock, Save, ChevronDown, Trash2, Loader2 } from "lucide-react";

const EditModuleModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  availableDegrees = [],
  primaryDegree,
  semesters = [],
  creatorDegreeId,
  userDegreeId,
}) => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedDegrees, setSelectedDegrees] = useState([primaryDegree]);
  const [isDegreeDropdownOpen, setIsDegreeDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.moduleName || "");
      setCode(initialData.moduleCode || "");
      setSemester(initialData.semesterName || "");
      // Ensure primary degree is always present
      const initDegrees = initialData.degrees || [];
      const updatedDegrees = initDegrees.includes(primaryDegree)
        ? initDegrees
        : [primaryDegree, ...initDegrees];
      setSelectedDegrees(updatedDegrees);
      setIsDegreeDropdownOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  if (!isOpen || !mounted) return null;

  const handleAddDegree = (degree) => {
    if (!selectedDegrees.includes(degree)) {
      setSelectedDegrees((prev) => [...prev, degree]);
    }
    setIsDegreeDropdownOpen(false);
  };

  const handleRemoveDegree = (degreeToRemove) => {
    if (degreeToRemove === primaryDegree) return; // Cannot remove primary
    setSelectedDegrees((prev) => prev.filter((d) => d !== degreeToRemove));
  };

  const handleSave = async () => {
    if (!title || !code || !semester) return;
    setIsSaving(true);
    try {
      await onSave({
        title,
        code,
        semester,
        visibility: selectedDegrees,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const unselectedDegrees = availableDegrees.filter(
    (d) => !selectedDegrees.includes(d) && d !== primaryDegree,
  );

  const isOwner =
    !creatorDegreeId ||
    !userDegreeId ||
    String(creatorDegreeId) === String(userDegreeId);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-1/80 backdrop-blur-md transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[600px] max-h-[90vh] !p-0 flex flex-col relative outline outline-1 outline-offset-[-1px] outline-white/20 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] animate-in fade-in zoom-in duration-200 bg-white/10"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 pb-2 relative flex flex-col items-start gap-1 shrink-0 z-20">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-6 right-6 !w-8 !h-8 !p-0 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
          <h2 className="text-white text-body-large-bold">
            Edit Module Details
          </h2>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-2 flex flex-col gap-4 w-full flex-1 overflow-y-auto max-h-[60vh] sm:max-h-none custom-scrollbar z-10">
          <Input
            label="Module Title"
            placeholder="e.g. Advanced Calculus II"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isOwner}
          />

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 min-w-[180px]">
              <Input
                label="Module Code"
                placeholder="e.g. MAT400"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!isOwner}
              />
            </div>
            <div
              className="flex-1 min-w-[180px] z-20"
              onClick={() => setIsDegreeDropdownOpen(false)}
            >
              <Select
                label="Semester"
                placeholder="Select..."
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!isOwner}
                options={semesters.map((sem) => ({
                  label: sem.name,
                  value: sem.name,
                }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full relative">
            <div className="flex justify-between items-end w-full">
              <label className="text-white text-body-small-bold">
                Degree Visibility
              </label>
              <span className="text-gray-400 text-body-extra-small">
                Visible to {selectedDegrees.length}{" "}
                {selectedDegrees.length === 1 ? "degree" : "degrees"}
              </span>
            </div>

            <div className="w-full flex flex-col items-start bg-white/5 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/20 p-2 gap-2 relative">
              <div className="flex flex-wrap gap-2 w-full">
                {selectedDegrees.map((degree) => {
                  const isPrimary = degree === primaryDegree;
                  return (
                    <div
                      key={degree}
                      className={`px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] flex items-center gap-1 transition-colors group ${
                        isPrimary
                          ? "bg-primary-blue/20 outline-primary-blue/20"
                          : "bg-primary-blue/20 outline-primary-blue/20"
                      }`}
                    >
                      {isPrimary && (
                        <Lock size={12} className="text-gray-400" />
                      )}
                      <span className={`text-body-extra-small text-white`}>
                        {degree} {isPrimary && "(Current)"}
                      </span>
                      {isOwner && !isPrimary && (
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveDegree(degree)}
                          className="!p-0 !min-w-0 !h-auto !w-auto text-white opacity-80 group-hover:opacity-100 hover:!text-red-400 hover:!bg-transparent transition-colors flex items-center justify-center ml-0.5"
                        >
                          <X size={12} strokeWidth={2.5} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {isOwner && unselectedDegrees.length > 0 && (
                <div className="w-full relative">
                  <div
                    className="w-full pt-2 mt-1 border-t border-white/5 flex justify-between items-center cursor-pointer group px-1"
                    onClick={() =>
                      setIsDegreeDropdownOpen(!isDegreeDropdownOpen)
                    }
                  >
                    <span className="text-gray-400 text-body-extra-small group-hover:text-white transition-colors">
                      + Add visibility for another degree...
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 group-hover:text-white transition-transform ${isDegreeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isDegreeDropdownOpen && (
                    <div className="absolute top-[100%] left-0 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-[101] animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col py-2">
                        {unselectedDegrees.map((deg) => (
                          <Button
                            key={deg}
                            variant="ghost"
                            onClick={() => handleAddDegree(deg)}
                            className="!w-full !px-4 !py-2 !h-auto !justify-start !text-left text-sm text-gray-300 hover:!bg-white/10 hover:!text-white transition-colors !rounded-none"
                          >
                            {deg}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-body-extra-small">
              By default, modules are visible only to the primary degree
              associated with your batch.
            </p>
          </div>

          {/* Delete Module Section */}
          <div className="w-full pt-3 border-t border-gray-700 flex flex-col gap-1.5 mt-1">
            <Button
              variant="dangerOutline"
              fullWidth
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
              className="!border-red-400 text-red-400 flex justify-center items-center gap-1.5 hover:bg-red-400/10 transition-colors group !h-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-red-400 group-hover:text-red-300" />
                  <span className="text-red-400 text-body-small-bold group-hover:text-red-300">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2
                    size={14}
                    className="text-red-400 group-hover:text-red-300"
                  />
                  <span className="text-red-400 text-body-small-bold group-hover:text-red-300">
                    {isOwner ? "Delete Module" : "Remove Module Integration"}
                  </span>
                </>
              )}
            </Button>
            <p className="text-center text-zinc-400 text-[10px] sm:text-body-extra-small leading-tight">
              {isOwner
                ? "This action will permanently remove the module and its associated folder structure."
                : "This action will unlink the module from your degree. Original owner's structure remains intact."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-700 flex justify-end items-center gap-3 mt-auto rounded-b-3xl shrink-0 z-20">
          <Button
            variant="ghost-hoverless"
            onClick={onClose}
            disabled={isSaving || isDeleting}
            className="w-20 h-10 bg-gray-800 rounded-xl flex justify-center items-center text-neutral-100 text-body-small-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          {isOwner && (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!title || !code || !semester || isSaving || isDeleting}
              className="w-auto px-4 h-10 rounded-xl shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] flex justify-center items-center gap-1.5 text-white text-body-small-bold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap overflow-visible"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white shrink-0" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="text-white shrink-0" />
                  <span>Save Module</span>
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditModuleModal;
