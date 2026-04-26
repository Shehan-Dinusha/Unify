import express from "express";
import { createPaymentIntent, handleWebhook } from "../controllers/payments/index.js";

const router = express.Router();

// Route to create a Stripe PaymentIntent
router.post("/create-payment-intent", createPaymentIntent);

// Stripe Webhook endpoint (Requires raw body for signature verification)
// We already configured app.js to provide req.rawBody for this specific path
router.post("/webhook", handleWebhook);

export default router;
