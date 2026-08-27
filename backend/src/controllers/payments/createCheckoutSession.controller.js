import Stripe from "stripe";
import logger from "../../utils/logger.js";
import { Order, EventBooking, ClubEventPost, ClubProfile } from "../../modules/index.js";

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

    // 1. Find the seller's Stripe Account ID
    let sellerId = null;
    if (orderId) {
      // Find by order string ID (orderId field in DB)
      const order = await Order.findOne({ where: { orderId } });
      if (order) sellerId = order.sellerId;
    } else if (bookingId) {
      // Find by booking string ID (bookingId field in DB)
      const booking = await EventBooking.findOne({
        where: { bookingId },
        include: [{ model: ClubEventPost, as: "event" }]
      });
      if (booking && booking.event) sellerId = booking.event.authorId;
    }

    if (!sellerId) {
      return res.status(404).json({ error: "Seller information not found." });
    }

    const clubProfile = await ClubProfile.findOne({ where: { userId: sellerId } });
    const destination = clubProfile?.stripeAccountId;

    if (!destination) {
      return res.status(400).json({
        error: "Seller has not connected their Stripe account. Payments cannot be processed for this item."
      });
    }

    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";

    // 2. Create the session with destination transfer
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
      payment_intent_data: {
        transfer_data: {
          destination: destination,
        },
        metadata: {
          orderId: orderId || null,
          bookingId: bookingId || null,
          sellerId: sellerId.toString()
        },
      },
      success_url: successUrl || `${frontendUrl}/marketplace/club/payment-success?${orderId ? `order_id=${orderId}` : `booking_id=${bookingId}`}`,
      cancel_url: cancelUrl || `${frontendUrl}/marketplace/club/checkout`,
      metadata: {
        orderId: orderId || null,
        bookingId: bookingId || null,
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    logger.error("Stripe Checkout Session Error:", error);
    res.status(500).json({ error: error.message });
  }
};
