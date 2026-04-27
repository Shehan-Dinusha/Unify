import Stripe from "stripe";
import logger from "../../utils/logger.js";
import { processOrderPayment, processBookingPayment } from "../../services/payment.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
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
