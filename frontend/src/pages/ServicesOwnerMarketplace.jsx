// src/pages/ServicesOwnerMarketplace.jsx
import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import FoodCafeCard from "../components/marketplace/FoodCafeCard";
import { mockServicesPosts } from "../data/mockServicesData";

const ServicesOwnerMarketplace = () => {
    const navigate = useNavigate();
    const user = { name: "Alex Johnson", role: "services_owner", displayRole: "Business & Organization" };

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
                    {mockServicesPosts.map((post) => (
                        <FoodCafeCard
                            key={post.id}
                            post={post}
                            onClick={() => console.log("Service clicked:", post.id)}
                        />
                    ))}
                </div>
                <div className="hidden xl:block"></div>
            </div>
        </MainLayout>
    );
};

export default ServicesOwnerMarketplace;
