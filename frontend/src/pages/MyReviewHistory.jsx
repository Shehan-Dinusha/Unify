import React, { useState } from "react";
import { Star, Trash2, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { mockUserReviews, mockUserReviewSummary } from "../data/mockReviewData";
import {
  DeleteReviewModal,
  ReviewDeletedModal,
} from "../components/common/ReviewModals";
import StarRating from "../components/common/StarRating";

const ReviewHistoryCard = ({ review, onDelete }) => {
  return (
    <Card variant="container" className="w-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={review.targetAvatar}
            alt={review.targetName}
          />
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold font-inter leading-5">
              {review.targetName}
            </span>
            <span className="text-zinc-400 text-xs font-normal font-inter leading-5">
              {review.category} • {review.createdAt}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="text-neutral-100 text-sm font-normal font-inter leading-5 mb-6 whitespace-pre-line">
        {review.content}
      </p>

      {/* Helpful & Not Helpful Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <ThumbsUp className="w-4 h-4 stroke-[2.5] text-zinc-400" />
          <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
            Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ThumbsDown className="w-4 h-4 stroke-[2.5] text-zinc-400" />
          <span className="text-xs font-bold font-inter leading-5 text-zinc-400">
            Not Helpful{" "}
            {review.notHelpfulCount > 0 && `(${review.notHelpfulCount})`}
          </span>
        </div>
      </div>

      {/* Owner Reply Block */}
      {review.ownerReply && (
        <div className="mb-6 pt-4 flex gap-3">
          <img
            src={review.ownerReply.author.avatar}
            alt={review.ownerReply.author.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 bg-gray-800 rounded-tr-lg rounded-bl-lg rounded-br-lg p-3 outline outline-1 outline-gray-800 flex flex-col gap-1">
            <div className="flex justify-between items-center h-6">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold font-inter leading-5">
                  {review.ownerReply.author.name}
                </span>
                <span className="px-1.5 py-0.5 bg-blue-600/10 text-blue-600 text-xs font-bold font-inter rounded leading-none">
                  Owner
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm font-normal font-inter leading-5">
              {review.ownerReply.content}
            </p>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-blue-500/20 flex justify-start items-center">
        <Button
          variant="ghost-hoverless"
          className="w-36 h-12 bg-red-400/5 hover:bg-red-400/10 transition-colors rounded-2xl outline outline-2 outline-offset-[-2px] outline-red-400 flex justify-center items-center gap-2 overflow-hidden !p-0 hover:opacity-100"
          onClick={() => onDelete && onDelete(review.id)}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-bold font-inter leading-5">
            Delete Review
          </span>
        </Button>
      </div>
    </Card>
  );
};

const MyReviewHistory = () => {
  const [reviews, setReviews] = useState(mockUserReviews);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const tabs = ["All Reviews", "Boarding", "Food/Cafe", "Services"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Rating",
    "Lowest Rating",
  ];

  const user = {
    name: "Alex Johnson",
    role: "student",
    displayRole: "Student",
  };

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
  };

  const handleConfirmDelete = () => {
    setReviews(reviews.filter((r) => r.id !== reviewToDelete));
    setReviewToDelete(null);
    setShowDeletedModal(true);
  };

  // Simple filtering (mock behavior)
  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "All Reviews") return true;
    if (activeTab === "Boarding" && review.category === "Boarding") return true;
    if (activeTab === "Food/Cafe" && review.category === "Food & Cafe")
      return true;
    if (
      activeTab === "Services" &&
      (review.category === "Freelance Services" ||
        review.category === "Tech Services")
    ) {
      return true;
    }
    return false;
  });

  return (
    <MainLayout user={user} pageTitle="Profile" verificationCount={0}>
      {!!reviewToDelete && (
        <DeleteReviewModal
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showDeletedModal && (
        <ReviewDeletedModal onClose={() => setShowDeletedModal(false)} />
      )}

      {/* Main Container mirroring the visual design structure */}
      <div className="w-[928px] mx-auto mt-8 relative">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-[43px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl font-bold font-inter leading-9 m-0">
              My Review History
            </h1>
            <p className="text-slate-400 text-base font-normal font-inter leading-5 m-0">
              Manage and view all the feedback you've shared with the community.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="flex gap-3 h-28">
            <Card
              variant="container"
              className="flex-1 h-full shadow-none"
              padding="p-0"
            >
              <div className="absolute top-[25px] left-[24.5px] flex flex-col">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2">
                  Total Reviews
                </span>
                <span className="text-white text-3xl font-bold font-inter leading-9">
                  {mockUserReviewSummary.totalReviews}
                </span>
              </div>
            </Card>

            <Card
              variant="container"
              className="flex-1 h-full shadow-none"
              padding="p-0"
            >
              <div className="absolute top-[25px] left-[25px] flex flex-col w-full pr-6">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2">
                  Avg Rating Given
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-3xl font-bold font-inter leading-9">
                    {mockUserReviewSummary.averageRating}
                  </span>
                  <div className="w-6 h-7 relative flex justify-center items-center">
                    <div
                      className="w-5 h-5 bg-amber-400 absolute"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card
              variant="container"
              className="flex-1 h-full shadow-none"
              padding="p-0"
            >
              <div className="absolute top-[25px] left-[25px] flex flex-col w-full pr-6 overflow-hidden">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2">
                  Top Category
                </span>
                <span className="text-blue-500 text-3xl font-bold font-lexend leading-9 truncate w-full">
                  {mockUserReviewSummary.topCategory}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="w-full h-14 py-2 flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 overflow-hidden">
            {tabs.map((tab) => (
              <Button
                size="small"
                variant={activeTab === tab ? "primary" : "secondary"}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-9 whitespace-nowrap min-w-[112px] flex justify-center items-center transition-all ${
                  activeTab !== tab
                    ? "bg-dark-4 text-text-secondary border border-white/10 hover:bg-white/5"
                    : "border border-transparent"
                }`}
              >
                {tab === "All Reviews" ? (
                  "All Reviews"
                ) : (
                  <div className="flex items-center gap-1.5 ">
                    {tab === "Boarding" && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {tab === "Food/Cafe" && (
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {tab === "Services" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {tab}
                  </div>
                )}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-bold font-inter">
              Sort by:
            </span>
            <div className="relative">
              <div
                className="w-40 h-11 bg-white/5 rounded-2xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="text-white text-sm font-inter whitespace-nowrap overflow-hidden text-ellipsis">
                  {sortBy}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isSortOpen && (
                <div className="absolute top-full mt-2 w-40 bg-gray-800 rounded-xl outline outline-1 outline-white/10 shadow-lg overflow-hidden z-10 right-0">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      className={`px-4 py-2.5 text-sm font-inter cursor-pointer transition-colors ${
                        sortBy === option
                          ? "text-white font-bold bg-white/10"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      }`}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full flex items-center flex-col gap-6">
          {filteredReviews.map((review) => (
            <ReviewHistoryCard
              key={review.id}
              review={review}
              onDelete={handleDeleteClick}
            />
          ))}

          {/* Load More Button */}
          <Button
            variant="ghost-hoverless"
            className="mt-4 flex items-center justify-center gap-2 group w-full"
          >
            <span className="text-slate-400 text-sm font-bold font-inter group-hover:text-white transition-colors">
              Load more Reviews
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </Button>
          <div className="pb-10"></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyReviewHistory;
