import { useState, useEffect, useCallback } from 'react';
import { getFollowings, getSingleFollowing } from '../../services/followerService';

const ITEMS_PER_PAGE = 10;

export const useFollowings = () => {
  const [followings, setFollowings] = useState([]);
  const [totalFollowings, setTotalFollowings] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    fetchInitialFollowings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialFollowings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFollowings(1, ITEMS_PER_PAGE, sortOrder);
      setFollowings(data.followings);
      setTotalFollowings(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorStatus(err.response.status);
      } else {
        setError('Failed to load followings. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await getFollowings(nextPage, ITEMS_PER_PAGE, sortOrder);
      setFollowings((prev) => [...prev, ...data.followings]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      // intentionally empty
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSortChange = async (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
    setIsLoading(true);
    try {
      const data = await getFollowings(1, ITEMS_PER_PAGE, order);
      setFollowings(data.followings);
      setTotalFollowings(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      // intentionally empty
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = useCallback((idToRemove) => {
    let newLength = 0;
    setFollowings((prev) => {
      const nextList = prev.filter((item) => item.id !== idToRemove);
      newLength = nextList.length;
      return nextList;
    });
    setTotalFollowings((prev) => Math.max(0, prev - 1));
    getSingleFollowing(newLength, sortOrder).then((nextItem) => {
      if (nextItem) {
        setFollowings((latestPrev) => {
          if (latestPrev.find((i) => i.id === nextItem.id)) return latestPrev;
          return [...latestPrev, nextItem];
        });
      }
    });
  }, [sortOrder]);

  return {
    followings,
    totalFollowings,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    errorStatus,
    sortOrder,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    handleLoadMore,
    handleSortChange,
    handleUnfollow,
  };
};
