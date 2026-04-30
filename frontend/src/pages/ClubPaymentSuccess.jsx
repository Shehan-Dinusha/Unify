import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { CheckCircle, Mail, MapPin, ClipboardList, ArrowRight, Loader2 } from "lucide-react";
import { getImageUrl } from "../utils/formatters";
import orderService from "../services/orderService";

const ClubPaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    const [order, setOrder] = useState(location.state?.order || null);
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.order);

    useEffect(() => {
        const fetchOrder = async () => {
            if (order) return;
            
            const params = new URLSearchParams(location.search);
            const orderId = params.get("order_id");
            const bookingId = params.get("booking_id");
            
            if (orderId) {
                try {
                    const result = await orderService.getOrderDetails(orderId);
                    setOrder(result.order);
                    if (result.order.clubProduct) {
                        setProduct(result.order.clubProduct);
                    }
                } catch (error) {
                    console.error("Failed to fetch order:", error);
                    navigate("/marketplace/club");
                } finally {
                    setLoading(false);
                }
            } else if (bookingId) {
                try {
                    const result = await orderService.getBookingDetails(bookingId);
                    setOrder({
                        ...result.booking,
                        orderId: result.booking.bookingId,
                        size: result.booking.tierId, // map tier to size for UI
                        pickupLocation: "Details provided in email"
                    });
                    if (result.booking.event) {
                        setProduct(result.booking.event);
                    }
                } catch (error) {
                    console.error("Failed to fetch booking:", error);
                    navigate("/marketplace/club");
                } finally {
                    setLoading(false);
                }
            } else {
                navigate("/marketplace/club");
            }
        };
        
        fetchOrder();
    }, [order, location.search, navigate]);

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Club" verificationCount={0}>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-primary-blue w-8 h-8" />
                </div>
            </MainLayout>
        );
    }

    if (!order) return null;

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="max-w-[680px] mx-auto pb-2xl px-md md:px-0">
                <Card variant="card" className="border-white/5 bg-white/[0.02] overflow-hidden">
                    <div className="flex flex-col items-center text-center px-md md:px-2xl pt-xl md:pt-2xl pb-lg">
                        {/* Success icon */}
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-state-success/15 flex items-center justify-center mb-lg md:mb-xl">
                            <CheckCircle size={28} className="text-state-success md:hidden" />
                            <CheckCircle size={36} className="text-state-success hidden md:block" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-[24px] md:text-[36px] font-bold text-text-primary leading-tight">
                            Payment Successful!
                        </h1>
                        <p className="mt-sm text-body-small md:text-body-medium text-text-secondary max-w-sm md:max-w-md">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                    </div>

                    {/* Order summary card */}
                    <Card variant="container" className="mx-md md:mx-2xl mt-md" padding="p-md md:p-lg">
                        {/* Order ID + Total */}
                        <div className="flex justify-between items-start mb-lg">
                            <div>
                                <p className="text-[10px] md:text-body-extra-small text-text-tertiary uppercase tracking-wider">Order ID</p>
                                <p className="text-body-small-bold md:text-body-medium-bold text-text-primary mt-xs">{order.orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] md:text-body-extra-small text-text-tertiary uppercase tracking-wider">Total Paid</p>
                                <p className="text-body-small-bold md:text-body-medium-bold text-text-primary mt-xs">Rs.{parseFloat(order.total).toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 mb-lg" />

                        {/* Product row */}
                        <div className="flex items-center gap-md">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                <img
                                    src={getImageUrl(product?.images?.[0] || product?.image)}
                                    alt={product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-body-small-bold text-text-primary truncate">{product?.name}</p>
                                <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs truncate">
                                    {order.size && `Size: ${order.size}`} {order.color && `• Color: ${order.color}`}
                                </p>
                                <span className="inline-block mt-xs px-sm py-[2px] rounded-full bg-primary-blue/15 text-primary-blue text-[10px] md:text-[11px] font-bold">
                                    Qty: {order.qty}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Info cards row */}
                    <div className="mx-md md:mx-2xl mt-md grid grid-cols-1 md:grid-cols-2 gap-md">
                        {/* Confirmation Email */}
                        <Card variant="container" padding="p-md md:p-lg">
                            <div className="flex items-start gap-md">
                                <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                    <Mail size={16} className="md:hidden" />
                                    <Mail size={18} className="hidden md:block" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-body-small-bold text-text-primary">Confirmation Email</p>
                                    <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs leading-relaxed">
                                        We've sent the details to your registered email.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Pickup Details */}
                        <Card variant="container" padding="p-md md:p-lg">
                            <div className="flex items-start gap-md">
                                <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                    <MapPin size={16} className="md:hidden" />
                                    <MapPin size={18} className="hidden md:block" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-body-small-bold text-text-primary">Pickup Details</p>
                                    <p className="text-[11px] md:text-body-extra-small text-text-tertiary mt-xs leading-relaxed">
                                        {order.pickupLocation || "Ready for pickup once order is confirmed."}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Action buttons */}
                    <div className="mx-md md:mx-2xl mt-xl mb-xl md:mb-2xl flex flex-col md:flex-row gap-md">
                        <Button
                            variant="secondary"
                            size="medium"
                            className="w-full md:flex-1 justify-center py-md"
                            icon={ClipboardList}
                            onClick={() => navigate("/order-history")}
                        >
                            View My Orders
                        </Button>
                        <Button
                            variant="primary"
                            size="medium"
                            className="w-full md:flex-1 justify-center py-md"
                            icon={ArrowRight}
                            iconPosition="right"
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
