import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { MapPin, CheckCircle, Pencil, Trash2, ChevronDown, AlertTriangle, X } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { getMyItems, deleteItem, editItem } from "../services/lostAndFoundService";
import CreatePostModal from "../components/lost-found/CreatePostModal";
import ReportItemForm from "../components/lost-found/ReportItemForm";
import EditItemForm from "../components/lost-found/EditItemForm";

/* ─── Filter Tabs ────────────────────────────────────────────── */
const FILTERS = ["All", "Lost Items", "Found Items", "Resolved"];

/* ─── My Item Card ───────────────────────────────────────────── */
const MyItemCard = ({ item, onResolve, onEdit, onDelete, isResolved }) => {
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
    <div className="group rounded-2xl overflow-hidden bg-dark-2 border border-white/5 hover:border-primary-blue/30 transition-all duration-200">
      {/* Image */}
      <div 
        className="relative w-full h-40 sm:h-48 bg-dark-1/50 overflow-hidden"
        onMouseEnter={startSlide}
        onMouseLeave={stopSlide}
      >
        <img
          src={item.images && item.images.length > 0 ? item.images[currentIndex] : "https://placehold.co/400x300"}
          alt={item.title}
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-all duration-500"
        />
      {/* Type Badge */}
      <span
        className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
          isResolved
            ? "bg-primary-blue text-white"
            : item.type === "lost"
              ? "bg-state-error text-white"
              : "bg-state-success text-white"
        }`}
      >
        {isResolved ? "Resolved" : item.type}
      </span>
    </div>

    {/* Info */}
    <div className="p-3 sm:p-4 flex flex-col gap-1.5">
      {/* Title + Time */}
      <div className="flex items-center gap-2">
        <h3 className="text-body-medium-bold text-text-primary leading-snug truncate">
          {item.title}
        </h3>
        <span className="text-[12px] text-text-tertiary whitespace-nowrap shrink-0">
          {item.time}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-text-tertiary">
        <MapPin size={13} className="shrink-0" />
        <span className="text-[12px] truncate">{item.location}</span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        {/* Resolve Button */}
        {!isResolved ? (
          <button
            onClick={() => onResolve(item.id)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg transition-colors text-[12px] font-semibold"
          >
            <CheckCircle size={14} />
            Resolve
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-primary-blue text-[12px] font-semibold px-3 py-1.5">
            <CheckCircle size={14} />
            Resolved
          </span>
        )}

        {/* Edit & Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item.id)}
            className="p-2 rounded-lg text-text-tertiary hover:text-primary-blue hover:bg-white/5 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-lg text-text-tertiary hover:text-state-error hover:bg-state-error/10 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────── */
const MyLostAndFound = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Delete modal state: null | { id, step: 'confirm' | 'success' }
  const [deleteModal, setDeleteModal] = useState(null);

  // Sync view state with URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";
  const editingItemId = searchParams.get("edit") ? Number(searchParams.get("edit")) : null;

  const setView = useCallback(
    (newView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (newView === "list") {
            params.delete("view");
          } else {
            params.set("view", newView);
          }
          return params;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const clearEdit = useCallback(() => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete("edit");
        return params;
      },
      { replace: false }
    );
  }, [setSearchParams]);

  const user = {
    name: currentUser?.name || "Unknown User",
    role: currentUser?.role?.toLowerCase() || "student",
    avatar: currentUser?.avatar,
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getMyItems();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch my items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleResolve = async (id) => {
    try {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "Resolved" } : item))
      );
      
      const formData = new FormData();
      formData.append("status", "Resolved");
      await editItem(id, formData);
    } catch (err) {
      console.error("Failed to resolve item:", err);
    }
  };

  const handleEdit = (id) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("edit", id);
        return params;
      },
      { replace: false }
    );
  };

  const handleSaveEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    clearEdit();
  };

  // Step 1: Open confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteModal({ id, step: "confirm" });
  };

  // Step 2: User confirms deletion
  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteItem(deleteModal.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteModal.id));
      
      if (editingItemId === deleteModal.id) {
        clearEdit();
      }
      
      setDeleteModal({ ...deleteModal, step: "success" });
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Close modal
  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  // Filter items
  const getFilteredItems = () => {
    switch (activeFilter) {
      case "Lost Items":
        return items.filter((i) => i.type === "lost" && i.status !== "Resolved");
      case "Found Items":
        return items.filter((i) => i.type === "found" && i.status !== "Resolved");
      case "Resolved":
        return items.filter((i) => i.status === "Resolved");
      default:
        return items;
    }
  };

  const filteredItems = getFilteredItems();
  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = displayedItems.length < filteredItems.length;

  /* Header: Create Post button */
  const headerRight = view === "list" && !editingItemId ? (
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
      pageTitle="My Lost & Found"
      verificationCount={0}
      headerRight={headerRight}
    >
      {editingItemId ? (
        <EditItemForm
          item={items.find((i) => i.id === editingItemId)}
          onSave={handleSaveEdit}
          onCancel={clearEdit}
          onDelete={() => handleDeleteClick(editingItemId)}
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
              onClick={() => {
                setActiveFilter(filter);
                setVisibleCount(6);
              }}
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-body-large-bold text-text-primary mb-1">Loading items...</h3>
          </div>
        ) : displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {displayedItems.map((item) => (
              <MyItemCard
                key={item.id}
                item={item}
                isResolved={item.status === "Resolved"}
                onResolve={handleResolve}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-heading-medium">📋</span>
            </div>
            <h3 className="text-body-large-bold text-text-primary mb-1">
              No items found
            </h3>
            <p className="text-body-small text-text-secondary max-w-xs">
              {activeFilter === "Resolved"
                ? "You haven't resolved any items yet."
                : "You haven't posted any items in this category."}
            </p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount((c) => c + 6)}
            className="mx-auto flex items-center gap-2 text-body-small text-text-secondary hover:text-text-primary transition-colors py-3"
          >
            Load more items
            <ChevronDown size={14} />
          </button>
        )}
      </div>
      )}

      {/* ─── Delete Confirmation Modal ─────────────────────────── */}
      {deleteModal && deleteModal.step === "confirm" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeDeleteModal}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4" />

          {/* Glass Card */}
          <Card
            variant="card"
            padding="p-6 sm:p-8"
            className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 text-center outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-state-error/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-state-error" />
            </div>

            <h3 className="text-body-large-bold text-text-primary mb-2">
              Delete this post?
            </h3>
            <p className="text-body-small text-text-secondary leading-relaxed mb-6">
              Are you sure you want to permanently remove this post?{" "}
              <span className="text-text-primary font-medium">This action cannot be undone.</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-body-small-bold text-text-primary hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-state-error hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
              >
                Delete Post
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── Delete Success Modal ──────────────────────────────── */}
      {deleteModal && deleteModal.step === "success" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeDeleteModal}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4" />

          {/* Glass Card */}
          <Card
            variant="card"
            padding="p-6 sm:p-8"
            className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 text-center outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>

            {/* Success Icon */}
            <div className="w-14 h-14 rounded-full bg-state-success/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-state-success" />
            </div>

            <h3 className="text-body-large-bold text-text-primary mb-2">
              Deleted Successfully
            </h3>
            <p className="text-body-small text-text-secondary leading-relaxed mb-6">
              The post has been removed from the platform and will no longer appear in listings or search results.
            </p>

            {/* Done Button */}
            <button
              onClick={closeDeleteModal}
              className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
            >
              Done
            </button>
          </Card>
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

export default MyLostAndFound;
