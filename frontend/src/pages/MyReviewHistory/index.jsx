import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import { DeleteReviewModal, ReviewDeletedModal } from "../../components/common/ReviewModals";
import NotFound from "../NotFound";
import { useMyReviewHistory } from "./useMyReviewHistory";
import ReviewHistoryCard from "./ReviewHistoryCard";
import ReviewKPICards from "./ReviewKPICards";
import ReviewFilterBar from "./ReviewFilterBar";

const MyReviewHistory = () => {
  const {
    user,
    summary,
    reviewToDelete, setReviewToDelete,
    showDeletedModal, setShowDeletedModal,
    activeTab, setActiveTab,
    sortBy, setSortBy,
    isSortOpen, setIsSortOpen,
    isLoading, error, errorStatus,
    visibleCount, setVisibleCount,
    sortedReviews,
    handleDeleteClick,
    handleConfirmDelete,
  } = useMyReviewHistory();

  if (errorStatus) return <NotFound status={errorStatus} />;

  if (isLoading) {
    return (
      <MainLayout user={user} pageTitle="Profile" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading review history...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout user={user} pageTitle="Profile" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Profile" verificationCount={0}>
      {!!reviewToDelete && (
        <DeleteReviewModal onClose={() => setReviewToDelete(null)} onConfirm={handleConfirmDelete} />
      )}
      {showDeletedModal && (
        <ReviewDeletedModal onClose={() => setShowDeletedModal(false)} />
      )}

      <div className="w-full max-w-[928px] mx-auto mt-4 sm:mt-8 px-4 sm:px-6 lg:px-0 relative">
        <div className="flex flex-col gap-6 mb-8 sm:mb-[43px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl font-bold font-inter leading-9 m-0">My Review History</h1>
            <p className="text-slate-400 text-base font-normal font-inter leading-5 m-0">
              Manage and view all the feedback you&apos;ve shared with the community.
            </p>
          </div>
          <ReviewKPICards summary={summary} />
        </div>

        <ReviewFilterBar
          activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setVisibleCount(5); }}
          sortBy={sortBy} onSortChange={(opt) => { setSortBy(opt); setIsSortOpen(false); }}
          isSortOpen={isSortOpen} onToggleSort={() => setIsSortOpen(!isSortOpen)}
        />

        <div className="flex flex-col gap-4">
          {sortedReviews.length > 0 ? (
            sortedReviews.slice(0, visibleCount).map((review) => (
              <ReviewHistoryCard key={review.id} review={review} onDelete={handleDeleteClick} />
            ))
          ) : (
            <div className="text-gray-400 text-sm font-inter text-center py-8">No reviews found.</div>
          )}
        </div>

        {sortedReviews.length > 0 && (
          <LoadMoreButton
            visibleCount={visibleCount}
            totalCount={sortedReviews.length}
            onClick={() => setVisibleCount((prev) => prev + 5)}
            itemName="Reviews"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MyReviewHistory;
