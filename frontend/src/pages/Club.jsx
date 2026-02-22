import React from "react";
import MainLayout from "../components/layout/MainLayout";
import ClubPostCard from "../components/club/ClubPostCard";
import TrendingNow from "../components/club/TrendingNow";
import { mockClubFeed, mockTrendingNow } from "../data/mockClubData";

const Club = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-2xl">
                {/* Feed */}
                <div className="flex flex-col gap-2xl">
                    {mockClubFeed.map((post) => (
                        <ClubPostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Trending */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <TrendingNow items={mockTrendingNow} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Club;
