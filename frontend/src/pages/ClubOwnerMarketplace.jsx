import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ClubPostCard from "../components/club/ClubPostCard";
import TrendingNow from "../components/club/TrendingNow";
import CreatePostModal from "../components/marketplace/CreatePostModal";
import postService from "../services/postService";
import { getImageUrl, formatTimeAgo } from "../utils/formatters";
import { Loader2 } from "lucide-react";

const ClubOwnerMarketplace = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [trendingItems, setTrendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trendingLoading, setTrendingLoading] = useState(true);

    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies"
    };

    const fetchFeed = async () => {
        try {
            setLoading(true);
            // "club" feed returns: ClubProductPost + ClubEventPost + CLUB NormalPosts
            const data = await postService.getFeed("club");
            const mappedPosts = data.feed.map(post => ({
                ...post,
                id: post.id,
                image: getImageUrl(post.coverImage || post.images?.[0] || post.image),
                clubName: post.author?.name || "Your Club",
                clubSeed: post.author?.name || "club",
                time: formatTimeAgo(post.createdAt),
                category: post.category || (post.postType === "club-event" ? "Event" : "Product"),
                text: post.description,
                price: post.price ? `Rs. ${Number(post.price).toFixed(2)}` : null,
                stats: { likes: post.likesCount || 0 },
                comments: [],
            }));
            setPosts(mappedPosts);
        } catch (err) {
            console.error("Failed to fetch club owner feed:", err);
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

    useEffect(() => {
        fetchFeed();
        fetchTrending();
    }, []);

    const headerRight = (
        <div className="flex items-center gap-2">
            <button
                className="bg-primary-blue hover:bg-primary-blue/90 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                onClick={() => setIsModalOpen(true)}
            >
                Create Post
            </button>
            <button
                className="p-2 relative flex items-center justify-center shrink-0 hover:bg-white/5 rounded-full transition-colors"
                onClick={() => console.log("Search")}
            >
                <img
                    src="/icon_search.svg"
                    alt="Search"
                    className="w-6 h-6 opacity-70"
                />
            </button>
        </div>
    );

    return (
        <MainLayout
            user={user}
            pageTitle="Club"
            headerRight={headerRight}
            verificationCount={0}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-2xl">
                {/* Feed */}
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Loading club posts...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <ClubPostCard key={`${post.postType}-${post.id}`} post={post} isOwner={true} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-text-secondary text-lg font-semibold">No posts yet.</p>
                            <p className="text-text-tertiary text-sm mt-2">Click "Create Post" to publish your first product or event!</p>
                        </div>
                    )}
                </div>

                {/* Trending */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <TrendingNow items={trendingItems} loading={trendingLoading} />
                </div>
            </div>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    // Refresh feed after publishing a new post
                    fetchFeed();
                }}
            />
        </MainLayout>
    );
};

export default ClubOwnerMarketplace;
