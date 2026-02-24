import React, { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, ChevronDown, Trash2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { mockReviews, mockReviewSummary } from "../data/mockReviewData";
import {
  DeleteReviewModal,
  ReviewDeletedModal,
} from "../components/common/ReviewModals";
import StarRating from "../components/common/StarRating";

const ShieldCheckIcon = () => (
  <svg
    width="24"
    height="28"
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 26.5C12 26.5 22.5 21.5 22.5 12.5V5L12 1.5L1.5 5V12.5C1.5 21.5 12 26.5 12 26.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 13.5L11 16L16.5 10.5"
      stroke="background"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.6667 13.0433V14.0001C25.6652 16.5165 24.8475 18.966 23.3364 20.9846C21.8252 23.0033 19.6997 24.4842 17.269 25.2093C14.8383 25.9344 12.2285 25.8653 9.81816 25.0135C7.40785 24.1617 5.3225 22.5732 3.864 20.4735C2.40549 18.3737 1.64998 15.8711 1.70119 13.3314C1.75239 10.7916 2.60741 8.35626 4.13757 6.38605C5.66774 4.41585 7.79375 2.9723 10.2036 2.26998C12.6133 1.56767 15.1802 1.6433 17.525 2.48512"
      stroke="#22C55E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6667 4.66675L14 16.3451L10.5 12.8451"
      stroke="#22C55E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RatingSummary = ({ summary }) => {
  return (
    <Card variant="card" className="w-96 h-[470px] flex flex-col justify-start">
      <h3 className="text-white text-xl font-bold font-inter mb-6">
        Rating Summary
      </h3>
      <div className="flex items-center gap-4 mb-8">
        <div className="text-white text-[48px] font-bold font-inter leading-[48px]">
          {summary.averageRating.toFixed(1)}
        </div>
        <div className="flex flex-col gap-1">
          <StarRating rating={summary.averageRating} />
          <div className="text-gray-400 text-sm font-inter mt-1">
            Based on {summary.totalReviews} reviews
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {summary.distribution.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-3">
            <div className="w-4 text-gray-400 text-sm font-inter">
              {dist.stars}
            </div>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${dist.percentage}%` }}
              />
            </div>
            <div className="w-10 text-right text-gray-400 text-sm font-inter">
              {dist.percentage}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const HasReviewedCard = () => {
  return (
    <div className="w-[560px] h-[470px] relative bg-white/10 rounded-3xl">
      <div className="w-[560px] h-[470px] left-0 top-0 absolute bg-transparent rounded-3xl shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] outline outline-1 outline-offset-[-1px] outline-white/20" />
      <div className="w-96 left-[88px] top-[115px] absolute inline-flex flex-col justify-center items-center">
        <div className="w-16 h-20 pb-6 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-blue-600/10 rounded-full inline-flex justify-center items-center">
            <div className="text-blue-500">
              <ShieldCheckIcon />
            </div>
          </div>
        </div>
        <div className="pb-3 flex flex-col justify-center items-center">
          <h3 className="text-center justify-center text-white text-xl font-bold font-inter leading-5 m-0">
            You've shared your thoughts!
          </h3>
        </div>
        <div className="w-full max-w-96 px-1.5 flex flex-col justify-center items-center mb-8">
          <p className="text-center justify-center text-gray-400 text-base font-normal font-inter leading-5 m-0">
            You have already submitted a review for this
            <br />
            service. You can manage or delete your existing
            <br />
            review below.
          </p>
        </div>
        <div className="pt-0 flex flex-col justify-center items-center">
          <Button
            variant="link"
            className="text-blue-500 text-sm font-bold font-inter flex items-center gap-2 group !p-0 hover:text-blue-400 transition-colors"
            onClick={() => {
              const el = document.getElementById("own-review");
              if (el)
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Go to your review
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-y-1 transition-transform"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

const WriteReview = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <Card
      variant="card"
      className="w-[560px] h-[470px] flex flex-col justify-between"
    >
      <div>
        <h3 className="text-white text-xl font-bold font-inter mb-2">
          Write a Review
        </h3>
        <p className="text-gray-400 text-sm font-inter mb-6">
          Share your experience to help other students make better choices.
        </p>

        <div className="mb-6">
          <label className="block text-zinc-400 text-sm font-bold font-inter mb-2">
            Your Rating
          </label>
          <StarRating rating={rating} interactive onRate={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-sm font-bold font-inter mb-2">
            Your Review
          </label>
          <div className="relative">
            <textarea
              className="w-full h-28 bg-gray-800 rounded-lg p-3 text-gray-300 text-base font-inter placeholder-gray-400 outline outline-1 outline-gray-900 focus:outline-primary-blue resize-none pb-8"
              placeholder="What did you like or dislike? How was the service?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="absolute bottom-3 left-3 right-3 flex justify-end items-center pointer-events-none">
              <span className="text-gray-400 text-xs font-inter">
                {review.length}/500
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-blue-500/20 flex justify-between items-center mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded appearance-none border border-gray-900 bg-gray-800 checked:bg-primary-blue transition-colors outline-none"
            />
            {isAnonymous && (
              <svg
                className="w-3 h-3 text-white absolute pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-slate-400 text-sm font-inter group-hover:text-slate-300 transition-colors">
            Post anonymously
          </span>
        </label>
        <Button
          className="w-48 shadow-[0_4px_6px_-4px_rgba(43,140,238,0.25),0_10px_15px_-3px_rgba(43,140,238,0.25)] flex justify-center items-center gap-2 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none"
          disabled={rating === 0}
          onClick={() => onSubmit({ rating, review, isAnonymous })}
        >
          <span className="text-white text-base font-bold font-inter">
            Submit Review
          </span>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 6H12.8332M12.8332 6L7.58317 0.75M12.8332 6L7.58317 11.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </Card>
  );
};

const ReviewCard = ({ review, onDelete }) => {
  const [feedback, setFeedback] = useState(null);

  const handleHelpful = () => {
    setFeedback((prev) => (prev === "helpful" ? null : "helpful"));
  };

  const handleNotHelpful = () => {
    setFeedback((prev) => (prev === "not_helpful" ? null : "not_helpful"));
  };

  const helpfulCount = review.helpfulCount + (feedback === "helpful" ? 1 : 0);
  const baseNotHelpfulCount = review.notHelpfulCount || 0;
  const notHelpfulCount =
    baseNotHelpfulCount + (feedback === "not_helpful" ? 1 : 0);

  return (
    <Card
      variant="container"
      className="w-full max-w-[1000px]"
      id={review.isOwn ? "own-review" : undefined}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          {review.author.avatar ? (
            <img
              src={review.author.avatar}
              alt={review.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-inter ${review.author.bgColor || "bg-gray-600"}`}
            >
              {review.author.initials}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold font-inter leading-5">
                {review.author.name}
              </span>
              {review.isOwn && (
                <div className="px-2 py-0.5 bg-gray-800 rounded-full inline-flex justify-center items-center">
                  <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                    You
                  </span>
                </div>
              )}
            </div>
            <span className="text-zinc-400 text-xs font-normal font-inter leading-5">
              {review.author.role} • {review.createdAt}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-neutral-100 text-sm font-normal font-inter leading-5 mb-6 whitespace-pre-line">
        {review.content}
      </p>

      {!review.isOwn ? (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost-hoverless"
            className="!p-0 !h-auto flex items-center gap-1.5"
            onClick={handleHelpful}
          >
            <ThumbsUp
              className={`w-4 h-4 stroke-[2.5] transition-colors ${feedback === "helpful" ? "text-primary-blue fill-primary-blue/20" : "text-zinc-400"}`}
            />
            <span
              className={`text-xs font-bold font-inter leading-5 transition-colors ${feedback === "helpful" ? "text-primary-blue" : "text-zinc-400"}`}
            >
              Helpful {helpfulCount > 0 && `(${helpfulCount})`}
            </span>
          </Button>
          <Button
            variant="ghost-hoverless"
            className="!p-0 !h-auto flex items-center gap-1.5"
            onClick={handleNotHelpful}
          >
            <ThumbsDown
              className={`w-4 h-4 stroke-[2.5] transition-colors ${feedback === "not_helpful" ? "text-state-error fill-state-error/20" : "text-zinc-400"}`}
            />
            <span
              className={`text-xs font-bold font-inter leading-5 transition-colors ${feedback === "not_helpful" ? "text-state-error" : "text-zinc-400"}`}
            >
              Not Helpful {notHelpfulCount > 0 && `(${notHelpfulCount})`}
            </span>
          </Button>
        </div>
      ) : (
        <div className="pt-4 border-t border-blue-500/20 flex justify-start items-center">
          <button
            className="w-36 h-12 bg-red-400/5 hover:bg-red-400/10 transition-colors rounded-2xl outline outline-2 outline-offset-[-2px] outline-red-400 flex justify-center items-center gap-2 overflow-hidden"
            onClick={() => onDelete && onDelete(review.id)}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold font-inter leading-5">
              Delete Review
            </span>
          </button>
        </div>
      )}

      {review.ownerReply && (
        <div className="mt-6 pt-4 border-t border-gray-800 flex gap-3">
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
              <button className="text-red-400 hover:text-red-300 transition-colors p-1">
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.00015 11.1508L6.15432 10.3817C3.14432 7.65583 1.16682 5.865 1.16682 3.66667C1.16682 1.86417 2.57848 0.458328 4.37515 0.458328C5.39598 0.458328 6.37598 0.936662 7.00015 1.68916C7.62432 0.936662 8.60432 0.458328 9.62515 0.458328C11.4218 0.458328 12.8335 1.86417 12.8335 3.66667C12.8335 5.865 10.856 7.65583 7.84598 10.3875L7.00015 11.1508Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-slate-300 text-sm font-normal font-inter leading-5">
              {review.ownerReply.content}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

const ReviewSubmittedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
      <Card
        variant="card"
        className="w-full max-w-[440px] !p-0 overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-state-success/5">
            <div className="w-8 h-8 flex items-center justify-center text-state-success">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            Review Submitted
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Your review has been successfully submitted.
          </div>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};

const MarketplaceReviews = () => {
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState(mockReviews);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const sortOptions = [
    "Most Relevant",
    "Newest",
    "Highest Rating",
    "Lowest Rating",
  ];

  // using the default user from MainLayout usage in Marketplace.jsx
  const user = {
    name: "Alex Johnson",
    role: "student",
    displayRole: "Student",
  };

  const hasSubmitted = reviews.some((r) => r.isOwn);

  const handleReviewSubmit = ({ rating, review, isAnonymous }) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      author: {
        name: isAnonymous ? "Anonymous User" : "Sarah Jenkins",
        role: "Student",
        avatar: "https://placehold.co/40x40",
      },
      createdAt: "Just now",
      rating,
      content: review,
      helpfulCount: 0,
      isOwn: true,
    };

    setReviews([newReview, ...reviews]);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
  };

  const handleConfirmDelete = () => {
    setReviews(reviews.filter((r) => r.id !== reviewToDelete));
    setReviewToDelete(null);
    setShowDeletedModal(true);
  };

  const getSortedReviews = () => {
    let sortedList = [...reviews];

    if (sortBy !== "Newest") {
      sortedList = sortedList.sort((a, b) => {
        if (a.isOwn && !b.isOwn) return -1;
        if (!a.isOwn && b.isOwn) return 1;

        if (sortBy === "Highest Rating") return b.rating - a.rating;
        if (sortBy === "Lowest Rating") return a.rating - b.rating;
        return b.helpfulCount - a.helpfulCount; // Default to Most Relevant
      });
    } else {
      sortedList = sortedList.sort((a, b) => {
        if (a.isOwn && !b.isOwn) return -1;
        if (!a.isOwn && b.isOwn) return 1;
        return 0; // maintain remaining relative order
      });
    }

    return sortedList;
  };

  const sortedReviews = getSortedReviews();
  const summaryReviewsCount =
    mockReviewSummary.totalReviews + (hasSubmitted ? 1 : 0);
  const currentSummary = hasSubmitted
    ? {
        ...mockReviewSummary,
        totalReviews: summaryReviewsCount,
      }
    : mockReviewSummary;

  return (
    <MainLayout user={user} pageTitle="Marketplace" verificationCount={0}>
      {showModal && (
        <ReviewSubmittedModal onClose={() => setShowModal(false)} />
      )}
      {!!reviewToDelete && (
        <DeleteReviewModal
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showDeletedModal && (
        <ReviewDeletedModal onClose={() => setShowDeletedModal(false)} />
      )}
      <div className="max-w-[1024px] mx-auto py-8 flex flex-col items-center gap-16">
        {/* Top Section */}
        <div className="flex justify-center items-stretch gap-12 w-full">
          <RatingSummary summary={currentSummary} />
          {hasSubmitted ? (
            <HasReviewedCard />
          ) : (
            <WriteReview onSubmit={handleReviewSubmit} />
          )}
        </div>

        {/* Reviews List Section */}
        <div className="w-full max-w-[1000px] flex flex-col gap-6">
          {/* Header */}
          <div className="pb-4 border-b border-gray-800 flex justify-between items-center w-full">
            <h2 className="text-white text-xl font-bold font-inter">
              {summaryReviewsCount} Reviews
            </h2>
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
                    className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
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

          {/* Cards */}
          <div className="flex flex-col items-center gap-6 w-full">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

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

export default MarketplaceReviews;
