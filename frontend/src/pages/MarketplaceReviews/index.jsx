import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import {
  DeleteReviewModal,
  ReviewDeletedModal,
} from "../../components/common/ReviewModals";
import {
  getTargetReviews,
  submitReview,
  deleteReview,
  toggleReviewFeedback,
} from "../../services/reviewService";
import NotFound from "../NotFound";
import RatingSummary from "./RatingSummary";
import HasReviewedCard from "./HasReviewedCard";
import WriteReview from "./WriteReview";
import ReviewCard from "./ReviewCard";
import ReviewSubmittedModal from "./ReviewSubmittedModal";

const MarketplaceReviews = () => {
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: [],
  });
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const { targetId } = useParams();

  const fetchReviewsData = async () => {
    if (!targetId) return;
    try {
      setIsLoading(true);
      setError(null);
      setErrorStatus(null);
      const data = await getTargetReviews(targetId);
      setReviews(data.reviews || []);
      setSummary(
        data.summary || {
          averageRating: 0,
          totalReviews: 0,
          distribution: [],
        },
      );
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 400 ||
          err.response.status === 403 ||
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

  useEffect(() => {
    setVisibleCount(5);
  }, [sortBy]);

  // ── Scroll to a specific review (from notification) ─────────────────────
  const [searchParams] = useSearchParams();
  const initialScrollTarget = searchParams.get("scrollToReview");
  const [hasScrolled, setHasScrolled] = useState(false);
  const reviewRefs = useRef({});

  const setReviewRef = (reviewId) => (el) => {
    if (el) reviewRefs.current[reviewId] = el;
  };

  useEffect(() => {
    if (initialScrollTarget && reviews.length > 0 && !hasScrolled) {
      const idx = sortedReviews.findIndex((r) => String(r.id) === String(initialScrollTarget));
      if (idx >= 0 && idx >= visibleCount) {
        setVisibleCount(idx + 5);
      }
      setTimeout(() => {
        const el = reviewRefs.current[initialScrollTarget];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setHasScrolled(true);
      }, 300);
    }
  }, [initialScrollTarget, reviews, visibleCount, hasScrolled]);

  const sortOptions = [
    "Most Relevant",
    "Newest",
    "Highest Rating",
    "Lowest Rating",
  ];

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const hasSubmitted = reviews.some((r) => r.isOwn);

  const handleReviewSubmit = async ({ rating, review, isAnonymous }) => {
    if (!targetId) return;
    try {
      await submitReview({
        targetId: parseInt(targetId, 10),
        rating,
        review,
        isAnonymous,
      });
      setShowModal(true);
      await fetchReviewsData();
    } catch (error) {
      alert(
        "Failed to submit review. You might already have an active review.",
      );
    }
  };

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

  const handleFeedbackToggle = async (reviewId, action) => {
    try {
      const result = await toggleReviewFeedback(reviewId, action);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getSortedReviews = () => {
    let sortedList = [...reviews];

    if (sortBy !== "Newest") {
      sortedList = sortedList.sort((a, b) => {
        if (a.isOwn && !b.isOwn) return -1;
        if (!a.isOwn && b.isOwn) return 1;

        if (sortBy === "Highest Rating") return b.rating - a.rating;
        if (sortBy === "Lowest Rating") return a.rating - b.rating;
        return b.helpfulCount - a.helpfulCount;
      });
    } else {
      sortedList = sortedList.sort((a, b) => {
        if (a.isOwn && !b.isOwn) return -1;
        if (!a.isOwn && b.isOwn) return 1;
        return 0;
      });
    }

    return sortedList;
  };

  const sortedReviews = getSortedReviews();

  if (errorStatus) {
    return <NotFound status={errorStatus} />;
  }

  if (isLoading) {
    return (
      <MainLayout user={user} pageTitle="Marketplace" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading reviews...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout user={user} pageTitle="Marketplace" verificationCount={0}>
        <div className="w-full flex justify-center items-center h-64">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </MainLayout>
    );
  }

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
      <div className="w-full max-w-[1024px] mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-0 flex flex-col items-center gap-8 lg:gap-16">
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-12 w-full">
          {summary.totalReviews > 0 ? (
            <RatingSummary summary={summary} />
          ) : (
            <Card
              variant="card"
              className="w-full lg:w-96 h-[470px]"
            >
              <div className="flex flex-col justify-center items-center h-full text-gray-400">
                No reviews yet
              </div>
            </Card>
          )}
          {hasSubmitted ? (
            <HasReviewedCard />
          ) : (
            <WriteReview onSubmit={handleReviewSubmit} />
          )}
        </div>

        <div className="w-full max-w-[1000px] flex flex-col gap-6">
          <div className="pb-4 border-b border-gray-800 flex justify-between items-center w-full gap-4">
            <h2 className="text-white text-lg sm:text-xl font-bold font-inter whitespace-nowrap">
              {summary.totalReviews} Reviews
            </h2>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="hidden sm:inline text-gray-400 text-sm font-bold font-inter">
                Sort by:
              </span>
              <div className="relative">
                <div
                  className="w-32 sm:w-40 h-11 bg-white/5 rounded-2xl outline outline-1 outline-white/10 shadow-[inner_0px_2px_4px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-3 sm:px-4 cursor-pointer hover:bg-white/10 transition-colors"
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

          <div className="flex flex-col items-center gap-6 w-full">
            {sortedReviews.slice(0, visibleCount).map((review) => (
              <div
                key={review.id}
                ref={setReviewRef(review.id)}
                className={`w-full ${initialScrollTarget && String(initialScrollTarget) === String(review.id) ? 'scroll-mt-24' : ''}`}
              >
                <ReviewCard
                  review={review}
                  onDelete={handleDeleteClick}
                  onFeedback={handleFeedbackToggle}
                />
              </div>
            ))}
          </div>

          <LoadMoreButton
            visibleCount={visibleCount}
            totalCount={sortedReviews.length}
            onClick={() => setVisibleCount((prev) => prev + 5)}
            itemName="Reviews"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default MarketplaceReviews;
