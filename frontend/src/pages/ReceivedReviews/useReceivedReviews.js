import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getReceivedReviews,
  toggleOwnerLike,
  replyToReview,
} from "../../services/reviewService";

export const useReceivedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [metrics, setMetrics] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: 0,
      count: 0,
    })),
  });
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [scrollToReviewId, setScrollToReviewId] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const reviewRefs = useRef({});

  const [searchParams] = useSearchParams();
  const initialScrollTarget = searchParams.get("scrollToReview");

  const tabs = ["All Reviews", "Unreplied", "5 stars", "Critical"];
  const sortOptions = [
    "Newest First",
    "Oldest First",
    "Highest Rating",
    "Lowest Rating",
  ];

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchReviewsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorStatus(null);
      const data = await getReceivedReviews();
      setReviews(data.reviews || []);
      if (data.summary) {
        setMetrics(data.summary);
      }
    } catch (err) {
      if (err.response && (err.response.status === 403 || err.response.status === 404)) {
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
  }, [activeTab, sortBy]);

  const handleReply = async (reviewId, content) => {
    await replyToReview(reviewId, content);
    await fetchReviewsData();
  };

  const handleLike = async (reviewId) => {
    return await toggleOwnerLike(reviewId);
  };

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "All Reviews") return true;
    if (activeTab === "Unreplied") return !review.hasOwnerReplied;
    if (activeTab === "5 stars") return review.rating === 5;
    if (activeTab === "Critical") return review.rating < 3;
    return false;
  });

  const getSortedReviews = () => {
    let sortedList = [...filteredReviews];
    if (sortBy === "Highest Rating") {
      sortedList = sortedList.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Lowest Rating") {
      sortedList = sortedList.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "Oldest First") {
      sortedList = sortedList.reverse();
    }
    return sortedList;
  };

  const sortedReviews = getSortedReviews();

  const setReviewRef = (reviewId) => (el) => {
    if (el) reviewRefs.current[reviewId] = el;
  };

  // Scroll to the target review after data loads
  useEffect(() => {
    if (initialScrollTarget && sortedReviews.length > 0 && !hasScrolled) {
      setScrollToReviewId(initialScrollTarget);

      // Ensure the review is visible (increase visibleCount if needed)
      const idx = sortedReviews.findIndex((r) => String(r.id) === String(initialScrollTarget));
      if (idx >= 0 && idx >= visibleCount) {
        setVisibleCount(idx + 5);
      }

      // Scroll after render
      setTimeout(() => {
        const el = reviewRefs.current[initialScrollTarget];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setHasScrolled(true);
      }, 300);
    }
  }, [initialScrollTarget, sortedReviews, visibleCount, hasScrolled]);

  return {
    user,
    reviews, metrics,
    activeTab, setActiveTab,
    sortBy, setSortBy,
    isSortOpen, setIsSortOpen,
    isLoading, error, errorStatus,
    visibleCount, setVisibleCount,
    sortedReviews,
    tabs, sortOptions,
    handleReply, handleLike,
    scrollToReviewId,
    setReviewRef,
  };
};
