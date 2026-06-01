import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ChevronDown, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Avatar from "../components/common/Avatar";
import LoadMoreButton from "../components/common/LoadMoreButton";
import { getMyReviews, deleteReview } from "../services/reviewService";
import {
  DeleteReviewModal,
  ReviewDeletedModal,
} from "../components/common/ReviewModals";
import StarRating from "../components/common/StarRating";
import NotFound from "./NotFound";

const ReviewHistoryCard = ({ review, onDelete }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${review.targetId}`);
  };

  return (
    <Card variant="container" className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div onClick={handleViewProfile} className="flex items-center gap-3 cursor-pointer">
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

      {/* Helpful, Not Helpful Stats & Owner Like Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
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

        {/* Static Owner Liked Badge */}
        {review.isLikedByOwner && (
          <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span className="text-[10px] font-bold font-inter text-red-500 uppercase tracking-wide">
              Liked by Owner
            </span>
          </div>
        )}
      </div>

      {/* Owner Reply Block */}
      {review.ownerReply && (
        <div className="mb-6 pt-4 flex gap-3">
          <Avatar
            src={review.ownerReply.author?.avatar}
            alt={review.ownerReply.author?.name}
            className="w-9 h-9 rounded-full object-cover shrink-0"
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
              <span className="text-gray-400 text-xs font-normal font-inter leading-5">
                {review.ownerReply.createdAt}
              </span>
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
          className="w-full sm:w-36 h-12 bg-red-400/5 hover:bg-red-400/10 transition-colors rounded-2xl outline outline-2 outline-offset-[-2px] outline-red-400 flex justify-center items-center gap-2 overflow-hidden !p-0 hover:opacity-100"
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
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
    topCategory: "—",
  });
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const fetchReviewsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorStatus(null);
      const data = await getMyReviews();
      setReviews(data.reviews || []);
      setSummary(
        data.summary || {
          totalReviews: 0,
          averageRating: 0,
          topCategory: "—",
        },
      );
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 403 ||
          err.response.status === 404)
      ) {
        setErrorStatus(err.response.status);
      } else {
        setError("Failed to load reviews.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const tabs = ["All Reviews", "Boarding", "Food/Cafe", "Services"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Rating",
    "Lowest Rating",
  ];

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(reviewToDelete);
      setReviewToDelete(null);
      setShowDeletedModal(true);
      await fetchReviewsData();
    } catch (error) {
      alert("Failed to delete review.");
    }
  };

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [activeTab, sortBy]);

  // Simple filtering
  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "All Reviews") return true;
    if (activeTab === "Boarding" && review.category === "BOARDING") return true;
    if (activeTab === "Food/Cafe" && review.category === "FOOD") return true;
    if (activeTab === "Services" && review.category === "SELF_EMPLOYED")
      return true;
    return false;
  });

  const getSortedReviews = () => {
    let sortedList = [...filteredReviews];

    if (sortBy === "Highest Rating") {
      sortedList = sortedList.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Lowest Rating") {
      sortedList = sortedList.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "Oldest First") {
      sortedList = sortedList.reverse(); // assuming original order is Newest First
    }

    return sortedList;
  };

  const sortedReviews = getSortedReviews();

  if (errorStatus) {
    return <NotFound status={errorStatus} />;
  }

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
        <DeleteReviewModal
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showDeletedModal && (
        <ReviewDeletedModal onClose={() => setShowDeletedModal(false)} />
      )}

      {/* Main Container mirroring the visual design structure */}
      <div className="w-full max-w-[928px] mx-auto mt-4 sm:mt-8 px-4 sm:px-6 lg:px-0 relative">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8 sm:mb-[43px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl font-bold font-inter leading-9 m-0">
              My Review History
            </h1>
            <p className="text-slate-400 text-base font-normal font-inter leading-5 m-0">
              Manage and view all the feedback you've shared with the community.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-28">
            <Card
              variant="container"
              className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center pl-6 sm:pl-0 sm:block relative"
              padding="p-0"
            >
              <div className="flex flex-col sm:absolute sm:top-[25px] sm:left-[24.5px]">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2">
                  Total Reviews
                </span>
                <span className="text-white text-3xl font-bold font-inter leading-9">
                  {summary.totalReviews}
                </span>
              </div>
            </Card>

            <Card
              variant="container"
              className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center px-6 sm:px-0 sm:block relative"
              padding="p-0"
            >
              <div className="flex flex-col w-full sm:absolute sm:top-[25px] sm:left-[25px] sm:pr-6">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  Avg Rating Given
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-3xl font-bold font-inter leading-9">
                    {Number(summary.averageRating).toFixed(1)}
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
              className="flex-1 min-h-[112px] sm:min-h-0 sm:h-full shadow-none flex flex-col justify-center px-6 sm:px-0 sm:block relative overflow-hidden"
              padding="p-0"
            >
              <div className="flex flex-col w-full overflow-hidden sm:absolute sm:top-[25px] sm:left-[25px] sm:pr-6">
                <span className="text-gray-400 text-sm font-bold font-inter leading-5 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  Top Category
                </span>
                <span className="text-blue-500 text-3xl font-bold font-lexend leading-9 truncate w-full">
                  {summary.topCategory}
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="w-full py-2 flex items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 sm:flex-auto">
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

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-block text-gray-400 text-sm font-bold font-inter">
              Sort by:
            </span>
            <div className="relative">
              <div
                className="w-10 sm:w-40 h-9 sm:h-11 bg-white/5 sm:rounded-2xl rounded-xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-center sm:justify-between px-0 sm:px-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="hidden sm:block text-white text-sm font-inter whitespace-nowrap overflow-hidden text-ellipsis">
                  {sortBy}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isSortOpen && (
                <div className="absolute top-full mt-2 w-40 sm:w-40 right-0 bg-gray-800 rounded-xl outline outline-1 outline-white/10 shadow-lg overflow-hidden z-20">
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

        {/* Review Cards List */}
        <div className="flex flex-col gap-4">
          {sortedReviews.length > 0 ? (
            sortedReviews
              .slice(0, visibleCount)
              .map((review) => (
                <ReviewHistoryCard
                  key={review.id}
                  review={review}
                  onDelete={handleDeleteClick}
                />
              ))
          ) : (
            <div className="text-gray-400 text-sm font-inter text-center py-8">
              No reviews found.
            </div>
          )}
        </div>

        {/* Load More Button */}
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
