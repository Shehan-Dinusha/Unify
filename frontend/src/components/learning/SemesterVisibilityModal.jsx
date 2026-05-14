import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "../common/Button";
import Card from "../common/Card";
import { Eye, Check } from "lucide-react";

const SemesterVisibilityModal = ({
  isOpen,
  onClose,
  semesterName,
  availableBatches = [],
  currentVisibility = [],
  onSaveVisibility,
}) => {
  const [mounted, setMounted] = useState(false);
  const [batches, setBatches] = useState([]);
  const [notifyStudents, setNotifyStudents] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize visibility state based on props from backend
  useEffect(() => {
    if (isOpen) {
      // Create a local state combining the available batches with their current visibility status.
      // Default visibility is FALSE (not visible) unless explicitly provided in currentVisibility.
      const initializedBatches = availableBatches.map((batch) => ({
        ...batch,
        visible: currentVisibility.includes(batch.id),
      }));
      setBatches(initializedBatches);
      setNotifyStudents(false);
    }
  }, [isOpen, availableBatches, currentVisibility]);

  if (!isOpen || !mounted) return null;

  const toggleBatch = (id) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)),
    );
  };

  const handleSave = () => {
    // Extract only the IDs of batches that are set to visible
    const visibleBatchIds = batches.filter((b) => b.visible).map((b) => b.id);

    // Pass back the updated visibility arrays and notify preference to backend handler
    if (onSaveVisibility) {
      onSaveVisibility({
        visibleBatchIds,
        notifyStudents,
      });
    }
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-1/80 backdrop-blur-md transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[510px] max-h-[95vh] sm:max-h-none !p-0 flex flex-col relative overflow-hidden sm:overflow-visible outline outline-1 outline-offset-[-1px] outline-white/20 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] animate-in fade-in zoom-in duration-200 bg-white/10"
      >
        <div className="px-4 sm:px-6 pt-6 pb-4 relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full flex-1 min-h-0">
          <div className="w-10 h-10 bg-blue-900/30 rounded-full flex justify-center items-center shrink-0">
            <Eye size={20} className="text-blue-500" />
          </div>
          
          <div className="flex-1 flex flex-col w-full min-h-0 min-w-0">
            <h2 className="text-white text-xl font-bold font-inter leading-5 mb-2 shrink-0">
              Semester Visibility Settings
            </h2>
            <p className="text-gray-400 text-sm font-normal font-inter leading-5 mb-4 shrink-0">
              Control which batches can access content for{" "}
              {semesterName || "this semester"}.<br className="hidden sm:block" />
              Toggling off will hide this folder from that batch's view
              <br className="hidden sm:block" />
              immediately.
            </p>

            {/* Batches config */}
            <div className="w-full flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2 mb-2 sm:max-h-[40vh] min-h-[100px]">
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-3 bg-gray-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-700 flex justify-between items-center text-left shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex justify-center items-center ${batch.colorBg || "bg-gray-700"}`}
                      >
                        <span
                          className={`text-xs font-bold font-inter ${batch.colorText || "text-gray-300"}`}
                        >
                          {batch.short}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-normal font-inter leading-5">
                          {batch.name}
                        </span>
                      </div>
                    </div>

                    {/* Toggle button using standard tailwind classes */}
                    <button
                      type="button"
                      onClick={() => toggleBatch(batch.id)}
                      className={`w-11 h-6 rounded-full outline outline-2 outline-offset-[-2px] outline-transparent flex items-center transition-colors px-[2px] shrink-0 cursor-pointer ${
                        batch.visible ? "bg-primary-blue" : "bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          batch.visible ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm font-inter">
                  No batches available for this program.
                </div>
              )}
            </div>

            {/* Notify Students checkbox */}
            <div
              className="w-full relative border-t border-primary-blue/20 pt-4 flex gap-2 items-start cursor-pointer group shrink-0"
              onClick={() => setNotifyStudents(!notifyStudents)}
            >
              <div className="h-5 flex items-center justify-center shrink-0 pt-0.5">
                <div
                  className={`w-4 h-4 rounded outline outline-1 outline-offset-[-1px] flex items-center justify-center transition-colors ${notifyStudents ? "bg-slate-700 outline-gray-600" : "bg-slate-700 outline-gray-600 group-hover:bg-slate-600"}`}
                >
                  {notifyStudents && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-bold font-inter leading-5 transition-colors group-hover:text-white">
                  Notify Students
                </span>
                <span className="text-gray-400 text-xs font-normal font-inter leading-5 transition-colors group-hover:text-gray-300">
                  Sends a notification to all students enrolled in the affected
                  batches.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full px-4 sm:px-6 py-3 border-t border-primary-blue/20 flex justify-end items-center gap-3 rounded-b-3xl shrink-0">
          <Button
            variant="ghost-hoverless"
            onClick={onClose}
            className="w-auto px-4 h-9 bg-gray-800 rounded-2xl flex justify-center items-center text-neutral-100 text-sm font-bold font-inter leading-5 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="w-auto px-5 h-9 rounded-2xl whitespace-nowrap shadow-[0px_4px_6px_-4px_rgba(43,140,238,0.25)] flex justify-center items-center text-white text-sm font-bold font-inter leading-5"
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default SemesterVisibilityModal;
