import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { ChevronRight } from "lucide-react";
import { mockOrders } from "../data/mockOrdersData";

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    const tabs = ["All", "In Progress", "Completed"];

    const filteredOrders = mockOrders.filter(order => {
        if (activeTab === "All") return true;
        if (activeTab === "In Progress") return order.status === "IN PROGRESS" || order.status === "PENDING";
        if (activeTab === "Completed") return order.status === "COMPLETED";
        return true;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case "COMPLETED":   return "bg-state-success/10 text-state-success border-state-success/20";
            case "IN PROGRESS": return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
            case "PENDING":     return "bg-state-warning/10 text-state-warning border-state-warning/20";
            default:            return "bg-white/10 text-text-secondary border-white/20";
        }
    };

    return (
        <MainLayout user={user} pageTitle="My Orders" verificationCount={0}>
            <div className="max-w-[1000px] mx-auto pb-2xl">

                {/* Tabs — full-width & centred on mobile, right-aligned on md+ */}
                <div className="flex justify-center md:justify-end mb-xl">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm w-full md:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 md:flex-none px-lg py-sm rounded-xl text-body-small-bold transition-all duration-300 ${
                                    activeTab === tab
                                        ? "bg-white/10 text-text-primary shadow-lg"
                                        : "text-text-tertiary hover:text-text-secondary"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders list */}
                <Card variant="card" padding="p-0" className="border-white/5">
                    <div className="divide-y divide-white/5">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/order-details/${order.id}`)}
                                    className="group cursor-pointer hover:bg-white/[0.03] transition-colors p-md md:p-lg"
                                >
                                    {/* ━━ MOBILE layout (hidden on md+) ━━ */}
                                    <div className="md:hidden">
                                        {/* Top row: image + info */}
                                        <div className="flex gap-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                <img
                                                    src={order.image}
                                                    alt={order.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 py-0.5">
                                                <h3 className="text-sm font-bold text-text-primary leading-snug">
                                                    {order.title}
                                                </h3>
                                                <p className="text-[11px] text-text-tertiary mt-0.5">
                                                    {order.clubName} · {order.orderId}
                                                </p>
                                                <p className="text-[10px] text-text-tertiary/60 uppercase tracking-wide mt-1">
                                                    {order.orderDate}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom row: status badge + price */}
                                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wide ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-sm font-bold text-text-primary">
                                                {order.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ━━ DESKTOP layout (original, hidden on mobile) ━━ */}
                                    <div className="hidden md:flex items-center gap-lg">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                            <img
                                                src={order.image}
                                                alt={order.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Order Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-body-large-bold text-text-primary truncate mb-xs">
                                                {order.title}
                                            </h3>
                                            <div className="flex items-center gap-xs text-body-extra-small text-text-tertiary">
                                                <span>{order.clubName}</span>
                                                <span>•</span>
                                                <span>Order {order.orderId}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 text-text-tertiary">
                                                <div className="w-4 h-4 rounded-md bg-white/5 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-white/20 rounded-[1px]" />
                                                </div>
                                                <span className="text-[11px] font-medium uppercase tracking-wider">
                                                    Ordered on {order.orderDate}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status and Price */}
                                        <div className="flex items-center gap-xl shrink-0">
                                            <span className={`px-sm py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-body-large-bold text-text-primary">
                                                    {order.price}
                                                </p>
                                            </div>
                                            <div className="p-sm rounded-xl bg-white/5 text-text-tertiary group-hover:text-text-primary group-hover:bg-white/10 transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4xl text-center">
                                <p className="text-body-medium text-text-tertiary">No orders found in this category.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default MyOrders;
