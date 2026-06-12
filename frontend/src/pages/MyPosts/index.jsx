import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PostCard from "../../components/feed/PostCard";
import postService from "../../services/postService";
import { getCurrentUser } from "../../services/authService";
import { Loader2, LayoutGrid } from "lucide-react";
import { formatTimeAgo, getImageUrl } from "../../utils/formatters";

const MyPosts = () => {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter");

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = getCurrentUser();

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getMyPosts();
            setPosts(data.feed || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch my posts:", err);
            setError("Could not load your posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    // Apply filtering
    const filteredPosts = filter === "boosted" 
        ? posts.filter(p => p.isPromoted)
        : posts;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                    <p className="text-text-secondary font-medium">Loading your posts...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 mx-auto max-w-2xl px-6">
                    <p className="text-state-error text-lg font-semibold">{error}</p>
                    <button
                        onClick={fetchMyPosts}
                        className="mt-4 text-primary-blue hover:underline font-medium"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (filteredPosts.length === 0) {
            return (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mx-auto max-w-2xl px-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutGrid className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <p className="text-text-secondary text-xl font-bold">
                        {filter === "boosted" ? "No boosted posts found" : "No posts yet"}
                    </p>
                    <p className="text-text-tertiary text-sm mt-2 max-w-sm mx-auto">
                        {filter === "boosted" 
                            ? "You haven't promoted any posts yet. Select a post and click Boost to get started!"
                            : "You haven't shared anything with the community yet. Start by creating a post from your dashboard!"}
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-6 w-full">
                {filteredPosts.map((post) => (
                    <PostCard
                        key={`${post.postType}-${post.id}`}
                        post={post}
                        author={post.author?.name || "Unknown User"}
                        authorInitial={post.author?.name?.charAt(0) || "?"}
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
                        isManagementMode={true}
                        onPostUpdate={fetchMyPosts}
                    />
                ))}
            </div>
        );
    };

    return (
        <MainLayout
            user={user}
            pageTitle={filter === "boosted" ? "Boosted Posts" : "My Posts"}
            verificationCount={0}
        >
            <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-heading-medium text-text-primary">
                            {filter === "boosted" ? "Boosted Posts" : "My Posts"}
                        </h1>
                        <p className="text-text-secondary text-sm">
                            {filter === "boosted" 
                                ? "Manage your promoted listings and track performance"
                                : "Manage everything you've shared on Unify"}
                        </p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">Total</span>
                        <p className="text-text-primary text-xl font-bold">{filteredPosts.length}</p>
                    </div>
                </div>

                {renderContent()}
            </div>
        </MainLayout>
    );
};

export default MyPosts;
