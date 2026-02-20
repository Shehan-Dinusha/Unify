import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CategoryTile from "../components/marketplace/CategoryTile";
import PopularPostCard from "../components/marketplace/PopularPostCard";
import { mockMarketplaceCategories, mockPopularPosts } from "../data/mockMarketplaceData";

const Marketplace = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const navigate = useNavigate();

    const headerRight = (
        <div className="text-body-small text-text-secondary">
            <span className="text-text-primary font-bold">{mockPopularPosts.length}</span> results
        </div>
    );

    return (
        <MainLayout user={user} pageTitle="Marketplace" headerRight={headerRight} verificationCount={0}>
            <div className="flex items-center gap-lg">
                {mockMarketplaceCategories.map((cat) => (
                    <CategoryTile
                        key={cat.id}
                        title={cat.title}
                        subtitle={cat.subtitle}
                        image={cat.image}
                        onClick={() => {
                            if (cat.id === "cat-merch") navigate("/marketplace/club");
                        }}
                    />
                ))}
            </div>

            <div className="mt-2xl">
                <h2 className="text-body-large-bold text-text-primary mb-md">Popular Right now</h2>
                {/* Negative-margin rail so the scroll container reaches edge-to-edge */}
                <div className="-mx-lg">
                    <div className="flex flex-nowrap gap-5 overflow-x-auto px-lg pb-2
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {mockPopularPosts.map((post) => (
                            <PopularPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Marketplace;
