// src/pages/FoodCafe.jsx

import React from "react";
import { Search } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import FoodCafeCard from "../components/marketplace/FoodCafeCard";
import { mockFoodCafePosts } from "../data/mockFoodCafeData";

const FoodCafe = () => {
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    const headerRight = (
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search size={22} className="text-text-secondary" />
        </button>
    );

    return (
        <MainLayout user={user} pageTitle="Food & Cafe" headerRight={headerRight} verificationCount={0}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2xl">
                <div className="flex flex-col gap-2xl">
                    {mockFoodCafePosts.map((post) => (
                        <FoodCafeCard
                            key={post.id}
                            post={post}
                            onClick={() => console.log("Post clicked:", post.id)}
                        />
                    ))}
                </div>
                <div className="hidden xl:block"></div>
            </div>
        </MainLayout>
    );
};

export default FoodCafe;
