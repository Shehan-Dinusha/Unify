import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import {
    CheckCircle,
    Circle,
    Clock,
    MapPin,
    CreditCard,
    ArrowLeft,
    ShieldCheck,
    Loader2,
    Package,
    Truck
} from "lucide-react";
import orderService from "../services/orderService";
import { getImageUrl } from "../utils/formatters";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await orderService.getOrderDetails(id);
                if (response.success) {
                    setOrder(response.order);
                }
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError(err.error || "Failed to load order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const getTimeline = (order) => {
        if (!order) return [];
        
        const statuses = ["PENDING", "Order Placed", "Seller Confirmed", "Ready for Pickup", "Order Completed"];
        const titles = {
            "PENDING": "Pending",
            "Order Placed": "Order Placed",
            "Seller Confirmed": "Seller Confirmed",
            "Ready for Pickup": "Ready for Pickup",
            "Order Completed": "Order Completed"
        };
        const icons = {
            "PENDING": Clock,
            "Order Placed": Package,
            "Seller Confirmed": ShieldCheck,
            "Ready for Pickup": Truck,
            "Order Completed": CheckCircle
        };

        const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === order.status?.toLowerCase());
        
        return statuses.map((status, index) => {
            let itemStatus = "upcoming";
            if (currentStatusIndex === -1) {
                // If status not found, assume everything is upcoming or handle gracefully
            } else if (index < currentStatusIndex) {
                itemStatus = "completed";
            } else if (index === currentStatusIndex) {
                itemStatus = "current";
            }
            
            // Find timestamp from backend timeline if it exists
            const historyItem = order.timeline?.find(t => t.status?.toLowerCase() === status.toLowerCase());
            const date = historyItem ? new Date(historyItem.timestamp).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }) : null;

            return {
                title: titles[status],
                status: itemStatus,
                icon: icons[status],
                date: date
            };
        });
    };

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

    const timeline = getTimeline(order);

    return (
        <MainLayout user={user} pageTitle="My Orders" verificationCount={0}>
            <div className="max-w-[1100px] mx-auto pb-2xl px-md">
                {/* Back Link */}
                <button
                    onClick={() => navigate("/order-history")}
                    className="flex items-center gap-xs text-text-tertiary hover:text-text-primary transition-colors mb-lg group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-body-small-bold uppercase tracking-wider">Back to Orders</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
                    {/* Left Column: Product & Status */}
                    <div className="lg:col-span-2 space-y-xl">
                        {/* Main Product Card */}
                        <Card variant="container" padding="p-lg" className="border-white/10">
                            <div className="flex flex-col md:flex-row gap-xl">
                                {/* Product Image */}
                                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <img
                                        src={getImageUrl(order.clubProduct?.images?.[0] || order.clubProduct?.coverImage)}
                                        alt={order.clubProduct?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex justify-between items-start gap-md mb-2">
                                        <div>
                                            <h1 className="text-heading-medium text-text-primary mb-1 leading-tight">
                                                {order.clubProduct?.name || "Marketplace Product"}
                                            </h1>
                                            <p className="text-body-small text-text-tertiary">
                                                Sold by <span className="text-primary-blue font-medium cursor-pointer hover:underline">{order.seller?.name || "Club"}</span>
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-heading-small text-text-primary">Rs.{parseFloat(order.total).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="flex flex-wrap gap-md mt-lg">
                                        <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[80px]">
                                            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Size</span>
                                            <span className="text-body-small-bold text-text-primary">{order.size || "Standard"}</span>
                                        </div>
                                        <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[80px]">
                                            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Color</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: order.colorHex || '#2B8CEE' }} />
                                                <span className="text-body-small-bold text-text-primary">{order.color || "Default"}</span>
                                            </div>
                                        </div>
                                        <div className="px-md py-sm rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[60px]">
                                            <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Qty</span>
                                            <span className="text-body-small-bold text-text-primary">{order.qty || 1}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                            {/* Payment Information */}
                            <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
                                <h3 className="text-body-large-bold text-text-primary mb-lg">Payment Information</h3>
                                <div className="flex items-center gap-md mb-lg">
                                    <div className="p-sm rounded-xl bg-white/5 border border-white/10 shrink-0">
                                        <CreditCard size={20} className="text-text-secondary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-5 bg-[#EB001B] rounded-sm relative overflow-hidden flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-[#FF5F00] translate-x-1" />
                                                <div className="w-3 h-3 rounded-full bg-[#F79E1B] -translate-x-1" />
                                            </div>
                                            <span className="text-body-medium-bold text-text-primary uppercase">{order.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-lg py-sm rounded-2xl bg-state-success/5 border border-state-success/10 flex items-center gap-sm mt-auto">
                                    <ShieldCheck size={16} className="text-state-success" />
                                    <span className="text-[11px] font-bold text-state-success uppercase tracking-wider">Payment Verified</span>
                                </div>
                            </Card>

                            {/* Pickup Location */}
                            <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
                                <h3 className="text-body-large-bold text-text-primary mb-lg">Pickup Location</h3>
                                <div className="flex items-start gap-md">
                                    <div className="p-sm rounded-xl bg-primary-blue/10 text-primary-blue shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-body-small text-text-secondary leading-relaxed">
                                            {order.pickupLocation || "Pickup details will be provided once order is ready."}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Status Summary */}
                    <div className="space-y-xl">

                        {/* Order Status Timeline */}
                        <Card variant="container" padding="p-xl" className="border-white/10">
                            <h3 className="text-heading-small text-text-primary mb-xl">Order Status</h3>

                            <div className="space-y-0">
                                {timeline.map((item, index) => (
                                    <div key={index} className="flex gap-lg group">
                                        <div className="flex flex-col items-center">
                                            <div className={`
                                                relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                                                ${item.status === 'completed' ? 'bg-state-success/15 text-state-success shadow-[0_0_15px_rgba(74,222,128,0.2)]' :
                                                    item.status === 'current' ? 'bg-primary-blue text-white shadow-[0_0_20px_rgba(43,140,238,0.4)]' :
                                                        'bg-white/5 text-text-tertiary border border-white/5'}
                                            `}>
                                                <item.icon size={item.status === 'upcoming' ? 16 : 20} className={item.status === 'current' ? 'animate-pulse' : ''} />
                                            </div>
                                            {index !== timeline.length - 1 && (
                                                <div className={`
                                                    w-0.5 h-16 transition-all duration-700
                                                    ${item.status === 'completed' ? 'bg-state-success' : 'bg-white/5'}
                                                `} />
                                            )}
                                        </div>
                                        <div className="pt-2 pb-8">
                                            <h4 className={`text-body-medium-bold ${item.status === 'upcoming' ? 'text-text-tertiary' : 'text-text-primary'}`}>
                                                {item.title}
                                            </h4>
                                            {item.date && (
                                                <p className="text-body-extra-small text-text-tertiary mt-1">
                                                    {item.date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderDetails;
