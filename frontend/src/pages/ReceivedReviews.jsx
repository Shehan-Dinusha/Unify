import React, { useState } from "react";
import {
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CornerDownRight,
  Heart,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import StarRating from "../components/common/StarRating";
import {
  ReportReviewModal,
  ReportSuccessModal,
} from "../components/common/ReportModals";
import {
  mockBusinessReviewMetrics,
  mockReceivedReviews,
} from "../data/mockReviewData";

const ReceivedReviewCard = ({ review, onReport }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // Local state to mock owner reply edits immediately
  const [hasOwnerReplied, setHasOwnerReplied] = useState(
    review.hasOwnerReplied,
  );
  const [ownerReplyData, setOwnerReplyData] = useState(review.ownerReply);

  const handleEditReply = () => {
    setReplyText(ownerReplyData ? ownerReplyData.content : "");
    setIsReplying(true);
  };

  const handlePostReply = () => {
    setOwnerReplyData({
      content: replyText,
      createdAt: "Just now",
    });
    setHasOwnerReplied(true);
    setIsReplying(false);
  };

  return (
    <Card variant="container" className="w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <img
            className="w-10 h-10 rounded-full object-cover shadow-[0px_0px_0px_1px_rgba(40,46,57,1.00)] shrink-0"
            src={review.author.avatar}
            alt={review.author.name}
          />
          <div className="flex flex-col flex-1 sm:flex-none overflow-hidden">
            <span className="text-white text-base font-bold font-inter leading-5 truncate">
              {review.author.name}
            </span>
            <span className="text-slate-400 text-xs font-normal font-inter leading-5 mt-0.5 truncate">
              {review.createdAt}
            </span>
          </div>
        </div>
        <div className="flex items-start shrink-0">
          <StarRating rating={review.rating} />
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <p className="text-slate-200 text-sm font-normal font-inter leading-5 whitespace-pre-line">
          {review.content}
        </p>
      </div>

      {hasOwnerReplied && ownerReplyData && !isReplying && (
        <div className="pl-4 pb-4 w-full">
          <div className="p-4 bg-gray-800 rounded-lg border-l-2 border-blue-500 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-xs font-bold font-inter leading-5">
                You Replied
              </span>
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                • {ownerReplyData.createdAt}
              </span>
            </div>
            <p className="text-neutral-100 text-sm font-normal font-inter leading-5 whitespace-pre-line">
              {ownerReplyData.content}
            </p>
          </div>
        </div>
      )}

      {isReplying && (
        <div className="pl-0 sm:pl-2 pb-4 w-full">
          <div className="p-3 bg-gray-800 rounded-lg outline outline-1 outline-gray-700 flex flex-col gap-2">
            <textarea
              className="w-full h-24 sm:h-32 px-2 sm:px-3 py-2 bg-transparent outline-none text-gray-400 text-sm font-lexend leading-5 resize-none placeholder:text-gray-500"
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-2">
              <span className="text-gray-400 text-xs font-normal font-lexend leading-4">
                Replying as Campus Eats Owner
              </span>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="ghost-hoverless"
                  className="!p-0 !h-auto px-3 py-1.5 text-slate-400 text-sm font-medium font-lexend hover:text-white transition-colors"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="primary"
                  className="h-7 w-24 flex justify-center text-xs"
                  onClick={handlePostReply}
                  disabled={!replyText.trim()}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-4 border-t border-blue-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 overflow-hidden w-full sm:w-auto">
          {/* Helpful */}
          <div className="flex items-center gap-2 text-gray-400">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium font-inter">
              Helpful {review.helpfulCount > 0 && `(${review.helpfulCount})`}
            </span>
            <ThumbsDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
          </div>

          <div className="hidden sm:block h-5 w-px bg-gray-800 mx-1 shrink-0" />

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Reply Toggle Actions */}
            {hasOwnerReplied ? (
              <Button
                variant="ghost-hoverless"
                className="!p-0 !h-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={handleEditReply}
              >
                <span className="text-sm font-bold font-inter">Edit Reply</span>
              </Button>
            ) : (
              <Button
                variant="ghost-hoverless"
                className="!p-0 !h-auto flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
                onClick={() => setIsReplying(!isReplying)}
              >
                <CornerDownRight className="w-4 h-4" />
                <span className="text-sm font-bold font-inter">Reply</span>
              </Button>
            )}

            <div className="h-5 w-px bg-gray-800 mx-0 sm:mx-1 shrink-0" />

            {/* Reaction */}
            <Button
              variant="ghost-hoverless"
              className="!p-0 !h-auto flex items-center gap-1.5 transition-colors"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
              {isLiked && (
                <span className="text-xs font-bold font-inter text-red-500">
                  Liked By The Owner
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Report to Admin */}
        <Button
          variant="ghost-hoverless"
          className="!p-0 !h-auto flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          onClick={() => onReport(review)}
        >
          <Flag className="w-4 h-4" />
          <span className="text-sm font-medium font-inter">
            Report to Admin
          </span>
        </Button>
      </div>
    </Card>
  );
};

const ReceivedReviews = () => {
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const tabs = ["All Reviews", "Unreplied", "5 stars", "Critical"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Rating",
    "Lowest Rating",
  ];

  const user = {
    name: "Alex Johnson",
    role: "business",
    displayRole: "Business & Organization",
  };

  const handleReportClick = (review) => {
    setSelectedReview(review);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (data) => {
    // API logic here
    console.log("Reported Review:", selectedReview?.id, data);
    setIsReportModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const filteredReviews = mockReceivedReviews.filter((review) => {
    if (activeTab === "Unreplied") return !review.hasOwnerReplied;
    if (activeTab === "5 stars") return review.rating === 5;
    if (activeTab === "Critical") return review.rating <= 3;
    return true; // "All Reviews"
  });

  return (
    <MainLayout user={user} pageTitle="Reviews" verificationCount={0}>
      <ReportReviewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
      <ReportSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <div className="w-full max-w-[960px] mx-auto mt-4 sm:mt-8 flex flex-col gap-6 px-4 sm:px-6 lg:px-0 relative">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl sm:text-3xl font-bold font-inter leading-tight sm:leading-9 m-0">
            Received Reviews
          </h1>
          <p className="text-gray-400 text-base font-normal font-inter leading-5 m-0">
            Monitor and respond to student feedback to maintain your service
            rating.
          </p>
        </div>

        {/* Top Summary Card */}
        <Card
          variant="card"
          className="w-full !p-6 flex flex-col justify-start"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-12 pt-2 pb-2 px-0 sm:pl-4">
            {/* Left Metrics */}
            <div className="flex flex-col gap-1 w-full sm:w-48 shrink-0 items-center sm:items-start text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-white text-5xl font-bold font-inter leading-6">
                  {mockBusinessReviewMetrics.averageRating}
                </span>
                <span className="text-gray-400 text-base font-bold font-inter leading-5">
                  out of 5
                </span>
              </div>
              <div className="py-2 flex justify-center sm:justify-start">
                <StarRating rating={mockBusinessReviewMetrics.averageRating} />
              </div>
              <span className="text-white text-sm font-bold font-inter leading-5 mt-1">
                {mockBusinessReviewMetrics.totalReviews} total reviews
              </span>
            </div>

            {/* Right Distribution Bars */}
            <div className="flex-1 w-full flex flex-col justify-between pt-1 pb-1 gap-[11px]">
              {mockBusinessReviewMetrics.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <span className="text-white text-sm font-medium font-lexend w-3">
                    {item.stars}
                  </span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm font-normal font-lexend w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Filter and Sort Bar */}
        <div className="w-full py-2 flex items-center justify-between mt-2 mb-2 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 sm:flex-auto">
            {tabs.map((tab) => (
              <Button
                size="small"
                variant={activeTab === tab ? "primary" : "secondary"}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-9 px-4 rounded-2xl flex justify-center items-center font-bold text-sm whitespace-nowrap min-w-max transition-all ${
                  activeTab !== tab
                    ? "bg-gray-800 text-gray-400 border border-transparent hover:bg-white/5"
                    : "text-white"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block text-gray-400 text-sm font-normal font-inter">
              Sort by:
            </span>
            <div className="relative">
              <div
                className="w-10 sm:w-36 h-9 sm:h-9 bg-white/5 sm:rounded-2xl rounded-xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-center sm:justify-between px-0 sm:px-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="hidden sm:block text-white text-xs font-bold font-inter">
                  {sortBy}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isSortOpen && (
                <div className="absolute top-full mt-2 right-0 sm:left-0 w-36 bg-gray-800 rounded-xl border border-white/10 shadow-lg overflow-hidden z-20">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      className={`px-4 py-2.5 text-xs font-inter cursor-pointer transition-colors ${
                        sortBy === option
                          ? "text-white font-bold bg-white/10"
                          : "text-gray-400 hover:bg-white/5"
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

        {/* Review Cards List */}
        <div className="flex flex-col gap-4">
          {filteredReviews.map((review) => (
            <ReceivedReviewCard
              key={review.id}
              review={review}
              onReport={handleReportClick}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="py-6 flex justify-center items-center pb-12">
          <Button
            variant="ghost-hoverless"
            className="flex items-center gap-2 group"
          >
            <span className="text-gray-400 text-sm font-bold font-inter group-hover:text-white transition-colors">
              Load more Reviews
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReceivedReviews;
