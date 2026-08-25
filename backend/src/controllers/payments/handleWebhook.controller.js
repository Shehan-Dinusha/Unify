import Stripe from "stripe";
import logger from "../../utils/logger.js";
import { processOrderPayment, processBookingPayment } from "../../services/payment.service.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const handleWebhook = async (req, res) => {
  if (!stripe) {
    logger.warn("Stripe webhook called but STRIPE_SECRET_KEY is not configured.");
    return res.status(503).json({ error: "Payment service not configured." });
  }
  const sig = req.headers["stripe-signature"];

  // If stripe-account header is present, this is a Connected Account event.
  // Use the connected account webhook secret. Otherwise use the standard secret.
  const isConnectedEvent = !!req.headers["stripe-account"];
  const webhookSecret = isConnectedEvent
    ? process.env.STRIPE_CONNECTED_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.warn("No webhook secret configured for this event type.");
    return res.status(503).json({ error: "Webhook secret not configured." });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { orderId, bookingId } = paymentIntent.metadata;

    logger.info(`💰 Payment Succeeded: ${paymentIntent.id}`);

    try {
      if (orderId) {
        await processOrderPayment(orderId, paymentIntent);
      } else if (bookingId) {
        await processBookingPayment(bookingId, paymentIntent);
      }
    } catch (error) {
      logger.error("Post-Payment Processing Error:", error);
    }
  }

  res.json({ received: true });
};
