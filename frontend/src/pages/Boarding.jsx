import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import BoardingPostCard from "../components/boarding/BoardingPostCard";
import BoardingFilters from "../components/boarding/BoardingFilters";
import BoardingOverlay from "../components/boarding/BoardingOverlay";
import postService from "../services/postService";
import { formatTimeAgo } from "../utils/formatters";
import { Loader2 } from "lucide-react";

const Boarding = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 100000, gender: "Any" });
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchBoardingFeed = async () => {
            try {
                setLoading(true);
                const data = await postService.getFeed("boarding");
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

        fetchBoardingFeed();
    }, []);

    // Parse price string like "Rs. 4500" → 4500
    const parsePriceNum = (priceStr) => {
        if (!priceStr) return 0;
        if (typeof priceStr === "number") return priceStr;
        return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const filteredFeed = posts.filter((post) => {
        const price = parsePriceNum(post.price);
        const inPrice = price >= filters.minPrice && price <= filters.maxPrice;
        const inGender =
            filters.gender === "Any" ||
            post.gender === filters.gender ||
            post.gender === "Any";
        return inPrice && inGender;
    });

    return (
        <MainLayout user={user} pageTitle="Boarding" verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2xl">
                {/* Feed */}
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Finding available boardings...</p>
                        </div>
                    ) : filteredFeed.length > 0 ? (
                        filteredFeed.map((post) => (
                            <BoardingPostCard
                                key={`${post.postType}-${post.id}`}
                                post={post}
                                onClick={() => setSelectedPost(post)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <span className="text-4xl mb-4">🏠</span>
                            <p className="text-body-large-bold text-text-primary mb-2">No listings found</p>
                            <p className="text-body-medium text-text-tertiary">Try adjusting your filters or check back later.</p>
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

export default Boarding;

