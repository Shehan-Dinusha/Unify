import Stripe from "stripe";
import logger from "../../utils/logger.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "lkr", metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in smallest unit
      currency: currency.toLowerCase(),
      metadata, // Contains orderId or bookingId
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    logger.error("Stripe PaymentIntent Error:", error);
    res.status(500).json({ error: error.message });
  }
};
