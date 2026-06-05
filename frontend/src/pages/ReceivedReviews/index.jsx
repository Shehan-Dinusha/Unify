import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import NotFound from "../NotFound";
import { useReceivedReviews } from "./useReceivedReviews";
import ReceivedReviewCard from "./ReceivedReviewCard";
import ReviewSummaryCard from "./ReviewSummaryCard";
import ReviewFilterBar from "./ReviewFilterBar";

const ReceivedReviews = () => {
  const {
    user,
    metrics,
    activeTab, setActiveTab,
    sortBy, setSortBy,
    isSortOpen, setIsSortOpen,
    isLoading, error, errorStatus,
    visibleCount, setVisibleCount,
    sortedReviews,
    tabs, sortOptions,
    handleReply, handleLike,
  } = useReceivedReviews();

  if (errorStatus) {
    return <NotFound status={errorStatus} />;
  }

  if (isLoading) {
    return (
      <MainLayout user={user} pageTitle="Business Profile" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading received reviews...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout user={user} pageTitle="Business Profile" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="Reviews" verificationCount={0}>
      <div className="w-full max-w-[1024px] mx-auto mt-4 sm:mt-8 px-4 sm:px-6 lg:px-0 relative flex flex-col gap-8 lg:gap-[45px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl sm:text-3xl font-bold font-inter leading-tight sm:leading-9 m-0">
            Received Reviews
          </h1>
          <p className="text-gray-400 text-base font-normal font-inter leading-5 m-0">
            Monitor and respond to student feedback to maintain your service rating.
          </p>
        </div>

        <ReviewSummaryCard metrics={metrics} />

        <ReviewFilterBar
          tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}
          sortOptions={sortOptions} sortBy={sortBy} onSortChange={(option) => { setSortBy(option); setIsSortOpen(false); }}
          isSortOpen={isSortOpen} onToggleSort={() => setIsSortOpen(!isSortOpen)}
        />

        <div className="flex flex-col gap-4">
          {sortedReviews.length > 0 ? (
            sortedReviews.slice(0, visibleCount).map((review) => (
              <ReceivedReviewCard key={review.id} review={review} onReply={handleReply} onLike={handleLike} />
            ))
          ) : (
            <div className="text-gray-400 text-sm font-inter text-center py-8">No reviews yet</div>
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

export default ReceivedReviews;
