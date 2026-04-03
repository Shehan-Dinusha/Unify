import React from "react";
import MainLayout from "../components/layout/MainLayout";
import ClubPostCard from "../components/club/ClubPostCard";
import TrendingNow from "../components/club/TrendingNow";
import { mockClubFeed, mockTrendingNow } from "../data/mockClubData";
import CreatePostModal from "../components/marketplace/CreatePostModal";
import { useState } from "react";

const ClubOwnerMarketplace = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = { 
        name: "Alex Johnson", 
        role: "club", 
        displayRole: "Clubs & Societies" 
    };

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
                    {mockClubFeed.map((post) => (
                        <ClubPostCard key={post.id} post={post} isOwner={true} />
                    ))}
                </div>

                {/* Trending */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <TrendingNow items={mockTrendingNow} />
                </div>
            </div>

            <CreatePostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </MainLayout>
    );
};

export default ClubOwnerMarketplace;
