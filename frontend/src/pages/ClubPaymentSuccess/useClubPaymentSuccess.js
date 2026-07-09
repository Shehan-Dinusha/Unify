import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import orderService from "../../services/orderService";
import { getCurrentUser } from "../../services/authService";

export const useClubPaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const [order, setOrder] = useState(location.state?.order || null);
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const fetchOrder = async () => {
      if (order) return;
      const params = new URLSearchParams(location.search);
      const orderId = params.get("order_id");
      const bookingId = params.get("booking_id");
      if (orderId) {
        try {
          const result = await orderService.getOrderDetails(orderId);
          setOrder(result.order);
          if (result.order.clubProduct) setProduct(result.order.clubProduct);
        } catch (error) {
          navigate("/marketplace/club");
        } finally {
          setLoading(false);
        }
      } else if (bookingId) {
        try {
          const result = await orderService.getBookingDetails(bookingId);
          setOrder({ ...result.booking, orderId: result.booking.bookingId, size: result.booking.tierId, pickupLocation: "Details provided in email" });
          if (result.booking.event) setProduct(result.booking.event);
        } catch (error) {
          navigate("/marketplace/club");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/marketplace/club");
      }
    };
    fetchOrder();
  }, [order, location.search, navigate]);

  return { navigate, user, order, product, loading };
};
