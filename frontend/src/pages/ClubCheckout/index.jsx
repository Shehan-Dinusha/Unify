import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useClubCheckout } from "./useClubCheckout";
import OrderSummaryCard from "./OrderSummaryCard";
import PaymentDetailsCard from "./PaymentDetailsCard";

const ClubCheckout = () => {
  const { user, loading, product, selectedColor, selectedSize, quantity, subtotal, total, handleProceedToPayment, navigate } = useClubCheckout();

  if (!product) return null;

  return (
    <MainLayout user={user} pageTitle="Club" verificationCount={0}>
      <div className="max-w-[1200px] mx-auto pb-2xl px-md md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-xl md:gap-2xl">
          <div className="space-y-md md:space-y-lg">
            <OrderSummaryCard
              product={product} selectedColor={selectedColor}
              selectedSize={selectedSize} quantity={quantity}
              subtotal={subtotal} onBack={() => navigate(-1)}
            />
          </div>
          <div className="space-y-md md:space-y-lg">
            <PaymentDetailsCard subtotal={subtotal} total={total} loading={loading} onProceed={handleProceedToPayment} />
          </div>
        </div>
        <div className="mt-lg md:mt-xl p-md md:p-lg rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-center gap-md text-text-tertiary">
          <img src="/Icon_secure_payment.svg" alt="Secure Payment" className="w-5 h-5 opacity-50" />
          <p className="text-[10px] md:text-body-small">Secure SSL Encryption. Your data is protected.</p>
        </div>
        <div className="h-24 md:hidden" />
      </div>
    </MainLayout>
  );
};

export default ClubCheckout;
