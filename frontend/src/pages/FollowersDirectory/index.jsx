import React from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import NotFound from "../NotFound";
import { useFollowersDirectory } from "./useFollowersDirectory";
import FollowerCard from "./FollowerCard";

const FollowersDirectory = () => {
  const { followers, totalFollowers, isLoading, isLoadingMore, hasMore, error, errorStatus, sidebarUser, handleLoadMore } = useFollowersDirectory();

  if (errorStatus) return <NotFound status={errorStatus} />;

  return (
    <MainLayout user={sidebarUser} pageTitle="Profile">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 mb-8 mt-2">
          <h1 className="text-white text-3xl font-bold font-inter leading-9">Followers Directory</h1>
          <p className="text-slate-400 text-base font-normal font-inter leading-5 max-w-[672px]">
            Manage and view the {isLoading ? "..." : totalFollowers} students currently following your club updates and events.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8"><p className="text-red-400 text-sm font-inter">{error}</p></div>
        )}

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400 font-inter">Loading followers...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6 mb-8 flex-1 content-start">
              {followers.length > 0 ? (
                followers.map((follower) => <FollowerCard key={follower.id} follower={follower} />)
              ) : (
                <div className="col-span-1 xl:col-span-2 text-center py-12 text-slate-400">No followers to display yet.</div>
              )}
            </div>

            {hasMore && followers.length > 0 && (
              <div className="mt-auto">
                {isLoadingMore ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
                ) : (
                  <LoadMoreButton visibleCount={followers.length} totalCount={totalFollowers} onClick={handleLoadMore} itemName="Followers" />
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
