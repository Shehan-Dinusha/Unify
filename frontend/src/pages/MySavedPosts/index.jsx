import React from "react";
import { Loader2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/feed/PostCard";
import { formatTimeAgo, getImageUrl } from "../../utils/formatters";
import { useMySavedPosts } from "./useMySavedPosts";
import SearchBar from "./SearchBar";
import EmptyStates from "./EmptyStates";

const MySavedPosts = () => {
  const {
    navigate, user, loading,
    showSearch, setShowSearch,
    searchQuery, setSearchQuery, searchInputRef,
    filteredPosts, savedPosts,
  } = useMySavedPosts();

  if (!user) return null;

  return (
    <MainLayout user={user} pageTitle="Saved Posts" verificationCount={0}
      headerRight={
        <SearchBar searchInputRef={searchInputRef} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          showSearch={showSearch} setShowSearch={setShowSearch} />
      }>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-body-medium text-text-secondary">Your personal collection of bookmarked discussions and updates.</p>
        </div>

        {/* Loading state — shown while the backend refresh is in progress */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
            <p className="text-text-secondary animate-pulse">Loading your saved posts...</p>
          </div>
        )}

        {!loading && searchQuery.trim() && savedPosts.length > 0 && (
          <div className="text-text-secondary text-sm -mt-2">
            {filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `No saved posts found for "${searchQuery}"`}
          </div>
        )}

        {!loading && (savedPosts.length === 0 || filteredPosts.length === 0) ? (
          <EmptyStates savedPosts={savedPosts} filteredPosts={filteredPosts} searchQuery={searchQuery} onBrowseFeed={() => navigate("/news-feed")} />
        ) : null}

        {/* Post list — rendered exactly like PostList.jsx in the newsfeed */}
        {!loading && filteredPosts.length > 0 && (
          <div className="flex flex-col gap-6 max-w-[680px] w-full mx-auto">
            {filteredPosts.map((post) => (
              <div key={`${post.postType}-${post.id}`}>
                <PostCard
                  post={post}
                  author={post.author?.name || "Unknown User"}
                  authorAvatar={post.author?.avatar}
                  authorInitial={post.author?.name?.charAt(0) || "?"}
                  time={post.createdAt ? formatTimeAgo(post.createdAt) : ""}
                  title={post.title || post.name}
                  location={post.location || post.pickupNote}
                  description={post.description}
                  image={getImageUrl(post.coverImage || post.image || post.images?.[0])}
                  likes={post.likesCount || 0}
                  comments={post.commentsCount || 0}
                  initialIsLiked={post.isLiked}
                  initialIsSaved={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MySavedPosts;
