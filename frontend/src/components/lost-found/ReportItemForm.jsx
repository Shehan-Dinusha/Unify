import React, { useState, useRef } from "react";
import { Upload, Lightbulb } from "lucide-react";

const ReportItemForm = ({ type = "lost", onBack }) => {
  const isLost = type === "lost";
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - imagePreviews.length;
    const allowedFiles = files.slice(0, remainingSlots);

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) => {
          if (prev.length >= 5) return prev;
          return [...prev, ev.target.result];
        });
      reader.readAsDataURL(file);
    });
    // reset so the same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-heading-small sm:text-heading-medium text-text-primary font-bold">
          {isLost ? "Report a Lost Item" : "Report a Found Item"}
        </h1>
        <p className="text-body-small text-text-secondary mt-1 max-w-2xl">
          {isLost
            ? "Lost Something? Let's find it. Provide as many details as possible to help the Unify community spot your item around University."
            : "Found Something? Help someone find their belongings by providing as many details as possible."}
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5">
        {/* Left — Image Upload + Tip */}
        <div className="flex flex-col gap-5">
          {/* ── No images yet — large upload area ── */}
          {imagePreviews.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 w-full h-44 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 hover:border-primary-blue/40 hover:bg-white/[0.07] transition-all cursor-pointer"
            >
              <Upload size={28} className="text-primary-blue" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-body-small-bold text-primary-blue">
                  Click to upload image
                </span>
              </div>
              <span className="text-[11px] text-text-tertiary">
                PNG, JPG up to 10MB per file (Max 5)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {/* ── Has images — compact row: add-btn + thumbnails ── */}
          {imagePreviews.length > 0 && (
            <div className="flex items-start gap-3 flex-wrap">
              {/* Dashed "+ Add" square */}
              {imagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[88px] h-[88px] shrink-0 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-primary-blue/50 hover:bg-white/[0.08] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="text-2xl leading-none text-text-tertiary">+</span>
                  <span className="text-body-extra-small text-text-tertiary">
                    {5 - imagePreviews.length} left
                  </span>
                </button>
              )}

              {/* Thumbnails */}
              {imagePreviews.map((src, i) => (
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

              {/* Hidden file input (shared) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {/* Tip Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-primary">
              <Lightbulb size={16} className="text-state-warning" />
              <span className="text-body-small-bold">Tip for better results</span>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Upload a clear photo of the item if you have one. If not, try to
              find a similar image online to help others identify it.
            </p>
          </div>
        </div>

        {/* Right — Item Details Form */}
        <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 sm:p-6 flex flex-col gap-5">
          <h2 className="text-body-large-bold text-text-primary">
            Item Details
          </h2>

          {/* What did you... */}
          <div className="flex flex-col gap-1.5">
            <label className="text-body-small-bold text-text-primary">
              {isLost ? "What did you lose" : "What did you find?"}
            </label>
            <input
              type="text"
              placeholder="e.g. Student Id"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-blue/50 transition-colors"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-body-small-bold text-text-primary">
                {isLost ? "Date Lost" : "Date Found"}
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-body-small-bold text-text-primary">
                {isLost ? "Time Lost" : "Time Found"}
              </label>
              <div className="relative">
                <input
                  type="time"
                  placeholder="e.g. 10:30 AM"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-body-small text-text-primary outline-none focus:border-primary-blue/50 transition-colors appearance-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-body-small-bold text-text-primary">
              Description
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-blue/50 transition-colors resize-none"
            />
            <span className="text-[11px] text-text-tertiary text-right">
              ({description.length}/500 characters)
            </span>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-body-small-bold text-text-primary">
              {isLost ? "Last known location" : "Found location"}
            </label>
            <input
              type="text"
              placeholder="e.g. Library, 1st Floor"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-body-small text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary-blue/50 transition-colors"
            />
          </div>

          {/* Upload Post */}
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-blue to-[#60A5FA] hover:brightness-110 text-white text-body-medium-bold transition-all active:scale-[0.99] mt-2">
            Upload Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportItemForm;
