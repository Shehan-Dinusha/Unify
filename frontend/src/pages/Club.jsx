import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ClubPostCard from "../components/club/ClubPostCard";
import TrendingNow from "../components/club/TrendingNow";
import postService from "../services/postService";
import { getImageUrl, formatTimeAgo } from "../utils/formatters";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "../services/authService";

const Club = () => {
    const user = { getCurrentUser };
    const [posts, setPosts] = useState([]);
    const [trendingItems, setTrendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trendingLoading, setTrendingLoading] = useState(true);

    useEffect(() => {
        const fetchClubFeed = async () => {
            try {
                setLoading(true);
                const data = await postService.getFeed("club");
                // Map backend data to what ClubPostCard expects
                const mappedPosts = data.feed.map(post => ({
                    ...post,
                    id: post.id,
                    image: getImageUrl(post.coverImage || post.image || post.images?.[0]),
                    clubName: post.author?.name || "Unknown Club",
                    clubSeed: post.author?.name || "club",
                    authorAvatar: post.author?.avatar,
                    time: formatTimeAgo(post.createdAt),
                    category: post.category || "Club",
                    text: post.description,
                    price: post.price ? `Rs. ${post.price}` : null,
                    stats: { likes: post.likesCount || 0 },
                    comments: []
                }));
                setPosts(mappedPosts);
            } catch (err) {
                console.error("Failed to fetch club feed:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchTrending = async () => {
            try {
                setTrendingLoading(true);
                const data = await postService.getFeed("popular");
                const mappedTrending = data.feed.map(it => ({
                    id: it.id,
                    title: it.name || it.title,
                    subtitle: it.postType === "club-event" ? `${it.likesCount || 0} interested` : `Selling fast • Rs. ${it.price}`,
                    image: getImageUrl(it.coverImage || it.image || it.images?.[0]),
                    postType: it.postType
                }));
                setTrendingItems(mappedTrending);
            } catch (err) {
                console.error("Failed to fetch trending items:", err);
            } finally {
                setTrendingLoading(false);
            }
        };

        fetchClubFeed();
        fetchTrending();
    }, []);

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-2xl">
                {/* Feed */}
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Loading club updates...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <ClubPostCard key={`${post.postType}-${post.id}`} post={post} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-text-secondary">No club posts found.</p>
                        </div>
                    )}
                </div>

                {/* Trending */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <TrendingNow items={trendingItems} loading={trendingLoading} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Club;
