import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Loader2,
  ChevronDown,
  UserCheck,
  UserPlus,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import LoadMoreButton from "../components/common/LoadMoreButton";
import Button from "../components/common/Button";
import {
  getFollowings,
  getSingleFollowing,
  unfollowOrganization,
} from "../services/followerService";

import Avatar from "../components/common/Avatar";
import NotFound from "./NotFound";

const ITEMS_PER_PAGE = 10; // Keeping 10 for demonstration

const FollowingCard = ({ following, onUnfollow }) => {
  const [isFollowing, setIsFollowing] = useState(true);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    if (isFollowing) {
      onUnfollow(following.id);
    }
  };

  return (
    <div className="w-full min-h-24 md:h-24 p-4 relative bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/20 flex flex-row items-center justify-between gap-2 md:gap-4 group">
      {/* Left side details */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 overflow-hidden min-w-0">
        {/* Avatar */}
        <div className="w-12 h-12 md:w-16 md:h-16 min-w-[48px] md:min-w-[64px] bg-gray-800 rounded-full border border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
          <Avatar
            className="w-full h-full object-cover"
            src={following.avatar}
            alt={following.name}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center items-start overflow-hidden w-full">
          <div className="flex items-center gap-3 mb-1 w-full">
            <h3 className="text-white text-sm md:text-base font-bold font-inter leading-4 md:leading-5 md:truncate w-full line-clamp-2 md:line-clamp-none max-w-[160px] sm:max-w-[200px] md:max-w-xs">
              {following.name}
            </h3>
          </div>
          {/* Hide description entirely on mobile, show on tablet and up */}
          <p className="hidden md:block text-gray-400 text-sm font-normal font-inter leading-5 w-full line-clamp-2 md:truncate">
            {following.description}
          </p>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center justify-end gap-3 shrink-0">
        <button
          className="w-11 h-11 md:w-10 md:h-10 bg-blue-600/10 hover:bg-blue-600/20 transition-colors rounded-full flex justify-center items-center group/btn cursor-pointer border-none outline-none"
          aria-label={`Message ${following.name}`}
        >
          <MessageSquare className="w-5 h-5 text-blue-500 group-hover/btn:text-blue-400" />
        </button>

        {/* Desktop Button: Text and Icon */}
        <div className="hidden md:block">
          <Button
            onClick={handleFollowClick}
            variant={isFollowing ? "secondary" : "primary"}
            size="small"
            icon={isFollowing ? UserCheck : UserPlus}
            className="!h-9 !px-4 !rounded-2xl gap-2"
          >
            <span className="text-base font-bold font-inter leading-5">
              {isFollowing ? "Following" : "Follow"}
            </span>
          </Button>
        </div>

        {/* Mobile Button: Icon only */}
        <div className="md:hidden">
          <Button
            onClick={handleFollowClick}
            variant={isFollowing ? "secondary" : "primary"}
            iconOnly={true}
            icon={isFollowing ? UserCheck : UserPlus}
            size="medium"
            className="!w-11 !h-11 !p-0 !min-w-[44px] shrink-0"
            aria-label={isFollowing ? "Unfollow" : "Follow"}
          />
        </div>
      </div>
    </div>
  );
};

