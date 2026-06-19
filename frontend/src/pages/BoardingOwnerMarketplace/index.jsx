import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import BoardingPostCard from "../../components/boarding/BoardingPostCard";
import BoardingFilters from "../../components/boarding/BoardingFilters";
import BoardingOverlay from "../../components/boarding/BoardingOverlay";
import postService from "../../services/postService";
import { formatTimeAgo } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "../../services/authService";

const BoardingOwnerMarketplace = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ minPrice: 5000, maxPrice: 30000, gender: "Any" });
    const [selectedPost, setSelectedPost] = useState(null);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const data = await postService.getFilteredBoardingFeed(filters);
            const mappedPosts = data.feed.map(post => ({
                ...post,
                time: formatTimeAgo(post.createdAt),
            }));
            setPosts(mappedPosts);
        } catch (err) {
            console.error("Failed to fetch boarding feed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [filters]);

    const headerRight = (
        <button
            onClick={() => navigate("/boarding-owner/create-post")}
            className="bg-primary-blue text-white px-6 py-2 rounded-full font-inter font-bold text-body-medium hover:brightness-110 transition-all shadow-custom"
        >
            Create Post
        </button>
    );

    return (
        <MainLayout
            user={user}
            pageTitle="Boarding"
            verificationCount={0}
            headerRight={headerRight}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2xl">
                {/* Feed */}
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Loading your boarding listings...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <BoardingPostCard
                                key={`${post.postType || "boarding"}-${post.id}`}
                                post={post}
                                onClick={() => setSelectedPost(post)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <span className="text-4xl mb-4">🏠</span>
                            <p className="text-body-large-bold text-text-primary mb-2">No listings found</p>
                            <p className="text-body-medium text-text-tertiary">
                                {posts.length === 0
                                    ? 'Click "Create Post" to add your first boarding listing!'
                                    : "Try adjusting your filters."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Filters sidebar */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <BoardingFilters onFilterChange={setFilters} />
                </div>
            </div>

            {/* Post Overlay */}
            {selectedPost && (
                <BoardingOverlay
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </MainLayout>
    );
};

export default BoardingOwnerMarketplace;
