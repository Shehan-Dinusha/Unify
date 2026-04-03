import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { ShoppingBag, ArrowRight, Edit3 } from "lucide-react";
import { mockClubProduct } from "../data/mockClubProduct";

const ClubCheckout = () => {
    const navigate = useNavigate();
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const product = mockClubProduct;

    // Mock values based on design
    const subtotal = 35.00;
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
                                <div className="w-24 h-24 md:w-32 md:h-32 aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <img
                                        src={product.images[0].src}
                                        alt={product.images[0].alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start w-full gap-sm">
                                        <div className="min-w-0">
                                            <h3 className="text-body-medium-bold md:text-body-large-bold text-text-primary truncate">{product.title}</h3>
                                            <p className="text-body-extra-small md:text-body-small text-text-tertiary mt-xs truncate">{product.clubName} {product.clubSubtitle}</p>
                                        </div>
                                        <p className="text-body-medium-bold md:text-body-large-bold text-text-primary shrink-0">Rs.{subtotal.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-md md:mt-lg flex flex-wrap gap-xs md:gap-sm">
                                        <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Size:</span>
                                            <span className="text-[10px] md:text-body-extra-small-bold text-text-primary uppercase">S</span>
                                        </div>
                                        <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Color:</span>
                                            <div className="flex items-center gap-xs">
                                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: product.colors[0].swatch }} />
                                                <span className="text-[10px] md:text-body-extra-small-bold text-text-primary">{product.colors[0].name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</span>
                                            </div>
                                        </div>
                                        <div className="px-sm md:px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-[10px] md:text-body-extra-small text-text-tertiary">Qty:</span>
                                            <span className="text-[10px] md:text-body-extra-small-bold text-text-primary">1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-lg md:mt-xl pt-md md:pt-lg border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => navigate("/marketplace/club/product")}
                                    className="flex items-center gap-xs text-body-extra-small-bold md:text-body-small-bold text-primary-blue hover:underline"
                                >
                                    Edit Item
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT: Payment Details */}
                    <div className="space-y-md md:space-y-lg">
                        <Card variant="card" className="border-white/5" padding="p-md md:p-xl">
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

                            {/* Sticky Buy Button Container on Mobile */}
                            <div className="
                                fixed bottom-0 left-0 right-0 z-50 p-md bg-dark-1/90 backdrop-blur-lg border-t border-white/10
                                md:static md:z-auto md:p-0 md:bg-transparent md:backdrop-blur-none md:border-t-0
                            ">
                                <Button
                                    variant="primary"
                                    className="w-full justify-center py-sm md:py-lg group"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                    onClick={() => navigate("/marketplace/club/payment-success")}
                                >
                                    Proceed to Payment
                                </Button>
                            </div>

                            <p className="mt-md md:mt-lg text-[10px] md:text-[11px] text-text-tertiary text-center leading-relaxed">
                                By <span className="font-semibold">proceeding</span>, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Return Policy</a>.
                            </p>

                            <div className="mt-lg md:mt-xl p-sm md:p-md bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center gap-md md:gap-lg">
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-4 md:h-5" />
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-4 md:h-5" />
                                <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-4 md:h-5" />
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
