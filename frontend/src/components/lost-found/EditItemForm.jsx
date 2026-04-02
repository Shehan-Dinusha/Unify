import React, { useState, useRef } from "react";
import { Camera, Trash2 } from "lucide-react";

const EditItemForm = ({ item, onSave, onCancel, onDelete }) => {
  // Local state initialized with item data
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");
  const [date, setDate] = useState(""); // If we had a specific date in mock data, we'd parse it here
  const [time, setTime] = useState(""); 
  const [location, setLocation] = useState(item.location || "");
  const [status, setStatus] = useState("Active"); // 'Active' or 'Resolved'
  
  // Image editing state
  const [imagePreview, setImagePreview] = useState(item.image);
  const fileInputRef = useRef(null);

  const isLost = item.type === "lost";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
    // reset input so the same file could be selected again if needed
    e.target.value = "";
  };

  const handleSave = () => {
    // In a real app, we'd pass back the updated object
    onSave({
      ...item,
      title,
      description,
      location,
      status, // e.g., to notify parent if it should be moved to 'Resolved'
      image: imagePreview
    });
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
            <h2 className="text-body-large-bold text-text-primary">Item Photo</h2>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
              <img
                src={imagePreview}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-body-small-bold text-text-primary hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={16} />
                Change
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                onClick={() => setImagePreview("")}
                className="w-[42px] h-[42px] shrink-0 rounded-xl border border-state-error/30 text-state-error hover:bg-state-error/10 flex items-center justify-center transition-colors"
                title="Remove photo"
              >
                <Trash2 size={16} />
              </button>
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
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V8H15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditItemForm;
