import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useOrderDetails } from "./useOrderDetails";
import ProductInfoCard from "./ProductInfoCard";
import PaymentInfoCard from "./PaymentInfoCard";
import PickupLocationCard from "./PickupLocationCard";
import OrderTimeline from "./OrderTimeline";

const OrderDetails = () => {
  const { navigate, user, order, loading, error, timeline } = useOrderDetails();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Order Details" verificationCount={0}>
        <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout user={user} pageTitle="Order Not Found" verificationCount={0}>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-heading-medium text-text-primary mb-lg">{error || "Order Not Found"}</h2>
          <Button onClick={() => navigate("/order-history")}>Back to Orders</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="My Orders" verificationCount={0}>
      <div className="max-w-[1100px] mx-auto pb-2xl px-md">
        <button onClick={() => navigate("/order-history")}
          className="flex items-center gap-xs text-text-tertiary hover:text-text-primary transition-colors mb-lg group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-body-small-bold uppercase tracking-wider">Back to Orders</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2 space-y-xl">
            <ProductInfoCard order={order} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              <PaymentInfoCard order={order} />
              <PickupLocationCard order={order} />
            </div>
          </div>
          <div className="space-y-xl">
            <OrderTimeline timeline={timeline} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetails;
