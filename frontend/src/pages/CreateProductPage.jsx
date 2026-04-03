import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateProductForm from "../components/marketplace/CreateProductForm";
import { useNavigate } from "react-router-dom";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const user = { 
        name: "Alex Johnson", 
        role: "club", 
        displayRole: "Clubs & Societies" 
    };

    return (
        <MainLayout 
            user={user} 
            pageTitle="Create New Product" 
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto">
                <CreateProductForm 
                    onCancel={() => navigate("/club-owner/marketplace")} 
                    onPublish={() => {
                        console.log("Publishing product...");
                        navigate("/club-owner/marketplace");
                    }} 
                />
            </div>
        </MainLayout>
    );
};

export default CreateProductPage;
