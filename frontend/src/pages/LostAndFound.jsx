import React, { useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Upload,
  Clock,
  Calendar,
  Lightbulb,
  ArrowLeft,
  Bookmark,
  Flag,
  FileText,
  CheckCircle,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { mockLostAndFoundItems } from "../data/mockData";
import CreatePostModal from "../components/lost-found/CreatePostModal";
import ReportItemForm from "../components/lost-found/ReportItemForm";

/* ─── Item card ──────────────────────────────────────────────── */
const ItemCard = ({ item, onSelect }) => (
  <div
    onClick={() => onSelect?.(item.id)}
    className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200 cursor-pointer"
  >
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

/* ─── Item Detail View ───────────────────────────────────────── */
const ItemDetailView = ({ item, onBack }) => {
  const isLost = item.type === "lost";

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto px-2 sm:px-0">
      {/* Spacer */}
      <div className="h-0" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-5">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-white/5">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[280px] sm:h-[340px] object-cover"
            />
            {/* Badge */}
            <span
              className={`absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                isLost
                  ? "bg-state-error text-white"
                  : "bg-state-success text-white"
              }`}
            >
              <CheckCircle size={13} />
              {item.type}
            </span>
          </div>

          {/* Full Description */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-primary">
              <FileText size={16} className="text-primary-blue" />
              <span className="text-body-medium-bold">Full Description</span>
            </div>
            <p className="text-body-small text-text-secondary leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col gap-5">
          {/* Item Info Card */}
          <div className="rounded-2xl border border-white/10 bg-dark-2 p-5 sm:p-6 flex flex-col gap-4">
            {/* Title + Actions */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-heading-small text-text-primary">
                  {item.title}
                </h1>
                <span className="text-body-extra-small text-text-tertiary">
                  Post ID: {item.postId}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <button className="text-text-tertiary hover:text-text-primary transition-colors">
                  <Bookmark size={18} />
                </button>
                <button className="text-text-tertiary hover:text-state-error transition-colors">
                  <Flag size={18} />
                </button>
              </div>
            </div>

            {/* Meta rows */}
            <div className="flex flex-col gap-3">
              {/* Date */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  {isLost ? "Date Lost" : "Date Found"}
                </span>
                <div className="flex items-center gap-2 text-text-primary">
                  <Calendar size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.date}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Time
                </span>
                <div className="flex items-center gap-2 text-text-primary">
                  <Clock size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.timeOfDay}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Location
                </span>
                <div className="flex items-center gap-2 text-text-primary">
                  <MapPin size={14} className="text-primary-blue" />
                  <span className="text-body-small">{item.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posted By Card */}
          <div className="mt-auto rounded-2xl border border-white/10 bg-dark-2 p-3.5 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              {isLost ? "Lost By" : "Found By"}
            </span>
            <div className="flex items-center gap-3">
              <img
                src={item.postedBy.avatar}
                alt={item.postedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-body-small-bold text-text-primary">
                  {item.postedBy.name}
                </span>
                <span className="text-body-extra-small text-text-tertiary">
                  {item.postedBy.department}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-3.5 rounded-xl text-white text-body-medium-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-primary-blue hover:brightness-110">
            <CheckCircle size={18} />
            {isLost ? "I Found This" : "Claim This Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Filter tabs ────────────────────────────────────────────── */
const FILTERS = ["All", "Lost Items", "Found Items"];

/* ─── Page ───────────────────────────────────────────────────── */
const LostAndFound = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Sync view state with URL search params so the browser back button works
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  const setView = useCallback(
    (newView) => {
      if (newView === "list") {
        // Going back to list — remove the param entirely
        setSearchParams({}, { replace: false });
      } else {
        setSearchParams({ view: newView }, { replace: false });
      }
    },
    [setSearchParams]
  );

  const user = { name: "Alex Johnson", role: "student" };

  const filteredItems =
    activeFilter === "All"
      ? mockLostAndFoundItems
      : activeFilter === "Lost Items"
        ? mockLostAndFoundItems.filter((i) => i.type === "lost")
        : mockLostAndFoundItems.filter((i) => i.type === "found");

  /* Create Post button — only visible on the list view */
  const headerRight = view === "list" ? (
    <button
      onClick={() => setView("modal")}
      className="bg-primary-blue hover:brightness-110 text-white text-body-small-bold px-5 py-2 rounded-full transition-all active:scale-95"
    >
      Create Post
    </button>
  ) : null;

  return (
    <MainLayout
      user={user}
      pageTitle="Lost & Found"
      verificationCount={0}
      headerRight={headerRight}
    >
      {view === "detail" ? (
        (() => {
          const selectedId = Number(searchParams.get("id"));
          const selectedItem = mockLostAndFoundItems.find(
            (i) => i.id === selectedId
          );
          return selectedItem ? (
            <ItemDetailView
              item={selectedItem}
              onBack={() => setView("list")}
            />
          ) : (
            <div className="text-center text-text-secondary py-10">
              Item not found.{" "}
              <button
                onClick={() => setView("list")}
                className="text-primary-blue hover:underline"
              >
                Go back
              </button>
            </div>
          );
        })()
      ) : view === "lostForm" || view === "foundForm" ? (
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
              <ItemCard
                key={item.id}
                item={item}
                onSelect={(id) =>
                  setSearchParams(
                    { view: "detail", id: String(id) },
                    { replace: false }
                  )
                }
              />  
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
