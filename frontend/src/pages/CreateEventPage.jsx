import React from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateEventForm from "../components/marketplace/CreateEventForm";
import { useNavigate } from "react-router-dom";
import postService from "../services/postService";

const CreateEventPage = () => {
    const navigate = useNavigate();
    const user = {
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies"
    };

    const handlePublish = async (eventData, coverImage) => {
        try {
            const data = new FormData();
            data.append("name", eventData.name);
            data.append("description", eventData.description);
            data.append("date", eventData.date);
            data.append("time", eventData.time);
            data.append("location", eventData.location);
            
            // Format tickets - in this simplified version we just pass a base price or tier array
            // If the form has tiers, we can pass them
            data.append("tickets", JSON.stringify(eventData.tickets || []));
            
            if (coverImage?.file) {
                data.append("coverImage", coverImage.file);
            }

            // Mock userId for now
            data.append("userId", 1);

            await postService.createPost("club-event", data);
            navigate("/club-owner/marketplace");
        } catch (error) {
            console.error("Failed to publish event:", error);
            throw error;
        }
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
                    onPublish={handlePublish}
                />
            </div>
        </MainLayout>
    );
};

export default CreateEventPage;
