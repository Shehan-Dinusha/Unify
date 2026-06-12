import { useState, useEffect } from "react";
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
  };
};
