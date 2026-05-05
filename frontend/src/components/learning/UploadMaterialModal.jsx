import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, FileUp, Link as LinkIcon } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import FileUpload from "../common/FileUpload";
import * as learningService from "../../services/learningService";

/**
 * Modal component for uploading learning material to a module.
 */
const UploadMaterialModal = ({
  isOpen,
  onClose,
  moduleName = "Programming Fundamentals",
  moduleId,
  categories = [],
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [attachmentType, setAttachmentType] = useState("Upload File");
  const [selectedFile, setSelectedFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setCategory(categories.length > 0 ? categories[0].title : "");
      setAttachmentType("Upload File");
      setSelectedFile(null);
      setLinkUrl("");
    }
  }, [isOpen, categories]);

  if (!isOpen || !mounted) return null;

  const handleUpload = async () => {
    // Validate inputs
    if (!title) return;
    if (attachmentType === "Upload File" && !selectedFile) return;
    if (attachmentType === "Attach Link" && !linkUrl) return;

    if (!moduleId) {
      alert("Module ID is missing!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("attachmentType", attachmentType);
      
      if (attachmentType === "Upload File") {
        formData.append("materialFile", selectedFile);
      } else {
        formData.append("linkUrl", linkUrl);
      }

      await learningService.uploadMaterial(moduleId, formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to upload material", err);
      alert("Failed to upload material");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!title) return false;
    if (attachmentType === "Upload File" && !selectedFile) return false;
    if (attachmentType === "Attach Link" && !linkUrl) return false;
    return true;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-1/80 backdrop-blur-md transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[600px] !p-0 flex flex-col relative overflow-visible outline outline-1 outline-offset-[-1px] outline-white/20 shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] animate-in fade-in zoom-in duration-200 bg-white/10"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-white/10 relative flex flex-col items-start gap-1">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-primary-blue/20 flex items-center justify-center text-primary-blue shrink-0">
              <FileUp size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-lg font-bold font-inter leading-6">
                Upload Learning Material
              </h2>
              <div className="flex items-center gap-1 mt-0.5 text-xs font-inter">
                <span className="text-text-tertiary">Add resources to</span>
                <span className="text-white font-medium">{moduleName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-5 flex flex-col gap-5 w-full max-h-[60vh] sm:max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar z-10">
          <Input
            label="Title *"
            placeholder="e.g., Week 5 - Graph Theory Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Category */}
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full justify-start">
              <span className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
                Category *
              </span>
            </div>

            <div className="w-full flex flex-wrap gap-x-6 gap-y-3">
              {categories.map((cat) => (
                <label
                  key={cat.id || cat.title}
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setCategory(cat.title)}
                >
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full border-[1.5px] transition-colors ${
                        category === cat.title
                          ? "border-primary-blue bg-primary-blue/10"
                          : "border-text-tertiary bg-transparent group-hover:border-text-secondary"
                      }`}
                    ></div>
                    {category === cat.title && (
                      <div className="absolute w-2 h-2 bg-primary-blue rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-inter transition-colors ${
                      category === cat.title
                        ? "text-white font-medium"
                        : "text-text-secondary group-hover:text-text-primary"
                    }`}
                  >
                    {cat.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Attachment Type & Upload Area */}
          <div className="w-full flex flex-col justify-start items-start gap-3">
            <div className="w-full flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center gap-2">
              <span className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
                Attachment Type *
              </span>
              <div className="p-1 bg-dark-3 rounded-xl flex items-center gap-1">
                <Button
                  onClick={() => setAttachmentType("Upload File")}
                  variant={
                    attachmentType === "Upload File" ? "secondary" : "ghost"
                  }
                  className={`!h-8 !px-3 !rounded-lg !text-xs !font-medium transition-all ${
                    attachmentType === "Upload File"
                      ? "text-white shadow-sm bg-dark-2"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Upload File
                </Button>
                <Button
                  onClick={() => setAttachmentType("Attach Link")}
                  variant={
                    attachmentType === "Attach Link" ? "secondary" : "ghost"
                  }
                  className={`!h-8 !px-3 !rounded-lg !text-xs !font-medium transition-all ${
                    attachmentType === "Attach Link"
                      ? "text-white shadow-sm bg-dark-2"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Attach Link
                </Button>
              </div>
            </div>

            {attachmentType === "Upload File" ? (
              <div className="w-full">
                <FileUpload
                  label=""
                  description=""
                  maxSizeMB={10}
                  hideSubtext={true}
                  acceptedTypes={[
                    "application/pdf",
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                  ]}
                  onFileSelect={(file) => setSelectedFile(file)}
                />
              </div>
            ) : (
              <div className="w-full">
                <Input
                  label=""
                  type="url"
                  icon={LinkIcon}
                  placeholder="https://example.com/share/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex justify-end items-center gap-3 mt-auto rounded-b-3xl shrink-0 z-20">
          <Button
            variant="ghost-hoverless"
            size="small"
            onClick={onClose}
            className="w-24 bg-dark-3 hover:bg-dark-2 text-white border border-white/10"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleUpload}
            disabled={!isFormValid() || isSubmitting}
            icon={FileUp}
            className="w-auto px-6"
          >
            {isSubmitting ? "Uploading..." : "Upload Material"}
          </Button>
        </div>
      </Card>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default UploadMaterialModal;
