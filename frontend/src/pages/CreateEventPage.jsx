import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateEventForm from "../components/marketplace/CreateEventForm";
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies"
    };

    return (
        <MainLayout
            user={user}
            pageTitle="Create Club Event"
            verificationCount={0}
        >
            <div className="max-w-[1400px] mx-auto">
                <CreateEventForm
                    onCancel={() => navigate("/club-owner/marketplace")}
                    onPublish={() => {
                        console.log("Publishing event...");
                        navigate("/club-owner/marketplace");
                    }}
                />
            </div>
        </MainLayout>
    );
};

export default CreateEventPage;
