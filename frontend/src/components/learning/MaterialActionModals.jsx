import React, { useState, useEffect } from "react";
import { X, PenTool, AlertTriangle, Loader2 } from "lucide-react";
import Card from "../common/Card";
import { ChevronDownIcon } from "../common/Icons";

export const EditMaterialModal = ({ isOpen, onClose, file, categories = [], onSave }) => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file) {
      setTitle(file.name || "");
      setCategoryId(file.categoryId || categories[0]?.id || "");
    }
  }, [file, categories]);

  if (!isOpen || !file) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ ...file, name: title, categoryId });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark-1/80 backdrop-blur-md transition-all duration-300">
      <Card
        variant="card"
        padding="p-0"
        className="w-[512px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-700/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-7 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-white text-xl font-bold font-inter leading-5">Edit Material Details</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-bold font-inter leading-5">File Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-4 bg-blue-500/10 rounded-2xl outline outline-1 outline-white/10 text-white text-sm font-normal font-inter focus:outline-blue-500 transition-all shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm font-bold font-inter leading-5">Category</label>
            <div className="w-full relative">
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-4 appearance-none bg-blue-500/10 rounded-2xl outline outline-1 outline-white/10 text-white text-sm font-normal font-inter focus:outline-blue-500 transition-all cursor-pointer shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]"
              >
                <option value="" disabled className="bg-slate-800">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-800">{cat.title}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon className="text-gray-400" strokeWidth="2" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50 flex justify-end items-center gap-3">
          <button 
            onClick={onClose} 
            disabled={isSaving}
            className="w-24 h-9 bg-gray-800 hover:bg-gray-700 rounded-2xl flex justify-center items-center text-neutral-100 text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 h-9 bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(43,140,238,0.25)] flex justify-center items-center text-white text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Update Details"
            )}
          </button>
        </div>
      </Card>
    </div>
  );
};

export const DeleteMaterialModal = ({ isOpen, onClose, file, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !file) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(file);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark-1/80 backdrop-blur-md transition-all duration-300">
      <Card
        variant="card"
        padding="p-0"
        className="w-96 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex flex-col items-center w-full">
          {/* Icon */}
          <div className="w-16 h-16 mb-6 bg-red-500/10 rounded-full outline outline-1 outline-red-500/20 flex justify-center items-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          {/* Title */}
          <h2 className="text-white text-xl font-bold font-inter leading-5 mb-4 text-center">
            Delete this material?
          </h2>

          {/* Warning text */}
          <div className="text-center mb-8">
            <span className="text-slate-400 text-sm font-normal font-inter leading-5">Are you sure you want to permanently remove this file?<br/></span>
            <span className="text-slate-400 text-sm font-bold font-inter leading-5">This action cannot be undone.</span>
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-center gap-3">
            <button 
              onClick={onClose} 
              disabled={isDeleting}
              className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl outline outline-1 outline-blue-500/20 flex justify-center items-center text-neutral-100 text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="flex-1 h-12 bg-red-500 hover:bg-red-600 rounded-2xl flex justify-center items-center text-white text-sm font-bold font-inter leading-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Material"
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
