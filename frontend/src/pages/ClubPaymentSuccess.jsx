import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { CheckCircle, Mail, MapPin, ClipboardList, ArrowRight } from "lucide-react";
import { mockClubProduct } from "../data/mockClubProduct";

const ClubPaymentSuccess = () => {
    const navigate = useNavigate();
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const product = mockClubProduct;

    // Mock order data
    const order = {
        id: "#ORD-8392-CS",
        totalPaid: "Rs.35.00",
        size: "S",
        color: "Midnight Black",
        qty: 1,
        email: "student@uni.edu",
        pickupLocation: "CS Lab (Building 4, Room 202)",
        pickupTime: "Fridays: 2:00 PM - 5:00 PM",
    };

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="max-w-[680px] mx-auto pb-2xl">
                <Card variant="card" className="border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="flex flex-col items-center text-center px-md md:px-2xl pt-2xl pb-lg">
                        {/* Success icon */}
                        <div className="w-16 h-16 rounded-full bg-state-success/15 flex items-center justify-center mb-lg">
                            <CheckCircle size={36} className="text-state-success" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-heading-medium md:text-[36px] font-bold text-text-primary">
                            Payment Successful!
                        </h1>
                        <p className="mt-sm text-body-medium text-text-secondary max-w-md">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                    </div>

                    {/* Order summary card */}
                    <div className="mx-md md:mx-2xl mt-md p-lg rounded-2xl bg-white/[0.03] border border-white/10">
                        {/* Order ID + Total */}
                        <div className="flex justify-between items-start mb-lg">
                            <div>
                                <p className="text-body-extra-small text-text-tertiary">Order ID</p>
                                <p className="text-body-medium-bold text-text-primary mt-xs">{order.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-body-extra-small text-text-tertiary">Total Paid</p>
                                <p className="text-body-medium-bold text-text-primary mt-xs">{order.totalPaid}</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 mb-lg" />

                        {/* Product row */}
                        <div className="flex items-center gap-md">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                <img
                                    src={product.images[0].src}
                                    alt={product.images[0].alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-body-small-bold text-text-primary truncate">{product.title}</p>
                                <p className="text-body-extra-small text-text-tertiary mt-xs">
                                    Size: {order.size} • Color: {order.color}
                                </p>
                                <span className="inline-block mt-xs px-sm py-[2px] rounded-full bg-primary-blue/15 text-primary-blue text-[11px] font-bold">
                                    Qty: {order.qty}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info cards row */}
                    <div className="mx-md md:mx-2xl mt-md grid grid-cols-1 md:grid-cols-2 gap-md">
                        {/* Confirmation Email */}
                        <div className="p-lg rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-md">
                            <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                <Mail size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-body-small-bold text-text-primary">Confirmation Email</p>
                                <p className="text-body-extra-small text-text-tertiary mt-xs leading-relaxed">
                                    We've sent the receipt and details to{" "}
                                    <span className="text-text-secondary">{order.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Pickup Details */}
                        <div className="p-lg rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-md">
                            <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-body-small-bold text-text-primary">Pickup Details</p>
                                <p className="text-body-extra-small text-text-tertiary mt-xs leading-relaxed">
                                    {order.pickupLocation}
                                </p>
                                <p className="text-body-extra-small text-text-tertiary leading-relaxed">
                                    {order.pickupTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mx-md md:mx-2xl mt-xl mb-2xl flex flex-col md:flex-row gap-md">
                        <Button
                            variant="secondary"
                            size="large"
                            className="flex-1 justify-center"
                            icon={ClipboardList}
                            onClick={() => navigate("/order-history")}
                        >
                            View My Orders
                        </Button>
                        <Button
                            variant="primary"
                            size="large"
                            className="flex-1 justify-center"
                            icon={ArrowRight}
                            onClick={() => navigate("/marketplace/club")}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ClubPaymentSuccess;
