import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { XCircle, AlertCircle, ShoppingBag, ArrowLeft, HelpCircle } from "lucide-react";
import { getCurrentUser } from "../services/authService";

const ClubPaymentCancel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="max-w-[680px] mx-auto pb-2xl px-md md:px-0">
                <Card variant="card" className="border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="flex flex-col items-center text-center px-md md:px-2xl pt-xl md:pt-2xl pb-lg">
                        {/* Cancel icon */}
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-state-error/15 flex items-center justify-center mb-lg md:mb-xl">
                            <XCircle size={28} className="text-state-error md:hidden" />
                            <XCircle size={36} className="text-state-error hidden md:block" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-[24px] md:text-[36px] font-bold text-text-primary leading-tight">
                            Payment Failed
                        </h1>
                        <p className="mt-sm text-body-small md:text-body-medium text-text-secondary max-w-sm md:max-w-md">
                            Something went wrong with your transaction. No funds were captured from your account.
                        </p>
                    </div>

                    {/* Common issues card */}
                    <Card variant="container" className="mx-md md:mx-2xl mt-md" padding="p-md md:p-lg">
                        <div className="flex items-center gap-md mb-md">
                            <div className="p-xs rounded-lg bg-white/5 text-text-tertiary">
                                <AlertCircle size={18} />
                            </div>
                            <h2 className="text-body-medium-bold text-text-primary font-bold">Why did it fail?</h2>
                        </div>

                        <ul className="space-y-sm">
                            <li className="flex items-start gap-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-state-error shrink-0 mt-1.5" />
                                <p className="text-body-extra-small md:text-body-small text-text-secondary">Insufficient funds or card limits exceeded.</p>
                            </li>
                            <li className="flex items-start gap-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-state-error shrink-0 mt-1.5" />
                                <p className="text-body-extra-small md:text-body-small text-text-secondary">The transaction was cancelled by the user.</p>
                            </li>
                            <li className="flex items-start gap-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-state-error shrink-0 mt-1.5" />
                                <p className="text-body-extra-small md:text-body-small text-text-secondary">Incorrect payment details or authentication failed.</p>
                            </li>
                        </ul>
                    </Card>

                    {/* Support card */}
                    <div className="mx-md md:mx-2xl mt-md">
                        <Card variant="container" padding="p-md md:p-lg">
                            <div className="flex items-start gap-md">
                                <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                    <HelpCircle size={16} className="md:hidden" />
                                    <HelpCircle size={18} className="hidden md:block" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-body-small-bold text-text-primary">Need help?</p>
                                    <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs leading-relaxed">
                                        If the problem persists, please contact our support team or try a different payment method.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Action buttons */}
                    <div className="mx-md md:mx-2xl mt-xl mb-xl md:mb-2xl flex flex-col md:flex-row gap-md">
                        {/*<Button
                            variant="secondary"
                            size="medium"
                            className="w-full md:flex-1 justify-center py-md"
                            icon={ArrowLeft}
                            onClick={() => navigate(-1)}
                        >
                            Return to Checkout
                        </Button>*/}
                        <Button
                            variant="primary"
                            size="medium"
                            className="w-full md:flex-1 justify-center py-md"
                            icon={ShoppingBag}
                            iconPosition="right"
                            onClick={() => navigate("/marketplace/club")}
                        >
                            Back to Marketplace
                        </Button>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ClubPaymentCancel;
