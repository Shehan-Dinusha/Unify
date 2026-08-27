import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Package, ShieldCheck, Truck } from "lucide-react";
import orderService from "../../services/orderService";

const getTimeline = (order) => {
  if (!order) return [];
  const statuses = ["PENDING", "Order Placed", "Seller Confirmed", "Ready for Pickup", "Order Completed"];
  const titles = { PENDING: "Pending", "Order Placed": "Order Placed", "Seller Confirmed": "Seller Confirmed", "Ready for Pickup": "Ready for Pickup", "Order Completed": "Order Completed" };
  const icons = { PENDING: Clock, "Order Placed": Package, "Seller Confirmed": ShieldCheck, "Ready for Pickup": Truck, "Order Completed": CheckCircle };
  const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === order.status?.toLowerCase());
  return statuses.map((status, index) => {
    let itemStatus = "upcoming";
    if (index < currentStatusIndex) itemStatus = "completed";
    else if (index === currentStatusIndex) itemStatus = "current";
    const historyItem = order.timeline?.find(t => t.status?.toLowerCase() === status.toLowerCase());
    const date = historyItem ? new Date(historyItem.timestamp).toLocaleDateString("en-US", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    }) : null;
    return { title: titles[status], status: itemStatus, icon: icons[status], date };
  });
};

export const useOrderDetails = () => {
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
        if (response.success) setOrder(response.order);
      } catch (err) {
        setError(err.error || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const timeline = getTimeline(order);

  return { navigate, user, order, loading, error, timeline };
};
