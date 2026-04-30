import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { ChevronRight, Loader2, Package, Calendar, Ticket } from "lucide-react";
import orderService from "../services/orderService";
import { getImageUrl } from "../utils/formatters";

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const [viewType, setViewType] = useState("Marketplace"); // "Marketplace" or "Events"
    
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };
    const tabs = ["All", "In Progress", "Completed"];

    useEffect(() => {
        fetchAllHistory();
    }, []);

    const fetchAllHistory = async () => {
        try {
            setLoading(true);
            // Using mock user ID 5 for now to match the checkout mock user
            const [ordersRes, bookingsRes] = await Promise.all([
                orderService.getStudentOrders(5),
                orderService.getStudentBookings(5)
            ]);

            if (ordersRes.success) setOrders(ordersRes.orders);
            if (bookingsRes.success) setBookings(bookingsRes.bookings);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load your history.");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredItems = () => {
        const items = viewType === "Marketplace" ? orders : bookings;
        return items.filter(item => {
            if (activeTab === "All") return true;
            const status = item.status;
            if (activeTab === "In Progress") {
                // Product: paid but not yet collected
                // Booking: confirmed but not yet attended
                return ["Order Placed", "Seller Confirmed", "Ready for Pickup", "CONFIRMED", "IN PROGRESS", "PENDING"].includes(status);
            }
            if (activeTab === "Completed") {
                return ["Order Completed", "COMPLETED", "ATTENDED", "DELIVERED"].includes(status);
            }
            return true;
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            // Product order statuses
            case "PENDING":              return "bg-state-warning/10 text-state-warning border-state-warning/20";
            case "Order Placed":         return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
            case "Seller Confirmed":     return "bg-purple-400/10 text-purple-400 border-purple-400/20";
            case "Ready for Pickup":     return "bg-state-success/10 text-state-success border-state-success/20";
            case "Order Completed":      return "bg-white/10 text-text-secondary border-white/20";
            // Event booking statuses
            case "CONFIRMED":            return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
            case "ATTENDED":             return "bg-state-success/10 text-state-success border-state-success/20";
            case "CANCELLED":            return "bg-state-error/10 text-state-error border-state-error/20";
            // Legacy/fallback
            case "COMPLETED":
            case "DELIVERED":            return "bg-white/10 text-text-secondary border-white/20";
            case "IN PROGRESS":
            case "PROCESSING":
            case "SHIPPED":              return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
            default:                     return "bg-white/10 text-text-secondary border-white/20";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const currentItems = getFilteredItems();

    return (
        <MainLayout user={user} pageTitle="My History" verificationCount={0}>
            <div className="max-w-[1000px] mx-auto pb-2xl">

                <div className="flex flex-col md:flex-row justify-between items-center mb-xl gap-4">
                    {/* View Type Toggle */}
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm w-full md:w-auto">
                        {["Marketplace", "Events"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setViewType(type)}
                                className={`flex-1 md:flex-none px-lg py-sm rounded-xl text-body-small-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                    viewType === type
                                        ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
                                        : "text-text-tertiary hover:text-text-secondary"
                                }`}
                            >
                                {type === "Marketplace" ? <Package size={16} /> : <Ticket size={16} />}
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Status Tabs */}
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

                {/* List Container */}
                <Card variant="card" padding="p-0" className="border-white/5 overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-text-tertiary">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p>Loading your history...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center text-state-error">
                            <p>{error}</p>
                            <button onClick={fetchAllHistory} className="mt-4 text-primary-blue hover:underline text-sm font-bold">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(viewType === "Marketplace" ? `/order-details/${item.id}` : `/booking-details/${item.id}`)}
                                        className="group cursor-pointer hover:bg-white/[0.03] transition-colors p-md md:p-lg"
                                    >
                                        <div className="flex items-center gap-lg">
                                            {/* Thumbnail */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                <img
                                                    src={getImageUrl(
                                                        viewType === "Marketplace" 
                                                            ? (item.clubProduct?.images?.[0] || item.clubProduct?.coverImage)
                                                            : (item.event?.coverImage)
                                                    )}
                                                    alt={viewType === "Marketplace" ? item.clubProduct?.name : item.event?.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm md:text-body-large-bold text-text-primary truncate mb-0.5 md:mb-xs">
                                                    {viewType === "Marketplace" ? item.clubProduct?.name : item.event?.name}
                                                </h3>
                                                <div className="flex items-center gap-xs text-[11px] md:text-body-extra-small text-text-tertiary">
                                                    <span>{viewType === "Marketplace" ? item.orderId : item.bookingId}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-2 text-text-tertiary">
                                                    {viewType === "Marketplace" ? <Package size={12} /> : <Calendar size={12} />}
                                                    <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-wider">
                                                        {viewType === "Marketplace" ? "Ordered on " : "Booked on "} {formatDate(item.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status and Price */}
                                            <div className="flex items-center gap-md md:gap-xl shrink-0">
                                                <span className={`px-2 md:px-sm py-1 rounded-full text-[9px] md:text-[10px] font-bold border uppercase whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <div className="text-right min-w-[80px] md:min-w-[100px] hidden sm:block">
                                                    <p className="text-sm md:text-body-large-bold text-text-primary">
                                                        Rs.{parseFloat(item.total).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="p-1.5 md:p-sm rounded-xl bg-white/5 text-text-tertiary group-hover:text-text-primary group-hover:bg-white/10 transition-all">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
