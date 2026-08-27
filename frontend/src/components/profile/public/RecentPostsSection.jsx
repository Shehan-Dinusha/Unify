import React from "react";
import PostCard from "../../feed/PostCard";
import { formatTimeAgo, getImageUrl } from "../../../utils/formatters";

/**
 * RecentPostsSection — displays all posts from a user's profile in a scrollable feed.
 */
const RecentPostsSection = ({ posts = [] }) => {
  const hasPosts = posts && posts.length > 0;

  return (
    <div className="flex flex-col gap-4 md:gap-md">
      <h3 className="text-base md:text-body-large-bold text-text-primary px-1 md:px-xs">
        Posts
      </h3>

      {hasPosts ? (
        <div className="flex flex-col gap-4 md:gap-lg">
          {posts.map((post) => {
            const displayImage = getImageUrl(
              post.coverImage || post.image || (post.images && post.images.length > 0 ? post.images[0] : null)
            );

            return (
              <PostCard
                key={`${post.postType}-${post.id}`}
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
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <p className="text-text-secondary">No posts yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentPostsSection;
