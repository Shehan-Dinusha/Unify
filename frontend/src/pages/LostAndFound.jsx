import React, { useState } from "react";
import { MapPin } from "lucide-react";
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
const CreatePostModal = ({ onClose }) => (
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
          <button className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]">
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
          <button className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]">
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

/* ─── Page ───────────────────────────────────────────────────── */
const LostAndFound = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      onClick={() => setShowCreateModal(true)}
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

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </MainLayout>
  );
};

export default LostAndFound;
