import Stripe from "stripe";
import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Confirm a Boost payment after Stripe Checkout redirect.
 *
 * Called by the frontend BoostPostSuccess page with { sessionId }.
 * 1. Retrieves the Stripe session to verify payment_status === 'paid'.
 * 2. Reads metadata (packageId, postId, userId) from the session.
 * 3. Calls boostService.purchaseBoost() to create the BoostPurchase record
 *    and mark the post as promoted.
 * 4. Returns the purchase data to the frontend for display.
 *
 * This prevents double-purchases because boostService checks for existing active
 * boosts on the same post, and the Stripe session can only be confirmed once.
 */
export const confirmBoostPayment = async (req, res) => {
  if (!stripe) {
    return sendResponse(
      res,
      503,
      false,
      "Payment service not configured."
    );
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return sendResponse(res, 400, false, "Session ID is required.");
    }

    // ── 1. Retrieve the Stripe session ─────────────────────────────────
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeErr) {
      logger.error(`Stripe session retrieve error: ${stripeErr.message}`);
      return sendResponse(
        res,
        400,
        false,
        "Invalid or expired payment session."
      );
    }

    // ── 2. Verify payment was successful ───────────────────────────────
    if (session.payment_status !== "paid") {
      return sendResponse(
        res,
        400,
        false,
        `Payment was not completed. Status: ${session.payment_status}`
      );
    }

    // ── 3. Extract metadata from the session ───────────────────────────
    const metadata = session.metadata || {};

    if (metadata.type !== "boost_purchase") {
      return sendResponse(
        res,
        400,
        false,
        "This session is not a boost purchase."
      );
    }

    const packageId = metadata.packageId;
    const postId = metadata.postId ? parseInt(metadata.postId, 10) : null;
    const postType = metadata.postType || null;
    const userId = metadata.userId ? parseInt(metadata.userId, 10) : (req.user?.id || 1);
    const amount = metadata.amount ? parseFloat(metadata.amount) : 0;

    if (!packageId) {
      return sendResponse(res, 400, false, "Package ID missing from session metadata.");
    }

    // ── 4. Create the BoostPurchase record via service ─────────────────
    const result = await boostService.purchaseBoost(userId, packageId, postId, postType);

    logger.info(
      `Boost payment confirmed. Session: ${sessionId}, TXN: ${result.transactionId}, Post: ${postId || "none"}`
    );

    // ── 5. Return data for the success page ────────────────────────────
    return sendResponse(res, 200, true, "Boost payment confirmed successfully", {
      purchaseId: result.purchaseId,
      transactionId: result.transactionId,
      packageId: result.packageId,
      packageName: result.packageName,
      postId: result.postId,
      budget: result.amount,
      amount: result.amount,
      purchaseDate: result.purchaseDate,
      expiryDate: result.expiryDate,
      durationDays: result.durationDays,
      status: result.status,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in confirmBoostPayment: ${error.message}`);
    return sendResponse(res, 500, false, error.message);
  }
};
