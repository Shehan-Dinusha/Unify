import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import BoardingPostCard from "../components/boarding/BoardingPostCard";
import BoardingFilters from "../components/boarding/BoardingFilters";
import { mockBoardingFeed } from "../data/mockBoardingData";

const Boarding = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const [filters, setFilters] = useState({ minPrice: 450, maxPrice: 1200, gender: "Any" });

    // Parse price string like "$450/month" → 450
    const parsePriceNum = (priceStr) => {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const filteredFeed = mockBoardingFeed.filter((post) => {
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
                    {filteredFeed.length > 0 ? (
                        filteredFeed.map((post) => (
                            <BoardingPostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <span className="text-4xl mb-4">🏠</span>
                            <p className="text-body-large-bold text-text-primary mb-2">No listings found</p>
                            <p className="text-body-medium text-text-tertiary">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>

                {/* Filters sidebar */}
                <div className="hidden xl:block sticky top-0 h-fit">
                    <BoardingFilters onFilterChange={setFilters} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Boarding;
