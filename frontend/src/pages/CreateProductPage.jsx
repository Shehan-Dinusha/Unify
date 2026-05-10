import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import CreateProductForm from "../components/marketplace/CreateProductForm";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import orderService from "../services/orderService";
import { Loader2 } from "lucide-react";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isChecking, setIsChecking] = useState(true);
    const [checkError, setCheckError] = useState(null);

    useEffect(() => {
        const checkPaymentSetup = async () => {
            try {
                // This call will return a URL if the user is not yet fully onboarded
                const res = await orderService.onboardClub();
                if (res.success && !res.alreadyConnected && res.url) {
                    window.location.href = res.url;
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                console.error("Payment check failed:", error);
                setCheckError(error.error || "Failed to verify payment setup. Please try again or contact support.");
                setIsChecking(false);
            }
        };
        checkPaymentSetup();
    }, []);

    if (isChecking) {
        return (
            <MainLayout user={user} pageTitle="Creating Product..." verificationCount={0}>
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
                        Club owners must connect a Stripe account to receive payments before creating products.
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
