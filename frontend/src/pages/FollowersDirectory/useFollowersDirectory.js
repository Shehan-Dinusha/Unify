import { useState, useEffect } from "react";
import { getClubFollowers as getFollowers } from "../../services/followerService";

const ITEMS_PER_PAGE = 14;

export const useFollowersDirectory = () => {
  const [followers, setFollowers] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => { fetchInitialFollowers(); }, []);

  const fetchInitialFollowers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFollowers(1, ITEMS_PER_PAGE);
      setFollowers(data.followers);
      setTotalFollowers(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      if (err.response?.status === 403) setErrorStatus(err.response.status);
      else { setError("Failed to load followers. Please try again later."); }
    } finally { setIsLoading(false); }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await getFollowers(nextPage, ITEMS_PER_PAGE);
      setFollowers((prev) => [...prev, ...data.followers]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      // intentionally empty
    } finally { setIsLoadingMore(false); }
  };

  const sidebarUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      const role = localStorage.getItem("role");
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return { name: parsed.name || "User", role: role || "club", displayRole: parsed.displayRole || role || "Club" };
      }
    } catch {
      // intentionally empty
    }
    return { name: "User", role: "club", displayRole: "Club" };
  })();

  return { followers, totalFollowers, isLoading, isLoadingMore, hasMore, error, errorStatus, sidebarUser, handleLoadMore };
};
