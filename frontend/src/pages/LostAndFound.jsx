import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
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
import { getItems, getItemById, getItemMatches, claimItem } from "../services/lostAndFoundService";
import CreatePostModal from "../components/lost-found/CreatePostModal";
import ReportItemForm from "../components/lost-found/ReportItemForm";
import ContactModal from "../components/lost-found/ContactModal";

/* ─── Item card ──────────────────────────────────────────────── */
const ItemCard = ({ item, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startSlide = () => {
    if (!item.images || item.images.length <= 1) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === item.images.length - 1 ? 0 : prev + 1
      );
    }, 1000);

    setIntervalId(id);
  };

  const stopSlide = () => {
    if (intervalId) clearInterval(intervalId);
    setCurrentIndex(0);
  };

  return (
    <div
      onClick={() => onSelect?.(item.id)}
      className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200 cursor-pointer"
    >
    {/* Image */}
    <div
      className="relative w-full h-40 sm:h-48 bg-dark-1/50 overflow-hidden"
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
    >
    <img
      src={
        item.images && item.images.length > 0
        ? item.images[currentIndex]
        : "https://placehold.co/400x300"
      }
      alt={item.title}
      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-500"
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

};

/* ─── Item Detail View ───────────────────────────────────────── */
const ItemDetailView = ({ item, matches, onBack, onSelectMatch, currentUserId }) => {
  const isLost = item.type === "lost";
  const [activeImage, setActiveImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // Hide the claim button if the viewer is the post owner
  const isOwner = currentUserId && item.ownerId && currentUserId === item.ownerId;

  const handleClaimSubmit = async ({ contactNumber, description }) => {
    await claimItem(item.id, { contactNumber, description });
  };

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
              src={
                item.images && item.images.length > 0
                  ? item.images[activeImage]
                  : "https://placehold.co/800x600"
              }           
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

          {/* Thumbnails */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                    activeImage === index
                      ? "border-primary-blue"
                      : "border-white/10"
                  }`}
                />
              ))}
            </div>
          )}

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

          {/* Matches Section (Only visible to post owner) */}
          {matches && matches.length > 0 && (
            <div className="rounded-2xl border border-primary-blue/30 bg-primary-blue/5 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-text-primary">
                <Lightbulb size={18} className="text-primary-blue" />
                <span className="text-body-medium-bold">Potential  Matches</span>
              </div>
              <p className="text-[12px] text-text-secondary -mt-2">
                Our algorithm found these potential matches based on description, location, and time.
              </p>
              <div className="flex flex-col gap-3">
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    onClick={() => onSelectMatch?.(match.id)}
                    className="bg-dark-3 rounded-xl p-3 border border-white/5 flex gap-3 cursor-pointer hover:border-primary-blue/50 transition-colors"
                  >
                    <img src={match.images?.[0] || "https://placehold.co/100x100"} alt={match.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-body-small-bold text-text-primary line-clamp-1">{match.title}</span>
                        <span className="text-[10px] font-bold text-primary-blue bg-primary-blue/10 px-2 py-0.5 rounded-md shrink-0">
                          {Math.round(match.score * 100)}% Match
                        </span>
                      </div>
                      <span className="text-[11px] text-text-tertiary mt-1 flex items-center gap-1">
                        <MapPin size={10} /> <span className="truncate">{match.location}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                src={
                  !item.postedBy.avatar || item.postedBy.avatar.includes("placehold") || item.postedBy.avatar.includes("dicebear")
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.postedBy.name || "User")}&background=2666F1&color=fff`
                    : item.postedBy.avatar
                }
                alt={item.postedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-body-small-bold text-text-primary">
                  {item.postedBy.name}
                </span>
                <span className="text-body-extra-small text-text-tertiary">
                  {item.postedBy.degree}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button — hidden for post owner */}
          {!isOwner && (
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full py-3.5 rounded-xl text-white text-body-medium-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r from-primary-blue to-[#60A5FA] hover:brightness-110"
            >
              <CheckCircle size={18} />
              {isLost ? "I Found This" : "Claim This Item"}
            </button>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isLost={isLost}
          itemTitle={item.title}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleClaimSubmit}
        />
      )}
    </div>
  );
};

/* ─── Filter tabs ────────────────────────────────────────────── */
const FILTERS = ["All", "Lost Items", "Found Items"];

/* ─── Item Detail View Wrapper ───────────────────────────────── */
const ItemDetailViewWrapper = ({ id, onBack, onSelectMatch, currentUserId }) => {
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);
        
        // Try to fetch matches (will return null if not owner)
        const matchData = await getItemMatches(id).catch(() => null);
        setMatches(matchData?.matches || null);
      } catch (error) {
        console.error("Failed to fetch item details", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  if (loading) return <div className="text-center text-text-secondary py-10">Loading item...</div>;
  if (!item) return <div className="text-center text-text-secondary py-10">Item not found. <button onClick={onBack} className="text-primary-blue hover:underline">Go back</button></div>;

  return <ItemDetailView item={item} matches={matches} onBack={onBack} onSelectMatch={onSelectMatch} currentUserId={currentUserId} />;
};

/* ─── Page ───────────────────────────────────────────────────── */
const LostAndFound = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync view state with URL search params so the browser back button works
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getItems("All");
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch lost and found items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

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

  const user = {
    name: currentUser?.name || "Unknown User",
    role: currentUser?.role?.toLowerCase() || "student",
    avatar: currentUser?.avatar,
  };

  const filteredItems =
    activeFilter === "All"
      ? items
      : activeFilter === "Lost Items"
        ? items.filter((i) => i.type === "lost")
        : items.filter((i) => i.type === "found");

  /* Create Post button — only visible on the list view */
  const headerRight = view === "list" ? (
    <button
      onClick={() => setView("modal")}
      className="bg-primary-blue hover:brightness-110 text-white text-body-small-bold px-5 py-2 rounded-full transition-all active:scale-95"
    >
      Create Post
    </button>
  ) : null;

  if (!currentUser) return null;

  return (
    <MainLayout
      user={user}
      pageTitle="Lost & Found"
      verificationCount={0}
      headerRight={headerRight}
    >
      {view === "detail" ? (
        <ItemDetailViewWrapper 
          id={Number(searchParams.get("id"))} 
          onBack={() => setView("list")} 
          onSelectMatch={(matchId) => setSearchParams({ view: "detail", id: String(matchId) })}
          currentUserId={currentUser?.id}
        />
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
          {isLoading ? (
            <div className="text-center text-text-secondary py-10">Loading...</div>
          ) : (
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
