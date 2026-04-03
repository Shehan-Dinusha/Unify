/**
 * Mock data for the Club Owner Dashboard.
 * Move all dashboard-specific static data here to keep the page component clean.
 * Replace with real API calls when the backend is ready.
 */

// ── Stat summary numbers ──────────────────────────────────────────────────────
export const dashboardStats = {
    totalOrders: 1284,
    pendingOrders: 42,
    completedOrders: 1242,
};

// ── Chart data keyed by filter (Month = daily for 30 days, Year = full year) ──
export const chartData = {
    Month: [
        { label: "1",  h: 28 }, { label: "2",  h: 35 }, { label: "3",  h: 22 },
        { label: "4",  h: 40 }, { label: "5",  h: 55 }, { label: "6",  h: 30 },
        { label: "7",  h: 20 }, { label: "8",  h: 45 }, { label: "9",  h: 60 },
        { label: "10", h: 38 }, { label: "11", h: 50 }, { label: "12", h: 42 },
        { label: "13", h: 25 }, { label: "14", h: 18 }, { label: "15", h: 52 },
        { label: "16", h: 63 }, { label: "17", h: 47 }, { label: "18", h: 55 },
        { label: "19", h: 70 }, { label: "20", h: 35 }, { label: "21", h: 22 },
        { label: "22", h: 68 }, { label: "23", h: 74 }, { label: "24", h: 58 },
        { label: "25", h: 62 }, { label: "26", h: 45 }, { label: "27", h: 30 },
        { label: "28", h: 78 }, { label: "29", h: 85 }, { label: "30", h: 80 },
    ],
    Year: [
        { label: "Jan", h: 30 }, { label: "Feb", h: 42 }, { label: "Mar", h: 38 },
        { label: "Apr", h: 55 }, { label: "May", h: 48 }, { label: "Jun", h: 62 },
        { label: "Jul", h: 50 }, { label: "Aug", h: 70 }, { label: "Sep", h: 58 },
        { label: "Oct", h: 85 }, { label: "Nov", h: 74 }, { label: "Dec", h: 65 },
    ],
};


// ── Top products sidebar ──────────────────────────────────────────────────────
export const topProducts = [
    {
        name: "Coding Club Hoodie",
        sold: "136 sales this month",
        revenue: "Rs.4,349",
        img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=80&q=80",
    },
    {
        name: "Adv. Calc Textbook",
        sold: "71 sales this month",
        revenue: "Rs.3,625",
        img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=80&q=80",
    },
    {
        name: "Campus Bicycle",
        sold: "9 additional orders",
        revenue: "Rs.960",
        img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=80&q=80",
    },
];

// ── Revenue breakdown donut chart ─────────────────────────────────────────────
export const revenueBreakdown = [
    { label: "Apparels",  pct: 65, color: "#2B8CEE" },
    { label: "Textbooks", pct: 20, color: "#60A5FA" },
    { label: "Tickets",   pct: 15, color: "#F97316" },
];

// ── Buyer demographics progress bars ─────────────────────────────────────────
export const buyerDemographics = [
    { label: "Engineering",     pct: 42, color: "bg-primary-blue" },
    { label: "Science",         pct: 26, color: "bg-blue-400" },
    { label: "Arts & Humanities", pct: 15, color: "bg-orange-400" },
    { label: "Business",        pct: 12, color: "bg-yellow-400" },
];

// ── Recent orders (seller / club-owner view) ─────────────────────────────────
export const dashboardRecentOrders = [
    {
        id: "do1",
        orderId: "#84921",
        title: "Coding Club Hoodie (Size M)",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
        orderDate: "Oct 26, 2024",
        status: "IN PROGRESS",
        total: "Rs.39.30",
    },
    {
        id: "do2",
        orderId: "#84920",
        title: "Adv. Calc Textbook",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
        orderDate: "Oct 24, 2024",
        status: "COMPLETED",
        total: "Rs.55.50",
    },
    {
        id: "do3",
        orderId: "#84918",
        title: "Coding Club Hoodie (Size L)",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
        orderDate: "Oct 23, 2024",
        status: "COMPLETED",
        total: "Rs.39.30",
    },
    {
        id: "do4",
        orderId: "#84915",
        title: "Campus Bicycle (Used)",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
        orderDate: "Oct 20, 2024",
        status: "PENDING",
        total: "Rs.134.60",
    },
    {
        id: "do5",
        orderId: "#84890",
        title: "Adv. Calc Textbook",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
        orderDate: "Oct 15, 2024",
        status: "COMPLETED",
        total: "Rs.55.50",
    },
];

// ── Product listings grid ─────────────────────────────────────────────────────
export const mockListings = [
    {
        id: "l1",
        title: "Coding Club Hoodie",
        desc: "Premium cotton hoodie with embroidered Unify logo. Essential club merch for all members.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        visible: true,
        color: "#0B1220",
        sizes: ["S", "M"],
        tags: ["Apparel"],
        price: "Rs.35.00",
        updated: "2h ago",
        likes: 1200,
        saves: 24,
    },
    {
        id: "l2",
        title: "Campus Bicycle (Used)",
        desc: "Gently used mountain bike, perfect for getting across campus. Lock included.",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
        visible: true,
        color: "#EF4444",
        frame: "17 in",
        type: "Mountain",
        price: "Rs.120.00",
        updated: "3h ago",
        likes: 860,
        saves: 73,
    },
    {
        id: "l3",
        title: "Campus Bicycle (Used)",
        desc: "Gently used mountain bike, perfect for getting across campus. Lock included.",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
        visible: true,
        color: "#3F3F46",
        frame: "17 in",
        type: "New Ever",
        price: "Rs.120.00",
        updated: "3h ago",
        likes: 860,
        saves: 19,
    },
    {
        id: "l4",
        title: "Adv. Calc Textbook",
        desc: "Required reading for Math 201. Hardcover edition in pristine condition.",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
        visible: true,
        condition: "Like New",
        format: "Hardcover",
        stock: "4 available",
        price: "Rs.50.00",
        updated: "1hr ago",
        likes: 204,
        saves: 12,
    },
    {
        id: "l5",
        title: "Coding Club Hoodie (V2)",
        desc: "Limited edition colorway. Currently drafted and not visible to students.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        visible: false,
        hidden: true,
        color: "#EF4444",
        price: "Rs.40.00",
        status: "Draft",
        updated: "1h ago",
        likes: 0,
        saves: 0,
    },
    {
        id: "l6",
        title: "Coding Club Hoodie (Small)",
        desc: "Small size inventory specific listing. Currently hidden for inventory check.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
        visible: false,
        color: "#3F3F46",
        size: "S",
        stock: "3 available",
        status: "Low Stock",
        price: "Rs.35.00",
        updated: "5h ago",
        likes: 0,
        saves: 12,
    },
];
