import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import orderService from "../../services/orderService";
import { getCurrentUser } from "../../services/authService";

export const useClubCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);

  const { product, selectedColor, selectedSize, quantity } = location.state || {};

  useEffect(() => {
    if (!product) navigate("/marketplace/club");
  }, [product, navigate]);

  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      let sessionResponse;
      const subtotal = parseFloat(product.price) * (quantity || 1);

      if (product.postType === "club-event") {
        const tierId = selectedSize || (product.tiers?.length > 0 ? product.tiers[0].name : "Standard");
        const bookingData = { userId: user.id, eventId: product.id, tierId, qty: quantity || 1 };
        const result = await orderService.createBooking(bookingData);
        if (subtotal === 0) {
          navigate(`/marketplace/club/payment-success?booking_id=${result.booking.id}`);
          return;
        }
        sessionResponse = await orderService.createCheckoutSession({
          bookingId: result.booking.bookingId, amount: subtotal,
          productName: product.name,
          successUrl: `${window.location.origin}/marketplace/club/payment-success?booking_id=${result.booking.id}`,
          cancelUrl: `${window.location.origin}/marketplace/club/payment-cancel`,
        });
      } else {
        const orderData = {
          userId: user.id, postId: product.id, qty: quantity || 1,
          color: selectedColor?.name, colorHex: selectedColor?.hex,
          size: selectedSize, paymentMethod: "STRIPE",
        };
        const result = await orderService.createOrder(orderData);
        if (subtotal === 0) {
          navigate(`/marketplace/club/payment-success?order_id=${result.order.id}`);
          return;
        }
        sessionResponse = await orderService.createCheckoutSession({
          orderId: result.order.orderId, amount: subtotal,
          productName: product.name,
          successUrl: `${window.location.origin}/marketplace/club/payment-success?order_id=${result.order.id}`,
          cancelUrl: `${window.location.origin}/marketplace/club/payment-cancel`,
        });
      }

      if (sessionResponse.success && sessionResponse.url) {
        window.location.href = sessionResponse.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : (error.error || error.message || "Failed to proceed to payment. Please try again.");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return { user, loading, product: null, subtotal: 0, total: 0, handleProceedToPayment, navigate };

  const subtotal = parseFloat(product.price) * (quantity || 1);
  const total = subtotal;

  return { user, loading, product, selectedColor, selectedSize, quantity, subtotal, total, handleProceedToPayment, navigate };
};
