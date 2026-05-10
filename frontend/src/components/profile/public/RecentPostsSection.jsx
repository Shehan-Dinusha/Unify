import React, { useState } from "react";
import PostCard from "../../feed/PostCard";
import { formatTimeAgo, getImageUrl } from "../../../utils/formatters";

/**
 * RecentPostsSection — displays a feed of posts with a "Show more" toggle.
 * Initially shows 2 posts.
 */
const RecentPostsSection = ({ posts = [] }) => {
  const [showAll, setShowAll] = useState(false);

  if (!posts || posts.length === 0) return null;

  const visiblePosts = showAll ? posts : posts.slice(0, 2);

  return (
    <div className="flex flex-col gap-4 md:gap-md">
      {/* Title */}
      <h3 className="text-base md:text-body-large-bold text-text-primary px-1 md:px-xs">
        Recent Posts
      </h3>

      {/* Posts List */}
      <div className="flex flex-col gap-4 md:gap-lg">
        {visiblePosts.map((post) => {
          const displayImage = getImageUrl(
            post.coverImage || post.image || (post.images && post.images.length > 0 ? post.images[0] : null)
          );

          return (
            <PostCard
              key={post.id}
              post={post}
              author={post.author}
              authorAvatar={post.author?.avatar}
              time={post.createdAt ? formatTimeAgo(post.createdAt) : "just now"}
              title={post.title}
              location={post.location}
              description={post.content || post.description}
              image={displayImage}
              likes={post.likesCount || 0}
              comments={post.commentsCount || 0}
              initialIsLiked={post.isLiked}
              initialIsSaved={post.isSaved}
              isPromoted={post.isPromoted}
              boostMeta={post.boostMeta}
            />
          );
        })}
      </div>

      {/* Show More toggle */}
      {posts.length > 2 && (
        <div className="flex justify-center mt-3 md:mt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[13px] md:text-body-small-bold text-primary-blue hover:text-primary-blue/80 transition-colors font-semibold"
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentPostsSection;
