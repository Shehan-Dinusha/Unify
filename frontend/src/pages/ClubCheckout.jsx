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
    const discount = 0.00;
    const serviceFee = 0.00;
    const delivery = 0.00;
    const total = subtotal - discount + serviceFee + delivery;

    return (
        <MainLayout user={user} pageTitle="Club" verificationCount={0}>
            <div className="max-w-[1200px] mx-auto pb-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-2xl">

                    {/* LEFT: Order Summary */}
                    <div className="space-y-lg">
                        <Card variant="card" className="border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-md mb-xl">
                                <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue">
                                    <ShoppingBag size={20} />
                                </div>
                                <h2 className="text-heading-small font-bold text-text-primary">Order Summary</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-xl items-start">
                                <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <img
                                        src={product.images[0].src}
                                        alt={product.images[0].alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <div>
                                            <h3 className="text-body-large-bold text-text-primary">{product.title}</h3>
                                            <p className="text-body-small text-text-tertiary mt-xs">{product.clubName} {product.clubSubtitle}</p>
                                        </div>
                                        <p className="text-body-large-bold text-text-primary">Rs.{subtotal.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-lg flex flex-wrap gap-sm">
                                        <div className="px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-body-extra-small text-text-tertiary">Size:</span>
                                            <span className="text-body-extra-small-bold text-text-primary">S</span>
                                        </div>
                                        <div className="px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-body-extra-small text-text-tertiary">Color:</span>
                                            <div className="flex items-center gap-xs">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: product.colors[0].swatch }} />
                                                <span className="text-body-extra-small-bold text-text-primary">{product.colors[0].name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</span>
                                            </div>
                                        </div>
                                        <div className="px-md py-xs rounded-full bg-white/5 border border-white/10 flex items-center gap-xs">
                                            <span className="text-body-extra-small text-text-tertiary">Qty:</span>
                                            <span className="text-body-extra-small-bold text-text-primary">1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-xl pt-lg border-t border-white/5 flex justify-end">
                                <button className="flex items-center gap-xs text-body-small-bold text-primary-blue hover:underline">
                                    Edit Item
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT: Payment Details */}
                    <div className="space-y-lg">
                        <Card variant="card" className="border-white/5 bg-white/[0.02]">
                            <h2 className="text-heading-small font-bold text-text-primary mb-xl">Payment Details</h2>

                            <div className="space-y-md">
                                <div className="flex justify-between items-center text-body-medium">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="text-text-primary font-bold">Rs.{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-body-medium">
                                    <span className="text-text-secondary">Discount</span>
                                    <span className="text-semantic-error-light font-bold">-Rs.{discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-body-medium">
                                    <span className="text-text-secondary">Service Fee</span>
                                    <span className="text-text-primary font-bold">Rs.{serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-body-medium">
                                    <span className="text-text-secondary">Delivery</span>
                                    <span className="text-semantic-success-light font-bold">Rs.{serviceFee.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="my-xl h-px bg-white/10" />

                            <div className="flex justify-between items-center mb-xl">
                                <span className="text-heading-small font-bold text-text-primary">Total</span>
                                <span className="text-heading-small font-bold text-text-primary">Rs.{total.toFixed(2)}</span>
                            </div>

                            <Button
                                variant="primary"
                                className="w-full justify-center py-lg group"
                                icon={ArrowRight}
                                iconPosition="right"
                                onClick={() => navigate("/marketplace/club/payment-success")}
                            >
                                Proceed to Payment
                            </Button>

                            <p className="mt-lg text-[11px] text-text-tertiary text-center leading-relaxed">
                                By <span className="font-semibold">proceeding</span>, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Return Policy</a>.
                            </p>

                            <div className="mt-xl p-md bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center gap-lg">
                                <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-5" />
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-5" />
                                <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" className="h-5" />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-xl p-lg rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center gap-md text-text-tertiary">
                    <img src="/Icon_secure_payment.svg" alt="Secure Payment" className="w-5 h-5" />
                    <p className="text-body-small">Secure SSL Encryption. Your data is protected.</p>
                </div>
            </div>
        </MainLayout>
    );
};

export default ClubCheckout;
