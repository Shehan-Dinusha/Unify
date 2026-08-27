import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import { getCurrentUser } from "../../services/authService";

export const useMyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [viewType, setViewType] = useState("Marketplace");

  const user = getCurrentUser();
  const tabs = ["All", "In Progress", "Completed"];

  useEffect(() => {
    fetchAllHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const [ordersRes, bookingsRes] = await Promise.all([
        orderService.getStudentOrders(user.id),
        orderService.getStudentBookings(user.id),
      ]);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
    } catch (err) {
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
      case "PENDING": return "bg-state-warning/10 text-state-warning border-state-warning/20";
      case "Order Placed": return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
      case "Seller Confirmed": return "bg-purple-400/10 text-purple-400 border-purple-400/20";
      case "Ready for Pickup": return "bg-state-success/10 text-state-success border-state-success/20";
      case "Order Completed": return "bg-white/10 text-text-secondary border-white/20";
      case "CONFIRMED": return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
      case "ATTENDED": return "bg-state-success/10 text-state-success border-state-success/20";
      case "CANCELLED": return "bg-state-error/10 text-state-error border-state-error/20";
      case "COMPLETED":
      case "DELIVERED": return "bg-white/10 text-text-secondary border-white/20";
      case "IN PROGRESS":
      case "PROCESSING":
      case "SHIPPED": return "bg-primary-blue/10 text-primary-blue border-primary-blue/20";
      default: return "bg-white/10 text-text-secondary border-white/20";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const currentItems = getFilteredItems();

  return {
    navigate, user, orders, bookings, loading, error, activeTab, setActiveTab,
    viewType, setViewType, tabs, currentItems, getStatusStyles, formatDate, fetchAllHistory,
  };
};
