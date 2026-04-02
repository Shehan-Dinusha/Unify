import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import { X, Lock, Save, ChevronDown } from "lucide-react";

const availableDegrees = [
  "BSc Data Science",
  "BSc Artificial Intelligence",
  "BSc Software Engineering",
  "BSc Computer Systems",
  "BSc Information Systems",
  "BSc Cyber Security",
];

const primaryDegree = "Bsc.(Hons) IT";

const AddModuleModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [semester, setSemester] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedDegrees, setSelectedDegrees] = useState([primaryDegree]);
  const [isDegreeDropdownOpen, setIsDegreeDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setCode("");
      setSemester("");
      setSelectedDegrees([primaryDegree]);
      setIsDegreeDropdownOpen(false);
    }
  }, [isOpen]);

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

  const handleSave = () => {
    // Basic validation
    if (!title || !code || !semester) return;

    onSave({
      title,
      code,
      semester,
      visibility: selectedDegrees,
    });
  };

  const unselectedDegrees = availableDegrees.filter(
    (d) => !selectedDegrees.includes(d),
  );

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-1/80 backdrop-blur-md transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[670px] !p-0 flex flex-col relative overflow-visible outline outline-1 outline-offset-[-1px] outline-white/20 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] animate-in fade-in zoom-in duration-200 bg-white/10"
      >
        {/* Header */}
        <div className="px-4 sm:px-8 pt-8 pb-4 relative flex flex-col items-start gap-1">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
          <h2 className="text-white text-2xl font-bold font-inter leading-8">
            Create New Module
          </h2>
          <p className="text-gray-400 text-sm font-normal font-inter leading-5">
            Add details for a new academic module.
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 py-4 flex flex-col gap-6 w-full max-h-[60vh] sm:max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <Input
            label="Module Title"
            placeholder="e.g. Advanced Calculus II"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-5 w-full">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Module Code"
                placeholder="e.g. MAT400"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[200px] z-20">
              <Select
                label="Semester Assignment"
                placeholder="Select Semester..."
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                options={[
                  { label: "Semester 1", value: "sem1" },
                  { label: "Semester 2", value: "sem2" },
                  { label: "Semester 3", value: "sem3" },
                  { label: "Semester 4", value: "sem4" },
                  { label: "Semester 5", value: "sem5" },
                  { label: "Semester 6", value: "sem6" },
                  { label: "Semester 7", value: "sem7" },
                  { label: "Semester 8", value: "sem8" },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full relative">
            <div className="flex justify-between items-end w-full">
              <label className="text-white text-sm font-bold font-inter leading-5">
                Degree Visibility
              </label>
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                Visible to {selectedDegrees.length}{" "}
                {selectedDegrees.length === 1 ? "degree" : "degrees"}
              </span>
            </div>

            <div className="w-full flex flex-col items-start bg-white/5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/20 p-3 gap-2 relative">
              <div className="flex flex-wrap gap-2 w-full">
                {selectedDegrees.map((degree) => {
                  const isPrimary = degree === primaryDegree;
                  return (
                    <div
                      key={degree}
                      className={`px-3 py-1.5 rounded-full outline outline-1 outline-offset-[-1px] flex items-center gap-1.5 transition-colors group ${
                        isPrimary
                          ? "bg-primary-blue/20 outline-primary-blue/20"
                          : "bg-primary-blue/20 outline-primary-blue/20"
                      }`}
                    >
                      {isPrimary && (
                        <Lock size={14} className="text-gray-400" />
                      )}
                      <span
                        className={`text-sm font-medium font-inter leading-5 ${
                          isPrimary ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {degree} {isPrimary && "(Primary)"}
                      </span>
                      {!isPrimary && (
                        <button
                          onClick={() => handleRemoveDegree(degree)}
                          className="text-white opacity-80 group-hover:opacity-100 hover:text-red-400 transition-colors flex items-center justify-center ml-1"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {unselectedDegrees.length > 0 && (
                <div className="w-full relative">
                  <div
                    className="w-full pt-3 mt-1 border-t border-white/5 flex justify-between items-center cursor-pointer group px-1"
                    onClick={() =>
                      setIsDegreeDropdownOpen(!isDegreeDropdownOpen)
                    }
                  >
                    <span className="text-gray-400 text-sm font-normal font-inter leading-5 group-hover:text-white transition-colors">
                      + Add visibility for another degree...
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 group-hover:text-white transition-transform ${isDegreeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isDegreeDropdownOpen && (
                    <div className="absolute top-[100%] left-0 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-[101] animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col py-2">
                        {unselectedDegrees.map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => handleAddDegree(deg)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {deg}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-xs font-normal font-inter leading-5">
              By default, modules are visible only to the primary degree
              associated with your batch.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-6 border-t border-slate-700 flex justify-end items-center gap-4 mt-auto rounded-b-3xl">
          <Button
            variant="ghost-hoverless"
            onClick={onClose}
            className="w-24 h-12 bg-gray-800 rounded-2xl flex justify-center items-center text-neutral-100 text-base font-bold font-inter leading-5 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title || !code || !semester}
            className="w-44 h-12 rounded-2xl shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] flex justify-center items-center gap-2 text-white text-base font-bold font-inter leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} className="text-white" />
            Save Module
          </Button>
        </div>
      </Card>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddModuleModal;
