import React, { useState } from "react";
import PostCard from "../../feed/PostCard";

/**
 * RecentPostsSection — displays a feed of posts with a "Show more" toggle.
 * Initially shows 2 posts.
 */
const RecentPostsSection = ({ posts = [] }) => {
  const [showAll, setShowAll] = useState(false);

  if (!posts || posts.length === 0) return null;

  const visiblePosts = showAll ? posts : posts.slice(0, 2);

  return (
    <div className="flex flex-col gap-md">
      {/* Title */}
      <h3 className="text-body-large-bold text-text-primary px-xs">
        Recent Post
      </h3>

      {/* Posts List */}
      <div className="flex flex-col gap-lg">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      {/* Show More toggle */}
      {posts.length > 2 && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-body-small-bold text-primary-blue hover:text-primary-blue/80 transition-colors"
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentPostsSection;
