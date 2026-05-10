import React, { useState, useEffect, useRef } from "react";
import { Bookmark, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PostCard from "../components/feed/PostCard";
import { useSavedPosts } from "../context/SavedPostsContext";
import { getCurrentUser } from "../services/authService";

/* ─── My Saved Posts Page ─────────────────────────────────────── */
const MySavedPosts = () => {
  const navigate = useNavigate();
  const { savedPosts } = useSavedPosts();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const searchInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentUser) return null;

  const user = {
    name: currentUser.name || "Unknown User",
    role: currentUser.role?.toLowerCase() || "student",
    avatar: currentUser.avatar,
  };

  // Auto-focus search input when search bar opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Filter posts based on search query
  const filteredPosts = searchQuery.trim()
    ? savedPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedPosts;

  // Custom header right content with search toggle
  const headerRight = (
    <div className="flex items-center gap-2">
      {showSearch && (
        <div className="flex items-center bg-dark-2 border border-primary-blue/30 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 duration-200">
          <Search size={16} className="text-text-secondary mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search saved posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-text-secondary outline-none w-48 sm:w-64"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="ml-1 text-text-secondary hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <button
        onClick={() => {
          setShowSearch(!showSearch);
          if (showSearch) setSearchQuery("");
        }}
        className={`p-2 flex items-center justify-center shrink-0 rounded-full transition-colors ${
          showSearch ? "bg-primary-blue/20 text-primary-blue" : "hover:bg-white/5"
        }`}
      >
        {showSearch ? (
          <X size={20} className="text-primary-blue" />
        ) : (
          <img src="/icon_search.svg" alt="Search" className="w-6 h-6 opacity-70" />
        )}
      </button>
    </div>
  );

  return (
    <MainLayout user={user} pageTitle="Saved Posts" verificationCount={0} headerRight={headerRight}>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <p className="text-body-medium text-text-secondary">
            Your personal collection of bookmarked discussions and updates.
          </p>
        </div>

        {/* Search Results Info */}
        {searchQuery.trim() && savedPosts.length > 0 && (
          <div className="text-text-secondary text-sm -mt-2">
            {filteredPosts.length > 0
              ? `Showing ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `No saved posts found for "${searchQuery}"`}
          </div>
        )}

        {/* Content */}
        {savedPosts.length === 0 ? (
          /* Empty State - No Saves At All */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-5">
              <Bookmark size={36} className="text-primary-blue" />
            </div>
            <h2 className="text-body-large-bold text-text-primary mb-2">No saved posts yet</h2>
            <p className="text-body-medium text-text-secondary max-w-sm mb-6">
              When you save posts from the News Feed, they'll appear here for easy access.
            </p>
            <button
              onClick={() => navigate("/news-feed")}
              className="px-6 py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white text-body-small-bold rounded-full transition-colors"
            >
              Browse News Feed
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State - Search returned nothing */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search size={28} className="text-text-tertiary" />
            </div>
            <h2 className="text-body-large-bold text-text-primary mb-1">No results matching "{searchQuery}"</h2>
            <p className="text-body-small text-text-secondary">Try adjusting your search terms.</p>
          </div>
        ) : (
          /* Saved Posts Feed */
          <div className="flex flex-col gap-6 max-w-[680px] w-full mx-auto">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={post.author?.name || post.author || "Unknown User"}
                authorAvatar={post.author?.avatar || null}
                authorInitial={
                  (post.author?.name || post.author || "?")?.charAt(0)
                }
                time={post.time || ""}
                title={post.title || post.name}
                location={post.location || post.pickupNote}
                description={post.description}
                image={post.coverImage || post.image || post.images?.[0]}
                likes={post.likesCount || 0}
                comments={post.commentsCount || 0}
                initialIsLiked={post.isLiked}
                initialIsSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MySavedPosts;
