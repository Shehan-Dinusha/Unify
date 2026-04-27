import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import FoodCafeCard from "../components/marketplace/FoodCafeCard";
import postService from "../services/postService";
import { formatTimeAgo } from "../utils/formatters";

const ServicesOwnerMarketplace = () => {
    const navigate = useNavigate();
    const user = { name: "Alex Johnson", role: "services_owner", displayRole: "Business & Organization" };
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            // "services" feed returns NormalPosts with category SELF_EMPLOYED
            const data = await postService.getFeed("services");
            const mappedPosts = data.feed.map(post => ({
                ...post,
                time: formatTimeAgo(post.createdAt),
            }));
            setPosts(mappedPosts);
        } catch (err) {
            console.error("Failed to fetch services feed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const headerRight = (
        <button 
            onClick={() => navigate("/services-owner/create-post")}
            className="bg-primary-blue text-white px-6 py-2 rounded-full font-inter font-bold text-body-medium hover:brightness-110 transition-all shadow-custom"
        >
            Create Post
        </button>
    );

    return (
        <MainLayout user={user} pageTitle="Services" headerRight={headerRight} verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2xl">
                <div className="flex flex-col gap-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
                            <p className="text-text-secondary">Loading your service posts...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <FoodCafeCard
                                key={`${post.postType || "service"}-${post.id}`}
                                post={post}
                                onClick={() => console.log("Service clicked:", post.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-text-secondary text-lg font-semibold">No posts yet.</p>
                            <p className="text-text-tertiary text-sm mt-2">Click "Create Post" to add your first service listing!</p>
                        </div>
                    )}
                </div>
                <div className="hidden xl:block"></div>
            </div>
        </MainLayout>
    );
};

export default ServicesOwnerMarketplace;
