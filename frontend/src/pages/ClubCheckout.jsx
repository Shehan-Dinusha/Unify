import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { getImageUrl } from "../utils/formatters";
import orderService from "../services/orderService";
import { getCurrentUser } from "../services/authService";

const ClubCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    const [loading, setLoading] = useState(false);

    const { product, selectedColor, selectedSize, quantity } = location.state || {};

    useEffect(() => {
        if (!product) {
            navigate("/marketplace/club");
        }
    }, [product, navigate]);

    const handleProceedToPayment = async () => {
        try {
            setLoading(true);
            let sessionResponse;
            const subtotal = parseFloat(product.price) * (quantity || 1);

            if (product.postType === "club-event") {
                // Extract tierId (default to first tier if available)
                const tierId = product.tiers && product.tiers.length > 0 ? product.tiers[0].name : "Standard";
                
                const bookingData = {
                    userId: user.id,
                    eventId: product.id,
                    tierId,
                    qty: quantity || 1,
                };
                
                const result = await orderService.createBooking(bookingData);
                
                sessionResponse = await orderService.createCheckoutSession({
                    bookingId: result.booking.bookingId,
                    amount: subtotal,
                    productName: product.name,
                    successUrl: `${window.location.origin}/marketplace/club/payment-success?booking_id=${result.booking.id}`,
                    cancelUrl: window.location.href,
                });
            } else {
                const orderData = {
                    userId: user.id,
                    postId: product.id,
                    qty: quantity || 1,
                    color: selectedColor?.name,
                    colorHex: selectedColor?.hex,
                    size: selectedSize,
                    paymentMethod: "STRIPE"
                };

                const result = await orderService.createOrder(orderData);
                
                sessionResponse = await orderService.createCheckoutSession({
                    orderId: result.order.orderId,
                    amount: subtotal,
                    productName: product.name,
                    successUrl: `${window.location.origin}/marketplace/club/payment-success?order_id=${result.order.id}`,
                    cancelUrl: window.location.href,
                });
            }
            
            if (sessionResponse.success && sessionResponse.url) {
                // Redirect to Stripe Checkout page
                window.location.href = sessionResponse.url;
            } else {
                throw new Error("Failed to create checkout session");
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to proceed to payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    const subtotal = parseFloat(product.price) * (quantity || 1);
    const total = subtotal;

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="max-w-[1200px] mx-auto pb-2xl px-md md:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-xl md:gap-2xl">

                    {/* LEFT: Order Summary */}
                    <div className="space-y-md md:space-y-lg">
                        <Card variant="card" className="border-white/5" padding="p-md md:p-xl">
                            <div className="flex items-center gap-md mb-lg md:mb-xl">
                                <div className="p-xs md:p-sm rounded-xl bg-primary-blue/10 text-primary-blue">
                                    <ShoppingBag size={20} />
                                </div>
                                <h2 className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Order Summary</h2>
                            </div>

                            <div className="flex gap-md md:gap-xl items-start">
                                {/* Product image */}
                                <div className="w-20 h-20 md:w-32 md:h-32 aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <img
                                        src={getImageUrl(product.images?.[0] || product.image || product.coverImage)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <div className="md:flex md:justify-between md:items-start md:gap-sm">
                                        <div>
                                            <h3 className="text-body-medium-bold md:text-body-large-bold text-text-primary leading-snug md:truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-body-extra-small md:text-body-small text-text-tertiary mt-xs md:truncate">
                                                {product.author?.name || "Club"} · {product.category || "Official Merchandise"}
                                            </p>
                                        </div>
                                        <p className="text-body-medium-bold md:text-body-large-bold text-text-primary shrink-0 mt-xs md:mt-0">
                                            Rs.{subtotal.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Attribute pills */}
                                    <div className="mt-md md:mt-lg flex flex-wrap gap-xs md:gap-sm">
                                        {selectedSize && (
                                            <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                                <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Size:</span>
                                                <span className="text-[10px] md:text-body-extra-small-bold text-text-primary uppercase">{selectedSize}</span>
                                            </div>
                                        )}
                                        {selectedColor && (
                                            <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                                <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Color:</span>
                                                <div className="flex items-center gap-xs">
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                                                    <span className="text-[10px] md:text-body-extra-small-bold text-text-primary uppercase">
                                                        {selectedColor.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Qty:</span>
                                            <span className="text-[10px] md:text-body-extra-small-bold text-text-primary">{quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-lg md:mt-xl pt-md md:pt-lg border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-xs text-body-extra-small-bold md:text-body-small-bold text-primary-blue hover:underline"
                                >
                                    Edit Selection
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT: Payment Details */}
                    <div className="space-y-md md:space-y-lg">
                        <Card variant="card" className="border-white/5" padding="p-md md:p-xl pb-24 md:pb-xl">
                            <h2 className="text-body-large-bold md:text-heading-small font-bold text-text-primary mb-lg md:mb-xl">Payment Details</h2>

                            <div className="space-y-sm md:space-y-md">
                                <div className="flex justify-between items-center text-body-small md:text-body-medium">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="text-text-primary font-bold">Rs.{subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="my-lg md:my-xl h-px bg-white/10" />

                            <div className="flex justify-between items-center mb-lg md:mb-xl">
                                <span className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Total</span>
                                <span className="text-body-large-bold md:text-heading-small font-bold text-text-primary">Rs.{total.toFixed(2)}</span>
                            </div>

                            <p className="mt-md md:mt-lg text-[10px] md:text-[11px] text-text-tertiary text-center leading-relaxed">
                                By <span className="font-semibold">proceeding</span>, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Return Policy</a>.
                            </p>

                            <div className="mt-md md:mt-xl mb-md md:mb-0 p-sm md:p-md bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center gap-md md:gap-lg">
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-4 md:h-5" />
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-4 md:h-5" />
                                <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-4 md:h-5" />
                            </div>

                            {/* Sticky Buy Button Container on Mobile */}
                            <div className="
                                fixed bottom-0 left-0 right-0 z-50 p-md bg-[#0D1A26]/90 backdrop-blur-lg border-t border-white/10
                                md:static md:z-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0 md:mt-lg
                            ">
                                <Button
                                    variant="primary"
                                    className="w-full justify-center py-sm md:py-lg group"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                    loading={loading}
                                    onClick={handleProceedToPayment}
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-lg md:mt-xl p-md md:p-lg rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center gap-md text-text-tertiary">
                    <img src="/Icon_secure_payment.svg" alt="Secure Payment" className="w-5 h-5 opacity-50" />
                    <p className="text-[10px] md:text-body-small">Secure SSL Encryption. Your data is protected.</p>
                </div>

                {/* Mobile Spacer */}
                <div className="h-24 md:hidden" />
            </div>
        </MainLayout>
    );
};

export default ClubCheckout;
