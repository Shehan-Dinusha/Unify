import express from "express";
import { handleWebhook, createCheckoutSession, createStripeAccount, createStripeLoginLink } from "../controllers/payments/index.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Stripe Onboarding for Club Owners
router.post("/onboard-club", protect, authorize("Club"), createStripeAccount);

// Stripe Login Link for Dashboard
router.post("/login-link", protect, authorize("Club"), createStripeLoginLink);

// Route to create a Stripe Checkout Session
router.post("/create-checkout-session", createCheckoutSession);

// Stripe Webhook endpoint (Requires raw body for signature verification)
// We already configured app.js to provide req.rawBody for this specific path
router.post("/webhook", handleWebhook);

export default router;
