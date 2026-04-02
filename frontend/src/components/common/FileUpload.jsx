import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

const FileUpload = ({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"],
  label = "Verification Documents",
  description = "Acceptable documents include a club registration certificate, an official letter from the faculty advisor, or a university-stamped charter.",
  hideSubtext = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, PNG, or JPG.");
      return false;
    }
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect && onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect && onFileSelect(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect && onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf"))
      return <FileText className="w-8 h-8 text-red-400" />;
    if (type.includes("image"))
      return <ImageIcon className="w-8 h-8 text-blue-400" />;
    return <FileText className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-text-secondary text-xs font-bold uppercase tracking-wider">
          {label}
        </label>
      )}
      {description && (
        <p className="text-text-secondary text-xs mb-2">{description}</p>
      )}

      <div
        className={`
                    relative w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer group
                    ${dragActive ? "border-primary-blue bg-primary-blue/10" : "border-primary-blue/20 bg-gray-800/50 hover:border-primary-blue/40"}
                    ${error ? "border-state-error/50 bg-state-error/10" : ""}
                `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={false}
          onChange={handleChange}
          accept={acceptedTypes.join(",")}
        />

        <div className="h-32 flex flex-col items-center justify-center p-4">
          {selectedFile ? (
            <div className="flex items-center gap-4 w-full max-w-md bg-white/5 p-3 rounded-lg border border-white/10">
              {getFileIcon(selectedFile.type)}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-text-primary text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-text-secondary text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-state-error"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload
                className={`w-10 h-10 mb-3 transition-colors ${dragActive ? "text-primary-blue" : "text-text-secondary group-hover:text-primary-blue"}`}
              />
              <p className="text-primary-blue text-sm font-bold mb-1">
                {dragActive ? "Drop file here" : "Click to upload documents"}
              </p>
              {!hideSubtext && (
                <p className="text-text-tertiary text-xs">
                  PDF, PNG, JPG up to {maxSizeMB}MB
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-state-error text-xs mt-1 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