const Followings = () => {
  const [followings, setFollowings] = useState([]);
  const [totalFollowings, setTotalFollowings] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const [sortOrder, setSortOrder] = useState("asc");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    fetchInitialFollowings();
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
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setErrorStatus(err.response.status);
      } else {
        setError("Failed to load followings. Please try again later.");
        console.error("Error fetching followings:", err);
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
      console.error("Error loading more followings:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSortChange = async (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);

    // Changing global sort order requires a fresh page reload from the server to accurately reflect the DB
    setIsLoading(true);
    try {
      const data = await getFollowings(1, ITEMS_PER_PAGE, order);
      setFollowings(data.followings);
      setTotalFollowings(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      console.error("Error updating sort:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = (idToRemove) => {
    // Tiny delay to make the "Follow" state briefly visible before disappearing
    setTimeout(async () => {
      // Optimistic visual update
      let newLength = 0;
      setFollowings((prev) => {
        const nextList = prev.filter((item) => item.id !== idToRemove);
        newLength = nextList.length;
        return nextList;
      });
      setTotalFollowings((prev) => Math.max(0, prev - 1));

      try {
        // Call API to remove
        await unfollowOrganization(idToRemove);

        // Fetch exactly 1 item seamlessly to fill the layout gap
        const nextItem = await getSingleFollowing(newLength, sortOrder);

        if (nextItem) {
          setFollowings((latestPrev) => {
            // Prevent duplicates in case of race conditions
            if (latestPrev.find((i) => i.id === nextItem.id)) return latestPrev;
            return [...latestPrev, nextItem];
          });
        }
      } catch (err) {
        console.error("Error refetching after unfollow:", err);
      }
    }, 500);
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case "asc":
        return "Name (A-Z)";
      case "desc":
        return "Name (Z-A)";
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      default:
        return "Name (A-Z)";
    }
  };

  if (errorStatus) {
    return <NotFound status={errorStatus} />;
  }

  return (
    <MainLayout
      user={{
        name: "Alex Johnson",
        role: "student",
        displayRole: "Student",
      }}
      pageTitle="Profile"
      verificationCount={3}
    >
      <div className="flex flex-col h-full mx-auto w-full relative max-w-[1000px] px-4 md:px-0">
        {/* Background glow effect as per design */}
        <div className="w-64 h-64 md:w-96 md:h-96 absolute right-[-50px] md:right-[-200px] top-[200px] md:top-[400px] bg-purple-800/20 rounded-full blur-3xl pointer-events-none z-[-1]" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-blue-500/20 w-full pt-4 md:pt-4 mb-6 gap-4 md:gap-0">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-white text-2xl md:text-3xl font-bold font-inter leading-8 md:leading-9">
                Following
              </h1>
              <div className="px-3 py-1 bg-blue-600/10 rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-xs md:text-sm font-bold font-lexend leading-4 md:leading-5">
                  {isLoading ? "..." : totalFollowings}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-normal font-inter leading-5 w-full max-w-[600px]">
              Manage the organizations you follow and stay updated with their
              latest activities.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2 md:mb-2 relative mt-2 md:mt-0">
            <span className="text-gray-400 text-sm font-normal font-inter leading-5 whitespace-nowrap">
              Sort by:
            </span>
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="h-9 px-4 flex items-center justify-between bg-white/5 rounded-2xl border border-white/10 w-full md:w-48 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-xs md:text-xs font-bold font-inter leading-5 truncate mr-2">
                {getSortLabel()}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute top-11 right-0 w-full md:w-48 bg-[#1C2333] border border-white/10 rounded-2xl shadow-xl z-20 overflow-hidden flex flex-col">
                <button
                  onClick={() => handleSortChange("newest")}
                  className={`text-left px-4 py-3 text-sm font-inter hover:bg-white/5 transition-colors border-b border-white/5 ${
                    sortOrder === "newest" ? "text-blue-500" : "text-gray-300"
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSortChange("oldest")}
                  className={`text-left px-4 py-3 text-sm font-inter hover:bg-white/5 transition-colors border-b border-white/5 ${
                    sortOrder === "oldest" ? "text-blue-500" : "text-gray-300"
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => handleSortChange("asc")}
                  className={`text-left px-4 py-3 text-sm font-inter hover:bg-white/5 transition-colors border-b border-white/5 ${
                    sortOrder === "asc" ? "text-blue-500" : "text-gray-300"
                  }`}
                >
                  Name (A-Z)
                </button>
                <button
                  onClick={() => handleSortChange("desc")}
                  className={`text-left px-4 py-3 text-sm font-inter hover:bg-white/5 transition-colors ${
                    sortOrder === "desc" ? "text-blue-500" : "text-gray-300"
                  }`}
                >
                  Name (Z-A)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error handling */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8">
            <p className="text-red-400 text-sm font-inter">{error}</p>
          </div>
        )}

        {/* List Section */}
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400 font-inter">
              Loading followings...
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-10 w-full flex-1">
            {followings.length > 0 ? (
              followings.map((following) => (
                <FollowingCard
                  key={following.id}
                  following={following}
                  onUnfollow={handleUnfollow}
                />
              ))
            ) : (
              <div className="w-full text-center py-12 text-slate-400 bg-white/5 rounded-2xl border border-white/10 px-4">
                You aren't following anyone yet.
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && followings.length > 0 && !isLoading && (
          <div className="pb-12 flex justify-center w-full">
            {isLoadingMore ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              <LoadMoreButton
                visibleCount={followings.length}
                totalCount={totalFollowings}
                onClick={handleLoadMore}
                itemName="Followings"
              />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Followings;
