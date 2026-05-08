import React, { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import LoadMoreButton from "../components/common/LoadMoreButton";
import { getClubFollowers as getFollowers } from "../services/followerService";
import Avatar from "../components/common/Avatar";
import NotFound from "./NotFound";
const ITEMS_PER_PAGE = 14;

const FollowerCard = ({ follower }) => {
  return (
    <div className="w-full h-20 px-4 py-4 relative bg-white/5 rounded-2xl flex justify-between items-center border border-white/20 hover:bg-white/10 transition-colors">
      <div className="flex justify-start items-center gap-4">
        <Avatar
          className="w-10 h-10 relative rounded-full shadow-[0px_0px_0px_2px_rgba(28,35,51,1.00),_0px_0px_0px_4px_rgba(43,108,238,0.20)] object-cover"
          src={follower.avatar}
          alt={follower.name}
        />
        <div className="flex flex-col justify-start items-start overflow-hidden">
          <div className="text-white text-sm font-bold font-inter leading-5 truncate">
            {follower.name}
          </div>
        </div>
      </div>

      <button
        className="w-12 h-10 bg-blue-600/10 hover:bg-blue-600/20 transition-colors rounded-full flex justify-center items-center group cursor-pointer border-none outline-none"
        aria-label={`Message ${follower.name}`}
      >
        <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
      </button>
    </div>
  );
};

const FollowersDirectory = () => {
  const [followers, setFollowers] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    fetchInitialFollowers();
  }, []);

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
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setErrorStatus(err.response.status);
      } else {
        setError("Failed to load followers. Please try again later.");
        console.error("Error fetching followers:", err);
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
      const data = await getFollowers(nextPage, ITEMS_PER_PAGE);

      setFollowers((prev) => [...prev, ...data.followers]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more followers:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (errorStatus) {
    return <NotFound status={errorStatus} />;
  }

  return (
    <MainLayout
      user={{
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies",
      }}
      pageTitle="Profile"
      verificationCount={3}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-8 mt-2">
          <h1 className="text-white text-3xl font-bold font-inter leading-9">
            Followers Directory
          </h1>
          <p className="text-slate-400 text-base font-normal font-inter leading-5 max-w-[672px]">
            Manage and view the {isLoading ? "..." : totalFollowers} students
            currently following your club updates and events.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8">
            <p className="text-red-400 text-sm font-inter">{error}</p>
          </div>
        )}

        {/* Followers Grid or Loading State */}
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400 font-inter">
              Loading followers...
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6 mb-8 flex-1 content-start">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <FollowerCard key={follower.id} follower={follower} />
                ))
              ) : (
                <div className="col-span-1 xl:col-span-2 text-center py-12 text-slate-400">
                  No followers to display yet.
                </div>
              )}
            </div>

            {/* Load More Button - Only show if there's more data */}
            {hasMore && followers.length > 0 && (
              <div className="mt-auto">
                {isLoadingMore ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <LoadMoreButton
                    visibleCount={followers.length}
                    totalCount={totalFollowers}
                    onClick={handleLoadMore}
                    itemName="Followers"
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default FollowersDirectory;
