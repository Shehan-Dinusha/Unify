import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateNormalPostForm from "../components/marketplace/CreateNormalPostForm";
import { useNavigate } from "react-router-dom";

const CreateNormalPostPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies"
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Normal Post"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto">
                <CreateNormalPostForm
                    onCancel={() => navigate("/club-owner/marketplace")}
                    onPublish={() => {
                        console.log("Submitting post...");
                        navigate("/club-owner/marketplace");
                    }}
                />
            </div>
        </MainLayout>
    );
};

export default CreateNormalPostPage;
