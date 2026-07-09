import { useState, useEffect } from "react";
import { getMyReviews, deleteReview } from "../../services/reviewService";

export const tabs = ["All Reviews", "Boarding", "Food/Cafe", "Services"];
export const sortOptions = ["Newest First", "Oldest First", "Highest Rating", "Lowest Rating"];

export const useMyReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ totalReviews: 0, averageRating: 0, topCategory: "—" });
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchReviewsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorStatus(null);
      const data = await getMyReviews();
      setReviews(data.reviews || []);
      setSummary(data.summary || { totalReviews: 0, averageRating: 0, topCategory: "—" });
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

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "All Reviews") return true;
    if (activeTab === "Boarding" && review.category === "BOARDING") return true;
    if (activeTab === "Food/Cafe" && review.category === "FOOD") return true;
    if (activeTab === "Services" && review.category === "SELF_EMPLOYED") return true;
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
    reviews,
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
  };
};
