import React, { useState } from "react";
import { MapPin } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { mockLostAndFoundItems } from "../data/mockData";

/* ─── Item card ──────────────────────────────────────────────── */
const ItemCard = ({ item }) => (
  <div className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200 cursor-pointer">
    {/* Image */}
    <div className="relative w-full h-48 bg-white/5 overflow-hidden">
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
    <div className="p-4 flex flex-col gap-1.5">
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

/* ─── Page ───────────────────────────────────────────────────── */
const LostAndFound = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const user = { name: "Alex Johnson", role: "student" };

  const filteredItems =
    activeFilter === "All"
      ? mockLostAndFoundItems
      : activeFilter === "Lost Items"
        ? mockLostAndFoundItems.filter((i) => i.type === "lost")
        : mockLostAndFoundItems.filter((i) => i.type === "found");

  /* Create Post button passed into header */
  const headerRight = (
    <button className="bg-primary-blue hover:brightness-110 text-white text-body-small-bold px-5 py-2 rounded-full transition-all active:scale-95">
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
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </MainLayout>
  );
};

export default LostAndFound;
