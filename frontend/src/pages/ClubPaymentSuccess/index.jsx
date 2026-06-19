import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import { CheckCircle, Loader2 } from "lucide-react";
import { useClubPaymentSuccess } from "./useClubPaymentSuccess";
import OrderSummaryCard from "./OrderSummaryCard";
import InfoCardsRow from "./InfoCardsRow";
import ActionButtons from "./ActionButtons";

const ClubPaymentSuccess = () => {
  const { navigate, user, order, product, loading } = useClubPaymentSuccess();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Club" verificationCount={0}>
        <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary-blue w-8 h-8" /></div>
      </MainLayout>
    );
  }

  if (!order) return null;

  return (
    <MainLayout user={user} pageTitle="Club" verificationCount={0}>
      <div className="max-w-[680px] mx-auto pb-2xl px-md md:px-0">
        <Card variant="card" className="border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="flex flex-col items-center text-center px-md md:px-2xl pt-xl md:pt-2xl pb-lg">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-state-success/15 flex items-center justify-center mb-lg md:mb-xl">
              <CheckCircle size={28} className="text-state-success md:hidden" /><CheckCircle size={36} className="text-state-success hidden md:block" />
            </div>
            <h1 className="text-[24px] md:text-[36px] font-bold text-text-primary leading-tight">Payment Successful!</h1>
            <p className="mt-sm text-body-small md:text-body-medium text-text-secondary max-w-sm md:max-w-md">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <OrderSummaryCard order={order} product={product} />
          <InfoCardsRow order={order} />
          <ActionButtons onViewOrders={() => navigate("/order-history")} onContinueShopping={() => navigate("/marketplace/club")} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClubPaymentSuccess;
