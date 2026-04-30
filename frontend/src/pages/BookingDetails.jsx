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
    Calendar,
    ArrowLeft,
    ShieldCheck,
    Loader2,
    Ticket,
    Info,
    QrCode
} from "lucide-react";
import orderService from "../services/orderService";
import { getImageUrl } from "../utils/formatters";

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = { name: "Alex Johnson", role: "student", displayRole: "Student" };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                const response = await orderService.getBookingDetails(id);
                if (response.success) {
                    setBooking(response.booking);
                }
            } catch (err) {
                console.error("Failed to fetch booking details:", err);
                setError(err.error || "Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id]);

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Booking Details" verificationCount={0}>
                <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Loading booking details...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !booking) {
        return (
            <MainLayout user={user} pageTitle="Booking Not Found" verificationCount={0}>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-heading-medium text-text-primary mb-lg">{error || "Booking Not Found"}</h2>
                    <Button onClick={() => navigate("/order-history")}>Back to History</Button>
                </div>
            </MainLayout>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const getTimeline = (booking) => {
        if (!booking) return [];
        
        const statuses = ["PENDING", "CONFIRMED", "ATTENDED"];
        const titles = {
            "PENDING": "Payment Pending",
            "CONFIRMED": "Payment Confirmed",
            "ATTENDED": "Event Attended"
        };
        const icons = {
            "PENDING": Clock,
            "CONFIRMED": ShieldCheck,
            "ATTENDED": CheckCircle
        };

        const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === booking.status?.toLowerCase());
        
        return statuses.map((status, index) => {
            let itemStatus = "upcoming";
            if (currentStatusIndex === -1) {
                // Ignore
            } else if (index < currentStatusIndex) {
                itemStatus = "completed";
            } else if (index === currentStatusIndex) {
                itemStatus = "current";
            }
            
            // Find timestamp from backend timeline if it exists
            const historyItem = booking.timeline?.find(t => t.status?.toLowerCase() === status.toLowerCase());
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

    const timeline = getTimeline(booking);

    return (
        <MainLayout user={user} pageTitle="My History" verificationCount={0}>
            <div className="max-w-[1100px] mx-auto pb-2xl px-md">
                {/* Back Link */}
                <button
                    onClick={() => navigate("/order-history")}
                    className="flex items-center gap-xs text-text-tertiary hover:text-text-primary transition-colors mb-lg group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-body-small-bold uppercase tracking-wider">Back to History</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
                    {/* Left Column: Event & Status */}
                    <div className="lg:col-span-2 space-y-xl">
                        {/* Main Event Card */}
                        <Card variant="container" padding="p-lg" className="border-white/10 overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-xl">
                                {/* Event Image */}
                                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                    <img
                                        src={getImageUrl(booking.event?.coverImage)}
                                        alt={booking.event?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Event Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex justify-between items-start gap-md mb-2">
                                        <div>
                                            <h1 className="text-heading-medium text-text-primary mb-1 leading-tight">
                                                {booking.event?.name || "Event Booking"}
                                            </h1>
                                            <p className="text-body-small text-text-tertiary">
                                                Hosted by <span className="text-primary-blue font-medium">{booking.event?.author?.name || "Club"}</span>
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-heading-small text-text-primary">Rs.{parseFloat(booking.total).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Date/Time/Location */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-lg">
                                        <div className="flex items-center gap-3 text-text-secondary">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Date</p>
                                                <p className="text-body-small-bold text-text-primary">{formatDate(booking.event?.date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Time</p>
                                                <p className="text-body-small-bold text-text-primary">{booking.event?.time || "TBA"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary sm:col-span-2">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Location</p>
                                                <p className="text-body-small-bold text-text-primary">{booking.event?.location || "TBA"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-xl">
                            {/* Ticket Details */}
                            <Card variant="card" padding="p-xl" className="bg-white/[0.03] border-white/5 flex flex-col h-full">
                                <h3 className="text-body-large-bold text-text-primary mb-lg flex items-center gap-2">
                                    <Ticket size={20} className="text-primary-blue" />
                                    Ticket Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-body-small text-text-secondary">Tier</span>
                                        <span className="text-body-small-bold text-text-primary uppercase">{booking.tierId || "Standard"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-body-small text-text-secondary">Quantity</span>
                                        <span className="text-body-small-bold text-text-primary">{booking.qty}x</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-body-small text-text-secondary">Booking ID</span>
                                        <span className="text-body-small-bold text-text-primary font-mono text-[10px]">{booking.bookingId}</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 flex items-center gap-sm">
                                    <div className={`px-lg py-sm rounded-2xl flex items-center gap-sm flex-1 justify-center ${
                                        booking.paymentStatus === "PAID" 
                                            ? "bg-state-success/5 border border-state-success/10 text-state-success" 
                                            : "bg-state-warning/5 border border-state-warning/10 text-state-warning"
                                    }`}>
                                        <ShieldCheck size={16} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">
                                            {booking.paymentStatus === "PAID" ? "Payment Verified" : "Payment Pending"}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>

                    {/* Right Column: Status Summary */}
                    <div className="space-y-xl">
                        {/* Booking Status Timeline */}
                        <Card variant="container" padding="p-xl" className="border-white/10">
                            <h3 className="text-heading-small text-text-primary mb-xl">Booking Status</h3>

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

export default BookingDetails;
