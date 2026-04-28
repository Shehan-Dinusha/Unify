import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateNormalPostForm from "../components/marketplace/CreateNormalPostForm";
import { useNavigate } from "react-router-dom";
import postService from "../services/postService";

const CreateNormalPostPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "club", // This would be dynamic in real app
        displayRole: "Clubs & Societies"
    };

    const handlePublish = async (postData, images) => {
        try {
            const data = new FormData();
            data.append("description", postData.description);
            
            // Map user role to postType
            // roles: club, food_cafe_owner, services_owner, boarding_owner
            // postTypes: club, food-cafe, service, boarding
            let postType = "club";
            if (user.role === "food_cafe_owner") postType = "food-cafe";
            else if (user.role === "services_owner") postType = "service";
            else if (user.role === "boarding_owner") postType = "boarding";
            
            data.append("postType", postType);
            
            images.forEach(img => {
                if (img.file) {
                    data.append("images", img.file);
                }
            });

            await postService.createPost("normal", data);
            
            // Navigate back based on role
            if (user.role === "club") navigate("/club-owner/marketplace");
            else if (user.role === "boarding_owner") navigate("/boarding-owner/marketplace");
            else if (user.role === "food_cafe_owner") navigate("/food-cafe-owner/marketplace");
            else if (user.role === "services_owner") navigate("/services-owner/marketplace");
            else navigate("/");
        } catch (error) {
            console.error("Failed to publish post:", error);
            throw error;
        }
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Normal Post"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto">
                <CreateNormalPostForm
                    onCancel={() => navigate(-1)}
                    onPublish={handlePublish}
                />
            </div>
        </MainLayout>
    );
};

export default CreateNormalPostPage;
