import React, { useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { ChevronDownIcon, SaveIcon } from "../common/Icons";
import { editItem } from "../../services/lostAndFoundService";

const parseTimeForInput = (timeStr) => {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  try {
    const parts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (parts) {
      let hours = parseInt(parts[1], 10);
      const mins = parts[2];
      const ampm = parts[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${mins}`;
    }
  } catch(e) {
    // intentionally empty
  }
  return timeStr;
};

const EditItemForm = ({ item, onSave, onCancel, onDelete }) => {
  // Local state initialized with item data
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");
  const [date, setDate] = useState(item.date || ""); 
  const [time, setTime] = useState(parseTimeForInput(item.timeOfDay)); 
  const [location, setLocation] = useState(item.location || "");
  const [status, setStatus] = useState(item.status || "Active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image editing state
  const [existingImages, setExistingImages] = useState(item.images || []);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  const totalImages = existingImages.length + newImagePreviews.length;

  const isLost = item.type === "lost";

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = 5 - totalImages;
    const allowedFiles = selectedFiles.slice(0, remainingSlots);

    setNewFiles((prev) => [...prev, ...allowedFiles]);

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
    // reset input so the same file could be selected again if needed
    e.target.value = "";
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingImages.length;
      setNewImagePreviews((prev) => prev.filter((_, i) => i !== newIdx));
      setNewFiles((prev) => prev.filter((_, i) => i !== newIdx));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("status", status);
      if (date) formData.append("date", date);
      if (time) {
        try {
          const formattedTime = new Date(`1970-01-01T${time}`)
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          formData.append("timeOfDay", formattedTime);
        } catch (e) {
          formData.append("timeOfDay", time);
        }
      }

      existingImages.forEach(url => {
        formData.append("existingImages", url);
      });

      newFiles.forEach(file => {
        formData.append("images", file);
      });

      const updatedData = await editItem(item.id, formData);
      onSave(updatedData); // Pass updated API model back to UI
    } catch (error) {
      alert("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-heading-small sm:text-heading-medium text-text-primary font-bold">
          Edit {isLost ? "Lost" : "Found"} Item Post: {item.title}
        </h1>
        <p className="text-body-small text-text-secondary mt-1 max-w-2xl">
          Update the details for the item you {isLost ? "lost" : "found"} on {item.time || "recently"}
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-5">
        
        {/* Left Column — Photo & Status */}
        <div className="flex flex-col gap-5">
          {/* Card: Item Photo */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 flex flex-col gap-4">
            <h2 className="text-body-large-bold text-text-primary">Item Photos (Max 5)</h2>
            <div className="flex items-start gap-3 flex-wrap">
              {/* Dashed "+ Add" square */}
              {totalImages < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[88px] h-[88px] shrink-0 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-primary-blue/50 hover:bg-white/[0.08] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="text-2xl leading-none text-text-tertiary">+</span>
                  <span className="text-body-extra-small text-text-tertiary">
                    {5 - totalImages} left
                  </span>
                </button>
              )}

              {/* Thumbnails */}
              {[...existingImages, ...newImagePreviews].map((src, i) => (
                <div
                  key={i}
                  className="relative w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-dark-1/70 backdrop-blur-sm text-text-primary text-[11px] flex items-center justify-center hover:bg-state-error/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Card: Current Status */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 flex flex-col gap-4">
            <h2 className="text-body-large-bold text-text-primary">Current Status</h2>
            <div className="relative w-full">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="Active" className="bg-dark-2 text-text-primary">
                  Active ({isLost ? "Searching for item" : "Searching for owner"})
                </option>
                <option value="Resolved" className="bg-dark-2 text-text-primary">
                  Resolved
                </option>
              </select>
              {/* Custom simple chevron */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Details Container */}
        <div className="flex flex-col gap-5">
          {/* Details Card */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 sm:p-6 flex flex-col gap-5">
            <h2 className="text-body-large-bold text-text-primary">Details</h2>

            {/* Item Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-body-small text-text-secondary">Item Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-1/50 border border-white/5 rounded-xl px-4 py-3 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-blue/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-body-small text-text-secondary">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-dark-1/50 border border-white/5 rounded-xl px-4 py-3 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-blue/50 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-body-small text-text-secondary">
                  {isLost ? "Date Lost" : "Date Found"}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-dark-1/50 border border-white/5 rounded-xl px-4 py-3 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-body-small text-text-secondary">
                  {isLost ? "Time Lost" : "Time Found"}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-dark-1/50 border border-white/5 rounded-xl px-4 py-3 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-body-small text-text-secondary">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-dark-1/50 border border-white/5 rounded-xl px-4 py-3 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors"
              />
            </div>
          </div>

          {/* Action Bar (Bottom of right column) */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Delete Post (Left) */}
            <button
              onClick={onDelete}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-state-error text-state-error hover:bg-state-error/10 text-body-small-bold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Post
            </button>

            {/* Cancel & Save (Right) */}
            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-white/10 text-body-small text-text-primary hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white text-body-small-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-primary-blue hover:brightness-110"
                }`}
              >
                <SaveIcon />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditItemForm;
