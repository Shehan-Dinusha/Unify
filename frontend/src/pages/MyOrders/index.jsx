import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import { Loader2, Package, Ticket } from "lucide-react";
import { useMyOrders } from "./useMyOrders";
import MyOrderFilterBar from "./MyOrderFilterBar";
import MyOrderListItem from "./MyOrderListItem";

const MyOrders = () => {
  const {
    navigate, user, loading, error, viewType, setViewType,
    tabs, activeTab, setActiveTab, currentItems, getStatusStyles, formatDate, fetchAllHistory,
  } = useMyOrders();

  return (
    <MainLayout user={user} pageTitle="My History" verificationCount={0}>
      <div className="max-w-[1000px] mx-auto pb-2xl">
        <MyOrderFilterBar viewType={viewType} setViewType={setViewType} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <Card variant="card" padding="p-0" className="border-white/5 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-text-tertiary">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading your history...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center text-state-error">
              <p>{error}</p>
              <button onClick={fetchAllHistory} className="mt-4 text-primary-blue hover:underline text-sm font-bold">Try Again</button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <MyOrderListItem key={item.id} item={item} viewType={viewType}
                    onNavigate={navigate} getStatusStyles={getStatusStyles} formatDate={formatDate} />
                ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center justify-center text-text-tertiary">
                  {viewType === "Marketplace" ? <Package className="w-12 h-12 mb-4 opacity-20" /> : <Ticket className="w-12 h-12 mb-4 opacity-20" />}
                  <p className="text-body-medium">No {viewType.toLowerCase()} records found.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default MyOrders;
