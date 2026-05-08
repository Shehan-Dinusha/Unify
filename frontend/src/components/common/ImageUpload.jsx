import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";

/**
 * ImageUpload component that matches the design specs exactly.
 */
const ImageUpload = ({
  value,
  onChange,
  label = "Upload Photo (Optional)",
  className = "",
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  // Sync preview if value prop changes (e.g. after API data loads)
  React.useEffect(() => {
    if (value && !preview) {
      setPreview(value);
    }
  }, [value]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onChange) {
          onChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        onClick={handleClick}
        className="relative w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group cursor-pointer hover:border-primary-blue/50 transition-colors bg-white/5"
      >
        <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera
              size={20}
              className="text-text-tertiary group-hover:text-primary-blue transition-colors"
            />
          )}
        </div>

        {/* Blue overlay icon */}
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-1 z-10">
          <Camera size={10} className="text-white" />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <span className="text-text-tertiary text-body-extra-small">{label}</span>
    </div>
  );
};

export default ImageUpload;
