import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import FoodCafeCard from "../../components/marketplace/FoodCafeCard";
import postService from "../../services/postService";
import { formatTimeAgo } from "../../utils/formatters";
import { getCurrentUser } from "../../services/authService";

const FoodCafe = () => {
    const user = getCurrentUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const headerRight = (
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search size={22} className="text-text-secondary" />
        </button>
    );

    useEffect(() => {
        const fetchFoodFeed = async () => {
            try {
                setLoading(true);
                const data = await postService.getFeed("food-cafe");
                const mappedPosts = data.feed.map(post => ({
                    ...post,
                    time: formatTimeAgo(post.createdAt),
                }));
                setPosts(mappedPosts);
            } catch (err) {
                // intentionally empty
            } finally {
                setLoading(false);
            }
        };

        fetchFoodFeed();
    }, []);

    return (
        <MainLayout user={user} pageTitle="Food & Cafe" headerRight={headerRight} verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2xl">
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Loading cafes...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <FoodCafeCard
                                key={`${post.postType}-${post.id}`}
                                post={post}
                                onClick={() => {}}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-text-secondary">No food or cafe posts found.</p>
                        </div>
                    )}
                </div>
                <div className="hidden xl:block"></div>
            </div>
        </MainLayout>
    );
};

export default FoodCafe;
