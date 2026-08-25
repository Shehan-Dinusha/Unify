import express from 'express';
import { BoostController } from '../controllers/index.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ── Package Management (Admin) ───────────────────────────────────────────────

//Create a new boost package
router.post(
  '/packages',
  protect, authorize('Admin'),
  BoostController.createPackage
);

//Get all packages (live only, or ?includeArchived=true)
router.get(
  '/packages',
  BoostController.getPackages
);

//Get specific package details
router.get(
  '/packages/:id',
  BoostController.getPackageById
);

//Update package details
router.put(
  '/packages/:id',
  protect, authorize('Admin'),
  BoostController.updatePackage
);

//Archive (soft-delete) a package
router.delete(
  '/packages/:id',
  protect, authorize('Admin'),
  BoostController.deletePackage
);

// ── Stripe Boost Payment (One-to-One Platform Payment) ──────────────────────

//Create Stripe Checkout for boost purchase
router.post(
  '/create-checkout-session',
  protect,
  BoostController.createBoostCheckoutSession
);

//Confirm payment after Stripe redirect
router.post(
  '/confirm-payment',
  protect,
  BoostController.confirmBoostPayment
);

// ── Purchase (User) — Direct Purchase (no Stripe) ───────────────────────────

//Purchase a boost package (direct, no Stripe)
router.post(
  '/purchase',
  protect,
  BoostController.purchaseBoost
);

//Get user's active boosts where expiryDate > NOW
router.get(
  '/my-boosts',
  protect,
  BoostController.getMyBoosts
);

// ── Admin Statistics ─────────────────────────────────────────────────────────

//Admin dashboard boost stats
router.get(
  '/admin/statistics',
  protect, authorize('Admin'),
  BoostController.getBoostStatistics
);

//Admin configuration changes logs
router.get(
  '/admin/logs',
  protect, authorize('Admin'),
  BoostController.getLogs
);

//Admin dashboard stats (DB-driven tiles)
router.get(
  '/admin/stats',
  protect, authorize('Admin'),
  BoostController.getAdminStats
);

// ── Campaign Management (Business User) ──────────────────────────────────────

//Create a new campaign (select package + boost post)
router.post(
  '/campaigns',
  BoostController.createCampaign
);

//Get all campaigns for the logged-in user
router.get(
  '/campaigns',
  BoostController.getCampaigns
);

//Get specific campaign details
router.get(
  '/campaigns/:id',
  BoostController.getCampaignById
);

//Update campaign status
router.put(
  '/campaigns/:id/status',
  BoostController.updateCampaignStatus
);

// ── Campaign Analytics ───────────────────────────────────────────────────────


// ── Business User Purchase Analytics ─────────────────────────────────────────

//Get boost analytics by BoostPurchase ID (used by business users from MyPosts)
router.get(
  '/purchase/:purchaseId/analytics',
  protect,
  BoostController.getBoostAnalyticsByPurchase
);

// ── Interactions ─────────────────────────────────────────────────────────────

//Record an interaction
router.post(
  '/campaigns/:id/interactions',
  BoostController.recordInteraction
);

//Track lightweight metrics (impressions, clicks)
router.post(
  '/track',
  BoostController.trackMetrics
);

//Get interactions for a campaign
router.get(
  '/campaigns/:id/interactions',
  BoostController.getInteractions
);

// ── Payment Webhook (Stripe Stub) ────────────────────────────────────────────

//Handle payment status from Stripe
router.post(
  '/webhooks/payment',
  BoostController.handlePaymentWebhook
);

export default router;
