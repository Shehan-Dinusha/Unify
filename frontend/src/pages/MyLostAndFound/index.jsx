import React from "react";
import { ChevronDown } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import CreatePostModal from "../../components/lost-found/CreatePostModal";
import ReportItemForm from "../../components/lost-found/ReportItemForm";
import EditItemForm from "../../components/lost-found/EditItemForm";
import { useMyLostAndFound, FILTERS } from "./useMyLostAndFound";
import MyItemCard from "./MyItemCard";
import DeleteConfirmModal from "./DeleteConfirmModal";
import DeleteSuccessModal from "./DeleteSuccessModal";

const MyLostAndFound = () => {
  const {
    currentUser, user,
    view, setView,
    editingItemId, clearEdit,
    activeFilter, setActiveFilter,
    items,
    isLoading,
    // eslint-disable-next-line no-unused-vars
    visibleCount, setVisibleCount,
    displayedItems, hasMore,
    deleteModal,
    handleResolve, handleEdit,
    handleSaveEdit,
    handleDeleteClick, confirmDelete, closeDeleteModal,
  } = useMyLostAndFound();

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
    <MainLayout user={user} pageTitle="My Lost & Found" verificationCount={0} headerRight={headerRight}>
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setVisibleCount(6); }}
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
                  onResolve={handleResolve} onEdit={handleEdit} onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="text-heading-medium">{String.fromCodePoint(0x1F4CB)}</span>
              </div>
              <h3 className="text-body-large-bold text-text-primary mb-1">No items found</h3>
              <p className="text-body-small text-text-secondary max-w-xs">
                {activeFilter === "Resolved"
                  ? "You haven't resolved any items yet."
                  : "You haven't posted any items in this category."}
              </p>
            </div>
          )}

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

      {deleteModal?.step === "confirm" && (
        <DeleteConfirmModal onClose={closeDeleteModal} onConfirm={confirmDelete} />
      )}

      {deleteModal?.step === "success" && (
        <DeleteSuccessModal onClose={closeDeleteModal} />
      )}

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
