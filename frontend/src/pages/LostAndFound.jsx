import React, { useState, useRef } from "react";
import { MapPin, Upload, Clock, Calendar, Lightbulb } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { mockLostAndFoundItems } from "../data/mockData";

/* ─── Item card ──────────────────────────────────────────────── */
const ItemCard = ({ item }) => (
  <div className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200 cursor-pointer">
    {/* Image */}
    <div className="relative w-full h-40 sm:h-48 bg-white/5 overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Badge */}
      <span
        className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
          item.type === "lost"
            ? "bg-state-error text-white"
            : "bg-state-success text-white"
        }`}
      >
        {item.type}
      </span>
    </div>

    {/* Info */}
    <div className="p-3 sm:p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-text-tertiary">
        <MapPin size={13} />
        <span className="text-[12px]">{item.location}</span>
      </div>
      <h3 className="text-body-medium-bold text-text-primary leading-snug">
        {item.title}
      </h3>
      <span className="text-[12px] text-text-tertiary">{item.time}</span>
    </div>
  </div>
);

/* ─── Filter tabs ────────────────────────────────────────────── */
const FILTERS = ["All", "Lost Items", "Found Items"];

/* ─── Create Post Modal ─────────────────────────────────────── */
const CreatePostModal = ({ onClose, onCreateLost, onCreateFound }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    {/* Blurred backdrop */}
    <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" />

    {/* Modal card */}
    <div
      className="relative w-full max-w-3xl bg-dark-2 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-custom-shadow animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-heading-small sm:text-heading-medium text-text-primary mb-2">
          Create New Post
        </h2>
        <p className="text-body-small text-text-secondary">
          Select the type of content you want to share.
        </p>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Lost Item */}
        <div className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary-blue/40 transition-colors text-center">
          <h3 className="text-body-large-bold text-text-primary">Lost Item</h3>
          <p className="text-body-small text-text-secondary leading-relaxed flex-1">
            Report an item you've lost. Provide detailed information such as
            location, date, and distinguishing features to help others identify
            and return it quickly.
          </p>
          <button
            onClick={onCreateLost}
            className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
          >
            Create Lost Item Post
          </button>
        </div>

        {/* Found Item */}
        <div className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary-blue/40 transition-colors text-center">
          <h3 className="text-body-large-bold text-text-primary">Found Item</h3>
          <p className="text-body-small text-text-secondary leading-relaxed flex-1">
            Lost something important? Create a post with clear details about
            when and where it was last seen, along with any identifying
            features, to increase the chances of recovery.
          </p>
          <button
            onClick={onCreateFound}
            className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
          >
            Create Found Item Post
          </button>
        </div>
      </div>

      {/* Cancel */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl border border-white/10 text-body-small text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

/* ─── Report Item Form ──────────────────────────────────── */
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
          {/* Uploaded Thumbnails */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                  <img
                    src={src}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[11px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          {imagePreviews.length < 5 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 w-full h-44 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 hover:border-primary-blue/40 hover:bg-white/[0.07] transition-all cursor-pointer"
            >
              <Upload size={28} className="text-primary-blue" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-body-small-bold text-primary-blue">
                  {imagePreviews.length > 0 ? "Add more images" : "Click to upload image"}
                </span>
                {imagePreviews.length > 0 && (
                  <span className="text-[11px] text-primary-blue/70">
                    {5 - imagePreviews.length} more allowed
                  </span>
                )}
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

/* ─── Page ───────────────────────────────────────────────────── */
const LostAndFound = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  // "list" | "modal" | "lostForm" | "foundForm"
  const [view, setView] = useState("list");

  const user = { name: "Alex Johnson", role: "student" };

  const filteredItems =
    activeFilter === "All"
      ? mockLostAndFoundItems
      : activeFilter === "Lost Items"
        ? mockLostAndFoundItems.filter((i) => i.type === "lost")
        : mockLostAndFoundItems.filter((i) => i.type === "found");

  /* Create Post button passed into header */
  const headerRight = (
    <button
      onClick={() => setView("modal")}
      className="bg-primary-blue hover:brightness-110 text-white text-body-small-bold px-5 py-2 rounded-full transition-all active:scale-95"
    >
      Create Post
    </button>
  );

  return (
    <MainLayout
      user={user}
      pageTitle="Lost & Found"
      verificationCount={0}
      headerRight={headerRight}
    >
      {view === "lostForm" || view === "foundForm" ? (
        <ReportItemForm
          type={view === "lostForm" ? "lost" : "found"}
          onBack={() => setView("list")}
        />
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-5xl mx-auto px-2 sm:px-0">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-primary-blue text-white"
                    : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {activeFilter === "All" && (
            <button className="mx-auto flex items-center gap-2 text-body-small text-text-secondary hover:text-text-primary transition-colors py-3">
              Load more items
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      {view === "modal" && (
        <CreatePostModal
          onClose={() => setView("list")}
          onCreateLost={() => setView("lostForm")}
          onCreateFound={() => setView("foundForm")}
        />
      )}
    </MainLayout>
  );
};

export default LostAndFound;
