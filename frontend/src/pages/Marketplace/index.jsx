import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CategoryTile from "../../components/marketplace/CategoryTile";
import PopularPostCard from "../../components/marketplace/PopularPostCard";
const CATEGORIES = [
    { id: "cat-services", title: "Services", subtitle: "Tutoring and more", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" },
    { id: "cat-merch", title: "Clubs' Merchandise", subtitle: "Official club gear", image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80" },
    { id: "cat-boardings", title: "Boardings", subtitle: "Find a place to stay", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80" },
    { id: "cat-food", title: "Food & Café", subtitle: "Discover campus eats", image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80" },
];
import postService from "../../services/postService";
import { getImageUrl } from "../../utils/formatters";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "../../services/authService";

const Marketplace = () => {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                setLoading(true);
                const data = await postService.getFeed("popular");
                // Map backend data to what PopularPostCard expects
                const mappedPosts = data.feed.map(post => ({
                    ...post,
                    image: getImageUrl(post.coverImage || post.image || post.images?.[0]),
                    title: post.title || post.name,
                }));
                setPopularPosts(mappedPosts);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    const headerRight = (
        <div className="text-body-small text-text-secondary hidden sm:block">
            <span className="text-text-primary font-bold">{popularPosts.length}</span> results
        </div>
    );

    return (
        <MainLayout user={user} pageTitle="Marketplace" headerRight={headerRight} verificationCount={0}>
            {/* Categories */}
            <div className="w-full">
                {/* Mobile/tablet: horizontal scroll. Desktop: can still scroll but will likely fit. */}
                <div className="-mx-lg">
                    <div
                        className="flex flex-nowrap gap-4 overflow-x-auto px-lg pb-2
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} className="shrink-0">
                                <CategoryTile
                                    title={cat.title}
                                    subtitle={cat.subtitle}
                                    image={cat.image}
                                    onClick={() => {
                                        if (cat.id === "cat-services") navigate("/marketplace/services");
                                        if (cat.id === "cat-merch") navigate("/marketplace/club");
                                        if (cat.id === "cat-boardings") navigate("/marketplace/boarding");
                                        if (cat.id === "cat-food") navigate("/marketplace/food-cafe");
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular */}
            <div className="mt-xl sm:mt-2xl">
                <div className="flex items-end justify-between gap-md mb-md">
                    <h2 className="text-body-large-bold sm:text-heading-small text-text-primary">
                        Popular Right now
                    </h2>

                    {/* Mobile results count */}
                    <div className="text-body-small text-text-secondary sm:hidden">
                        <span className="text-text-primary font-bold">{popularPosts.length}</span> results
                    </div>
                </div>

                <div className="-mx-lg">
                    <div
                        className="flex flex-nowrap gap-4 sm:gap-5 overflow-x-auto px-lg pb-2
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center w-full py-20">
                                <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
                            </div>
                        ) : popularPosts.length > 0 ? (
                            popularPosts.map((post) => (
                                <div
                                    key={`${post.postType}-${post.id}`}
                                    className="
                  shrink-0
                  w-[85vw] max-w-[420px]
                  sm:w-[420px]
                "
                                >
                                    <PopularPostCard post={post} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-10 text-center text-text-secondary">
                                No popular items found today.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Marketplace;