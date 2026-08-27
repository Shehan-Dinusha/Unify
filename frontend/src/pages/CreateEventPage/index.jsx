import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import CreateEventForm from "../../components/marketplace/CreateEventForm";
import { useNavigate } from "react-router-dom";
import postService from "../../services/postService";
import { getCurrentUser } from "../../services/authService";
import orderService from "../../services/orderService";
import { Loader2 } from "lucide-react";

const CreateEventPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isChecking, setIsChecking] = useState(true);
    const [checkError, setCheckError] = useState(null);

    useEffect(() => {
        const checkPaymentSetup = async () => {
            try {
                const res = await orderService.onboardClub();
                if (res.success && !res.alreadyConnected && res.url) {
                    window.location.href = res.url;
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                setCheckError(error.error || "Failed to verify payment setup. Please try again or contact support.");
                setIsChecking(false);
            }
        };
        checkPaymentSetup();
    }, []);

    if (isChecking) {
        return (
            <MainLayout user={user} pageTitle="Creating Event..." verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-12 h-12 text-primary-blue animate-spin" />
                    <p className="text-text-secondary text-body-large">Verifying payment setup...</p>
                </div>
            </MainLayout>
        );
    }

    if (checkError) {
        return (
            <MainLayout user={user} pageTitle="Payment Setup Required" verificationCount={0}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-state-error/10 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-heading-medium text-text-primary mb-2">Payment Setup Required</h2>
                    <p className="text-text-secondary mb-8 max-w-md">
                        {checkError}
                        <br /><br />
                        Club owners must connect a Stripe account to receive payments before creating events.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            className="bg-primary-blue text-white px-6 py-2 rounded-full font-bold"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                        <button 
                            className="bg-white/10 text-white px-6 py-2 rounded-full font-bold"
                            onClick={() => navigate("/club-owner/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const handlePublish = async (eventData, images) => {
        const data = new FormData();
        data.append("name", eventData.name);
        data.append("description", eventData.description);
        data.append("date", eventData.date);
        data.append("time", eventData.time);
        data.append("location", eventData.location);
        
        // Format tickets - in this simplified version we just pass a base price or tier array
        // If the form has tiers, we can pass them
        data.append("tickets", JSON.stringify(eventData.tickets || []));
        
        images.forEach(img => {
            if (img.file) {
                data.append("coverImage", img.file);
            }
        });

        // Use real userId
        data.append("userId", user.id);

        await postService.createPost("club-event", data);
        navigate("/club-owner/marketplace");
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
