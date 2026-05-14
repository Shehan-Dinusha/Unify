import express from 'express';
import { BoostController } from '../controllers/index.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Boost System Routes
 * 100% Compatible with Frontend UI Scenarios.
 *
 * Covers:
 * - Package Management (Admin: BoostController + BoostPackageForm pages)
 * - Purchase Flow (Business User: BoostSelectPackage + BoostConfirmOrder + BoostPostSuccess)
 * - Campaign Lifecycle (Business User)
 * - Analytics & Interactions (Admin/Business: BoostAnalytics page)
 * - Payment Webhook (Stripe Stub)
 */

// ── Package Management (Admin) ───────────────────────────────────────────────

// POST /api/v1/boosts/packages - Create a new boost package
router.post(
  '/packages',
  protect, authorize('Admin'),
  BoostController.createPackage
);

// GET /api/v1/boosts/packages - Get all packages (live only, or ?includeArchived=true)
router.get(
  '/packages',
  BoostController.getPackages
);

// GET /api/v1/boosts/packages/:id - Get specific package details
router.get(
  '/packages/:id',
  BoostController.getPackageById
);

// PUT /api/v1/boosts/packages/:id - Update package details
router.put(
  '/packages/:id',
  protect, authorize('Admin'),
  BoostController.updatePackage
);

// DELETE /api/v1/boosts/packages/:id - Archive (soft-delete) a package
router.delete(
  '/packages/:id',
  protect, authorize('Admin'),
  BoostController.deletePackage
);

// ── Stripe Boost Payment (One-to-One Platform Payment) ──────────────────────

// POST /api/v1/boosts/create-checkout-session - Create Stripe Checkout for boost purchase
router.post(
  '/create-checkout-session',
  protect,
  BoostController.createBoostCheckoutSession
);

// POST /api/v1/boosts/confirm-payment - Confirm payment after Stripe redirect
router.post(
  '/confirm-payment',
  protect,
  BoostController.confirmBoostPayment
);

// ── Purchase (User) — Direct Purchase (no Stripe) ───────────────────────────

// POST /api/v1/boosts/purchase - Purchase a boost package (direct, no Stripe)
router.post(
  '/purchase',
  protect,
  BoostController.purchaseBoost
);

// GET /api/v1/boosts/my-boosts - Get user's active boosts where expiryDate > NOW
router.get(
  '/my-boosts',
  protect,
  BoostController.getMyBoosts
);

// ── Admin Statistics ─────────────────────────────────────────────────────────

// GET /api/v1/boosts/admin/statistics - Admin dashboard boost stats
router.get(
  '/admin/statistics',
  protect, authorize('Admin'),
  BoostController.getBoostStatistics
);

// GET /api/v1/boosts/admin/logs - Admin configuration changes logs
router.get(
  '/admin/logs',
  protect, authorize('Admin'),
  BoostController.getLogs
);

// GET /api/v1/boosts/admin/stats - Admin dashboard stats (DB-driven tiles)
router.get(
  '/admin/stats',
  protect, authorize('Admin'),
  BoostController.getAdminStats
);

// ── Campaign Management (Business User) ──────────────────────────────────────

// POST /api/v1/boosts/campaigns - Create a new campaign (select package + boost post)
router.post(
  '/campaigns',
  BoostController.createCampaign
);

// GET /api/v1/boosts/campaigns - Get all campaigns for the logged-in user
router.get(
  '/campaigns',
  BoostController.getCampaigns
);

// GET /api/v1/boosts/campaigns/:id - Get specific campaign details
router.get(
  '/campaigns/:id',
  BoostController.getCampaignById
);

// PUT /api/v1/boosts/campaigns/:id/status - Update campaign status
router.put(
  '/campaigns/:id/status',
  BoostController.updateCampaignStatus
);

// ── Campaign Analytics ───────────────────────────────────────────────────────

// GET /api/v1/boosts/campaigns/:id/analytics - Get campaign performance analytics
router.get(
  '/campaigns/:id/analytics',
  BoostController.getCampaignAnalytics
);

// ── Interactions ─────────────────────────────────────────────────────────────

// POST /api/v1/boosts/campaigns/:id/interactions - Record an interaction
router.post(
  '/campaigns/:id/interactions',
  BoostController.recordInteraction
);

// GET /api/v1/boosts/campaigns/:id/interactions - Get interactions for a campaign
router.get(
  '/campaigns/:id/interactions',
  BoostController.getInteractions
);

// ── Payment Webhook (Stripe Stub) ────────────────────────────────────────────

// POST /api/v1/boosts/webhooks/payment - Handle payment status from Stripe
router.post(
  '/webhooks/payment',
  BoostController.handlePaymentWebhook
);

export default router;
