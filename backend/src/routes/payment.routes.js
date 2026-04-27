import express from "express";
import { handleWebhook, createCheckoutSession } from "../controllers/payments/index.js";

const router = express.Router();

// Route to create a Stripe Checkout Session
router.post("/create-checkout-session", createCheckoutSession);

// Stripe Webhook endpoint (Requires raw body for signature verification)
// We already configured app.js to provide req.rawBody for this specific path
router.post("/webhook", handleWebhook);

export default router;
