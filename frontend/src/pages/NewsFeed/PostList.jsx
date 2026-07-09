import React from 'react';
import { Loader2 } from 'lucide-react';
import PostCard from '../../components/feed/PostCard';
import { formatTimeAgo, getImageUrl } from '../../utils/formatters';

const PostList = ({ posts, loading, error, onRetry, postRefs, user }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                <p className="text-text-secondary animate-pulse">Fetching latest updates...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-state-error/10 border border-state-error/20 rounded-2xl p-6 text-center">
                <p className="text-state-error font-semibold">{error}</p>
                {onRetry && (
                    <button onClick={onRetry} className="mt-4 text-sm text-text-secondary hover:text-white underline">
                        Try again
                    </button>
                )}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-text-secondary">No posts to show right now.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {posts.map((post) => (
                <div key={`${post.postType}-${post.id}`} ref={(el) => (postRefs.current[`${post.postType}-${post.id}`] = el)}>
                    <PostCard
                        post={post}
                        author={post.author?.name || 'Unknown User'}
                        authorAvatar={post.author?.avatar}
                        authorInitial={post.author?.name?.charAt(0) || '?'}
                        time={formatTimeAgo(post.createdAt)}
                        title={post.title || post.name}
                        location={post.location || post.pickupNote}
                        description={post.description}
                        image={getImageUrl(post.coverImage || post.image || post.images?.[0])}
                        likes={post.likesCount || 0}
                        comments={post.commentsCount || 0}
                        initialIsLiked={post.isLiked}
                        initialIsSaved={post.isSaved}
                        isPromoted={post.isPromoted}
                        boostMeta={post.boostMeta}
                        showBoost={user.role === 'business'}
                    />
                </div>
            ))}
        </div>
    );
};

export default PostList;
