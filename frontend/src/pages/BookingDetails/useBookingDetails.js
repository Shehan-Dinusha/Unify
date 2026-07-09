import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Circle, Clock, ShieldCheck } from "lucide-react";
import orderService from "../../services/orderService";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const getTimeline = (booking) => {
  if (!booking) return [];
  const statuses = ["PENDING", "CONFIRMED", "ATTENDED"];
  const titles = { PENDING: "Payment Pending", CONFIRMED: "Payment Confirmed", ATTENDED: "Event Attended" };
  const icons = { PENDING: Clock, CONFIRMED: ShieldCheck, ATTENDED: CheckCircle };
  const currentStatusIndex = statuses.findIndex(s => s.toLowerCase() === booking.status?.toLowerCase());
  return statuses.map((status, index) => {
    let itemStatus = "upcoming";
    if (index < currentStatusIndex) itemStatus = "completed";
    else if (index === currentStatusIndex) itemStatus = "current";
    const historyItem = booking.timeline?.find(t => t.status?.toLowerCase() === status.toLowerCase());
    const date = historyItem ? new Date(historyItem.timestamp).toLocaleDateString("en-US", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    }) : null;
    return { title: titles[status], status: itemStatus, icon: icons[status], date };
  });
};

export const useBookingDetails = () => {
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
        if (response.success) setBooking(response.booking);
      } catch (err) {
        setError(err.error || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  const timeline = getTimeline(booking);

  return { navigate, user, booking, loading, error, timeline, formatDate };
};
