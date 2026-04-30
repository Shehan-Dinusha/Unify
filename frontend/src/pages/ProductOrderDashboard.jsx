import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { ShoppingBag, Send, ChevronDown, Check } from "lucide-react";
import orderService from "../services/orderService";
import { getImageUrl } from "../utils/formatters";

const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
};

const getAvatarColor = (id) => {
    const colors = ["bg-blue-500", "bg-orange-500", "bg-green-500", "bg-teal-500", "bg-red-500", "bg-purple-500"];
    return colors[id % colors.length];
};

// Statuses shown in the table dropdown (club-owner settable only)
const PRODUCT_STATUSES = ["Seller Confirmed", "Ready for Pickup", "Order Completed"];
const EVENT_STATUSES = ["ATTENDED", "CANCELLED"];

// All statuses including system-set ones, for the status bar & filter
const ALL_PRODUCT_STATUSES = ["Order Placed", "Seller Confirmed", "Ready for Pickup", "Order Completed"];
const ALL_EVENT_STATUSES = ["PENDING", "CONFIRMED", "ATTENDED", "CANCELLED"];

const statusStyle = {
    // Product statuses
    "Order Placed":      { dot: "bg-primary-blue",   badge: "bg-primary-blue/15 text-primary-blue border border-primary-blue/20" },
    "Seller Confirmed":  { dot: "bg-purple-400",     badge: "bg-purple-400/15 text-purple-400 border border-purple-400/20" },
    "Ready for Pickup":  { dot: "bg-state-success",  badge: "bg-state-success/15 text-state-success border border-state-success/20" },
    "Order Completed":   { dot: "bg-white/30",       badge: "bg-white/8 text-text-secondary border border-white/10" },
    // Event booking statuses
    "PENDING":           { dot: "bg-yellow-400",     badge: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/20" },
    "CONFIRMED":         { dot: "bg-primary-blue",   badge: "bg-primary-blue/15 text-primary-blue border border-primary-blue/20" },
    "ATTENDED":          { dot: "bg-state-success",  badge: "bg-state-success/15 text-state-success border border-state-success/20" },
    "CANCELLED":         { dot: "bg-state-error",    badge: "bg-state-error/15 text-state-error border border-state-error/20" },
};

/* ─── Status dropdown per order ─────────────────────────────── */
const StatusDropdown = ({ value, onChange, type }) => {
    const [open, setOpen] = useState(false);
    const style = statusStyle[value] || { badge: "bg-white/8 text-text-secondary border border-white/10" };
    const options = type === "club-event" ? EVENT_STATUSES : PRODUCT_STATUSES;
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${style.badge}`}
            >
                {value}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-[#1A2F45] border border-white/10 rounded-xl overflow-hidden shadow-xl w-44">
                    {options.map((s) => (
                        <button
                            key={s}
                            onClick={() => { onChange(s); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 transition-colors flex items-center gap-2 ${s === value ? "text-primary-blue" : "text-text-secondary"}`}
                        >
                            {s === value && <Check className="w-3 h-3 shrink-0" />}
                            {s !== value && <div className="w-3 h-3 shrink-0" />}
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Main Page ─────────────────────────────────────────────── */
const ProductOrderDashboard = () => {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const [orders, setOrders] = useState([]);
    const [itemInfo, setItemInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [bulkFrom, setBulkFrom] = useState("Order Placed");
    const [bulkTo, setBulkTo]   = useState("Seller Confirmed");
    const [filterStatus, setFilterStatus] = useState("All Statuses");
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageText, setMessageText] = useState("");

    const user = {
        id: 1, // Mock current user
        name: "Alex Johnson",
        role: "club",
        displayRole: "Clubs & Societies Dashboard",
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (type === "club-product") {
                const res = await orderService.getOrdersByProduct(id);
                if (res.success) {
                    // Set itemInfo from the product in the response (even if no orders yet)
                    if (res.product) setItemInfo(res.product);
                    else if (res.orders?.length > 0) setItemInfo(res.orders[0].clubProduct);

                    const formatted = res.orders.map(o => ({
                        id: o.id,
                        displayId: `#${o.id.toString().padStart(4, '0')}`,
                        name: o.buyer?.name || "Unknown",
                        email: o.buyer?.email || "N/A",
                        initials: getInitials(o.buyer?.name),
                        avatarColor: getAvatarColor(o.buyer?.id),
                        qty: o.qty,
                        size: o.size || "-",
                        colorHex: o.colorHex || null,
                        status: o.status
                    }));
                    setOrders(formatted);
                }
            } else if (type === "club-event") {
                const res = await orderService.getBookingsByEvent(id);
                if (res.success) {
                    const formatted = res.bookings.map(b => ({
                        id: b.id,
                        displayId: `#${b.id.toString().padStart(4, '0')}`,
                        name: b.user?.name || "Unknown",
                        email: b.user?.email || "N/A",
                        initials: getInitials(b.user?.name),
                        avatarColor: getAvatarColor(b.user?.id),
                        qty: b.qty,
                        size: b.tierId || "Standard",
                        colorHex: null,
                        status: b.status
                    }));
                    setOrders(formatted);
                    if (res.bookings.length > 0) {
                        setItemInfo(res.bookings[0].clubEvent);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, type]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            if (type === "club-product") {
                await orderService.updateOrderStatus(orderId, { status: newStatus });
            } else {
                await orderService.updateBookingStatus(orderId, { status: newStatus });
            }
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Status update failed:", error);
            alert("Failed to update status.");
        }
    };

    const applyBulk = async () => {
        const targetIds = orders
            .filter(o => o.status === bulkFrom)
            .map(o => o.id);

        if (targetIds.length === 0) {
            alert(`No orders found with status "${bulkFrom}"`);
            return;
        }

        try {
            if (type === "club-product") {
                await orderService.bulkUpdateOrderStatus(targetIds, bulkTo);
            } else {
                await orderService.bulkUpdateBookingStatus(targetIds, bulkTo);
            }
            fetchData(); // Refresh list
            alert(`Successfully updated ${targetIds.length} orders to ${bulkTo}`);
        } catch (error) {
            console.error("Bulk update failed:", error);
            alert("Failed to apply bulk update.");
        }
    };

    /* Derived stats */
    const ALL_STATUSES = type === "club-event" ? ALL_EVENT_STATUSES : ALL_PRODUCT_STATUSES;
    const displayedOrders = filterStatus === "All Statuses" 
        ? orders 
        : orders.filter((o) => o.status === filterStatus);

    const total = orders.length;
    const counts = ALL_STATUSES.reduce((acc, s) => {
        acc[s] = orders.filter((o) => o.status === s).length;
        return acc;
    }, {});

    const sizeDist = orders.reduce((acc, o) => {
        const key = o.size === "XL" || o.size === "XXL" ? "L/XL" : o.size;
        acc[key] = (acc[key] || 0) + o.qty;
        return acc;
    }, {});

    const bulkStatuses = type === "club-event" ? EVENT_STATUSES : PRODUCT_STATUSES;

    if (loading) {
        return (
            <MainLayout user={user} pageTitle="Order Dashboard">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
                </div>
            </MainLayout>
        );
    }

    const statusBarSegments = [
        { status: "Order Placed",     color: "bg-yellow-400", flex: counts["Order Placed"] || 0 },
        { status: "Seller Confirmed", color: "bg-primary-blue", flex: counts["Seller Confirmed"] || 0 },
        { status: "Ready for Pickup", color: "bg-state-success", flex: counts["Ready for Pickup"] || 0 },
        { status: "Order Completed",  color: "bg-white/30", flex: counts["Order Completed"] || 0 },
    ].filter((s) => s.flex > 0);

    const sizeDistEntries = Object.entries(sizeDist).sort((a, b) => b[1] - a[1]);
    const sizeColors = ["bg-primary-blue", "bg-purple-400", "bg-pink-400", "bg-orange-400"];

    return (
        <MainLayout
            user={user}
            pageTitle="Order Dashboard"
            verificationCount={0}
        >
            <div className="flex flex-col gap-6 pb-12">

                {/* ── Product context strip ── */}
                <div className="flex items-center gap-4">
                    <img
                        src={itemInfo ? (type === "club-product" ? getImageUrl(itemInfo.images?.[0]) : getImageUrl(itemInfo.coverImage)) : ""}
                        alt={itemInfo?.title || "Item"}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                        <p className="text-text-secondary text-xs mb-0.5">Viewing {type === 'club-product' ? 'orders' : 'bookings'} for</p>
                        <h2 className="text-white font-bold text-lg leading-tight">{itemInfo?.title || "Loading..."}</h2>
                        <p className="text-text-secondary text-xs">{itemInfo?.name} · {itemInfo?.price ? `Rs.${itemInfo.price}` : "Free"}</p>
                    </div>
                    <button
                        onClick={() => navigate("/club-owner/dashboard")}
                        className="ml-auto text-text-secondary hover:text-white text-xs font-medium transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* ── Stat Cards Row ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Total Orders */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Total Orders</span>
                            <ShoppingBag className="w-4 h-4 text-text-secondary" />
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold">{total}</span>
                            <span className="text-state-success text-xs font-bold mb-1.5">+2 today</span>
                        </div>
                    </Card>

                    {/* Status Breakdown */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Status Breakdown</span>
                        </div>
                        {/* Stacked bar */}
                        <div className="flex h-2.5 rounded-full overflow-hidden mb-3 gap-0.5">
                            {statusBarSegments.map((seg) => (
                                <div
                                    key={seg.status}
                                    className={`${seg.color} rounded-full transition-all`}
                                    style={{ flex: seg.flex }}
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            {ALL_STATUSES.map((s) => {
                                const st = statusStyle[s];
                                return (
                                    <div key={s} className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                                        <span className="text-[10px] text-text-secondary">
                                            {counts[s]} {s.split(" ")[s.split(" ").length - 1]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Size Distribution */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Distribution</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {sizeDistEntries.map(([size, count], i) => (
                                <div key={size} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-white w-8">{size}</span>
                                    <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${sizeColors[i % sizeColors.length]}`}
                                            style={{ width: `${(count / (orders.reduce((a, o) => a + o.qty, 0))) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-text-secondary text-[10px] w-14 text-right">{count} orders</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Action / Bulk Bar ── */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Send Message - Hidden as requested */}
                    {/* <button 
                        onClick={() => setIsMessageModalOpen(true)}
                        className="flex items-center gap-2 bg-primary-blue hover:bg-primary-blue/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(43,140,238,0.3)]"
                    >
                        <Send className="w-4 h-4" />
                        Send Message
                    </button> */}

                    {/* Select Status Filter */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                        >
                            {filterStatus === "All Statuses" ? "Select Status" : filterStatus}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isStatusDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-52 z-50 bg-[#1A2F45]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                {["All Statuses", ...ALL_STATUSES].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setFilterStatus(s); setIsStatusDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/10 transition-colors flex items-center justify-between ${s === filterStatus ? "text-primary-blue bg-white/5" : "text-white/80"}`}
                                    >
                                        {s}
                                        {s === filterStatus && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Bulk Status */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#1A2F45]/80 border border-white/8 rounded-xl px-3 sm:px-4 py-3 sm:py-2 text-sm w-full xl:w-auto">
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-text-secondary text-[11px] font-medium shrink-0">Bulk Status:</span>
                            {/* From */}
                            <select
                                value={bulkFrom}
                                onChange={(e) => setBulkFrom(e.target.value)}
                                className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs font-medium appearance-none cursor-pointer focus:outline-none min-w-0"
                            >
                                {ALL_STATUSES.map((s) => <option key={s} value={s} className="bg-[#0D1A26]">{s}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                            <span className="text-text-secondary text-[11px] shrink-0">To:</span>
                            {/* To */}
                            <select
                                value={bulkTo}
                                onChange={(e) => setBulkTo(e.target.value)}
                                className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs font-medium appearance-none cursor-pointer focus:outline-none min-w-0"
                            >
                                {bulkStatuses.map((s) => <option key={s} value={s} className="bg-[#0D1A26]">{s}</option>)}
                            </select>

                            <button
                                onClick={applyBulk}
                                className="bg-white text-dark-1 hover:bg-white/90 px-3 sm:px-4 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0"
                            >
                                <span className="sm:hidden">Apply</span>
                                <span className="hidden sm:inline">Apply to All</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Orders Table ── */}
                <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-text-secondary text-[11px] uppercase tracking-wider">
                                    <th className="text-left px-6 py-4 font-medium">{type === 'club-product' ? 'Order' : 'Booking'} ID</th>
                                    <th className="text-left px-6 py-4 font-medium">Student Name</th>
                                    <th className="text-center px-4 py-4 font-medium">Qty</th>
                                    <th className="text-center px-4 py-4 font-medium">{type === 'club-product' ? 'Size' : 'Tier'}</th>
                                    <th className="text-center px-4 py-4 font-medium">Color</th>
                                    <th className="text-right px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedOrders.map((order, i) => (
                                    <tr
                                        key={order.id}
                                        className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i === displayedOrders.length - 1 ? "border-b-0" : ""}`}
                                    >
                                        {/* Order ID */}
                                        <td className="px-6 py-4 font-mono text-xs text-text-secondary">{order.displayId}</td>

                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full ${order.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                    {order.initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{order.name}</p>
                                                    <p className="text-text-secondary text-xs">{order.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Qty */}
                                        <td className="px-4 py-4 text-center font-bold">{order.qty}</td>

                                        {/* Size */}
                                        <td className="px-4 py-4 text-center">
                                            <span className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-lg text-xs font-bold">
                                                {order.size}
                                            </span>
                                        </td>

                                        {/* Color */}
                                        <td className="px-4 py-4 text-center">
                                            <div
                                                className="w-5 h-5 rounded-full border border-white/15 mx-auto"
                                                style={{ backgroundColor: order.colorHex }}
                                            />
                                        </td>

                                        {/* Status dropdown */}
                                        <td className="px-6 py-4 text-right">
                                            <StatusDropdown
                                                value={order.status}
                                                onChange={(s) => updateStatus(order.id, s)}
                                                type={type}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* ── Message Modal Overlay ── */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-md transition-opacity"
                        onClick={() => setIsMessageModalOpen(false)}
                    />
                    
                    {/* Modal */}
                    <div className="relative w-full max-w-[480px] bg-[#0F1C2E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Send Message</h3>
                            <button 
                                onClick={() => setIsMessageModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-3 mb-5 flex gap-3 text-sm text-primary-blue">
                                <div className="mt-0.5">
                                    <Send className="w-4 h-4" />
                                </div>
                                <p className="leading-snug">
                                    Your message will be broadcast to <strong className="font-extrabold">{displayedOrders.length}</strong> {displayedOrders.length === 1 ? "buyer" : "buyers"} currently matching your selected status filter.
                                </p>
                            </div>
                            
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Write important updates, announcements, or pickup instructions..."
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-text-tertiary focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue resize-none"
                            />
                        </div>
                        
                        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsMessageModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Message sent successfully to ${displayedOrders.length} buyers!`);
                                    setMessageText("");
                                    setIsMessageModalOpen(false);
                                }}
                                disabled={!messageText.trim()}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary-blue text-white hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_10px_rgba(43,140,238,0.2)]"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ProductOrderDashboard;
