import Stripe from "stripe";
import boostService from "../../services/boost.service.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";
import { sequelize } from "../../modules/index.js";
import BoostPurchase from "../../modules/BoostPurchase.model.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

//confirm boost payment after stripe checkout redirect
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
    
    // ─── ISSUE #5: Safe parseInt with NaN validation ────────────────────
    let postId = null;
    if (metadata.postId) {
      postId = parseInt(metadata.postId, 10);
      if (isNaN(postId) || postId <= 0) {
        logger.error(`Invalid postId in session metadata: ${metadata.postId}`);
        return sendResponse(res, 400, false, "Invalid postId in session metadata");
      }
    }

    const postType = metadata.postType || null;
    const userId = metadata.userId ? parseInt(metadata.userId, 10) : req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    // ─── ISSUE #5: Safe parseFloat with NaN validation ──────────────────
    let amount = 0;
    if (metadata.amount) {
      amount = parseFloat(metadata.amount);
      if (isNaN(amount) || amount <= 0) {
        logger.error(`Invalid amount in session metadata: ${metadata.amount}`);
        return sendResponse(res, 400, false, "Invalid amount in session metadata");
      }
    }

    if (!packageId) {
      return sendResponse(res, 400, false, "Package ID missing from session metadata.");
    }

    // ─── ISSUE #12: Wrap payment confirmation in transaction for idempotency
    const transaction = await sequelize.transaction();
    try {
      // Check if this payment was already processed (idempotent)
      const existing = await BoostPurchase.findOne({
        where: { transactionId: sessionId },
        transaction,
      });

      if (existing) {
        logger.warn(`Duplicate payment confirmation detected: sessionId=${sessionId}`);
        await transaction.commit();
        return sendResponse(res, 200, true, "Boost payment already confirmed", {
          purchaseId: existing.id,
          transactionId: sessionId,
          packageId: existing.packageId,
          postId: existing.postId,
          amount: Number(existing.amount),
          purchaseDate: existing.purchaseDate,
          expiryDate: existing.expiryDate,
          status: existing.status,
        });
      }

      // ── 4. Create the BoostPurchase record via service ─────────────────
      const result = await boostService.purchaseBoost(userId, packageId, postId, postType);

      await transaction.commit();

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
    } catch (txErr) {
      await transaction.rollback();
      throw txErr;
    }
  } catch (error) {
    if (error.statusCode) {
      return sendResponse(res, error.statusCode, false, error.message);
    }
    logger.error(`Error in confirmBoostPayment: ${error.message}`);
    // Don't leak raw DB/FK errors to the client
    const isFkOrDbError =
      error.name === "SequelizeForeignKeyConstraintError" ||
      error.name === "SequelizeDatabaseError" ||
      (error.message && error.message.includes("violates foreign key"));
    const clientMessage = isFkOrDbError
      ? "Payment was received but we could not activate your boost. Please contact support with your payment reference."
      : "An unexpected error occurred. Please try again.";
    return sendResponse(res, 500, false, clientMessage);
  }
};
