import Stripe from "stripe";
import logger from "../../utils/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: "Payment service not configured." });
  }
  try {
    const { orderId, bookingId, amount, productName, successUrl, cancelUrl } = req.body;

    if ((!orderId && !bookingId) || !amount || !productName) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${frontendUrl}/marketplace/club/payment-success?${orderId ? `order_id=${orderId}` : `booking_id=${bookingId}`}`,
      cancel_url: cancelUrl || `${frontendUrl}/marketplace/club/checkout`,
      metadata: {
        orderId: orderId || null,
        bookingId: bookingId || null,
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId || null,
          bookingId: bookingId || null,
        },
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    logger.error("Stripe Checkout Session Error:", error);
    res.status(500).json({ error: error.message });
  }
};
