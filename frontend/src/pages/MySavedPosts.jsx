import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import mockPosts from "../data/mockData";

/* ─── Compact Saved Post Card ─────────────────────────────────── */
const SavedPostCard = ({ post, onUnsave }) => {
  return (
    <div className="bg-dark-2 rounded-2xl overflow-hidden border border-white/5 font-inter text-white flex flex-col">
      {/* Image */}
      {post.image && (
        <div className="w-full h-[200px] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Author Row */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#7551FF] flex items-center justify-center text-white text-body-small-bold shrink-0">
            {post.authorInitial}
          </div>
          <span className="text-body-small-bold text-text-primary truncate">
            {post.author}
          </span>
        </div>

        {/* Description */}
        <p className="text-body-small text-text-secondary leading-relaxed line-clamp-3">
          {post.description}
        </p>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Stats */}
          <div className="flex items-center gap-4 text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <Heart size={16} strokeWidth={1.5} />
              <span className="text-body-extra-small">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={16} strokeWidth={1.5} />
              <span className="text-body-extra-small">{post.comments}</span>
            </div>
          </div>

          {/* Unsave Button */}
          <button
            onClick={() => onUnsave(post)}
            className="flex items-center gap-1.5 bg-primary-blue/15 hover:bg-primary-blue/25 text-primary-blue px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <Bookmark size={14} className="fill-current" />
            <span className="text-body-extra-small-bold">Unsave</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── My Saved Posts Page ─────────────────────────────────────── */
const MySavedPosts = () => {
  const navigate = useNavigate();
  const [displayedPosts, setDisplayedPosts] = useState(mockPosts);

  const user = {
    name: "Alex Johnson",
    role: "student",
  };

  const handleUnsave = (post) => {
    setDisplayedPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <MainLayout user={user} pageTitle="Saved Posts" verificationCount={0}>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <p className="text-body-medium text-text-secondary">
            Your personal collection of bookmarked discussions and updates.
          </p>
        </div>

        {/* Content */}
        {displayedPosts.length === 0 ? (
          /* Empty State */
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
        ) : (
          /* Saved Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayedPosts.map((post) => (
              <SavedPostCard
                key={post.id}
                post={post}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MySavedPosts;
