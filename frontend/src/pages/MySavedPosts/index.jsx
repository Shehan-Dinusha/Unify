import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/feed/PostCard";
import { formatTimeAgo, getImageUrl } from "../../utils/formatters";
import { useMySavedPosts } from "./useMySavedPosts";
import SearchBar from "./SearchBar";
import EmptyStates from "./EmptyStates";

const MySavedPosts = () => {
  const { navigate, user, showSearch, setShowSearch, searchQuery, setSearchQuery, searchInputRef, filteredPosts, savedPosts } = useMySavedPosts();

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

        {searchQuery.trim() && savedPosts.length > 0 && (
          <div className="text-text-secondary text-sm -mt-2">
            {filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `No saved posts found for "${searchQuery}"`}
          </div>
        )}

        {savedPosts.length === 0 || filteredPosts.length === 0 ? (
          <EmptyStates savedPosts={savedPosts} filteredPosts={filteredPosts} searchQuery={searchQuery} onBrowseFeed={() => navigate("/news-feed")} />
        ) : (
          <div className="flex flex-col gap-6 max-w-[680px] w-full mx-auto">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post}
                author={post.author?.name || post.author || "Unknown User"}
                authorAvatar={post.author?.avatar || null}
                authorInitial={(post.author?.name || post.author || "?")?.charAt(0)}
                time={post.createdAt ? formatTimeAgo(post.createdAt) : post.time || ""}
                title={post.title || post.name} location={post.location || post.pickupNote}
                description={post.description}
                image={getImageUrl(post.coverImage || post.image || post.images?.[0])}
                likes={post.likesCount || 0} comments={post.commentsCount || 0}
                initialIsLiked={post.isLiked} initialIsSaved={true} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MySavedPosts;
