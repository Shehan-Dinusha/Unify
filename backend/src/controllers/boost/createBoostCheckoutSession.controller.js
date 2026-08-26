import Stripe from "stripe";
import { BoostPackage } from "../../modules/index.js";
import { sendResponse } from "../../utils/response.js";
import logger from "../../utils/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

//Create a Stripe Checkout Session for a Boost purchase.
export const createBoostCheckoutSession = async (req, res) => {
  if (!stripe) {
    return sendResponse(
      res,
      503,
      false,
      "Payment service not configured. Please set STRIPE_SECRET_KEY in your environment."
    );
  }

  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, false, "Authentication required.");
    }

    const { packageId, postId, postType, packageName, durationDays } =
      req.body;

    // ── Validation ─────────────────────────────────────────────────────
    if (!packageId) {
      return sendResponse(res, 400, false, "Package ID is required.");
    }

    // Validate the package exists and is live
    const pkg = await BoostPackage.findByPk(packageId);
    if (!pkg) {
      return sendResponse(res, 404, false, "Boost package not found.");
    }
    if (pkg.status !== "live") {
      return sendResponse(
        res,
        400,
        false,
        "This boost package is no longer available."
      );
    }

    const frontendUrl =
      process.env.CORS_ORIGIN || "http://localhost:5173";

    // ── Issue #19 fix: Add error handling for Stripe API calls ──────────
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "lkr",
              product_data: {
                name: `${packageName || pkg.name} — Boost Package`,
                description: `Boost your post for ${durationDays || pkg.durationValue} ${pkg.durationUnit}. Priority feed placement and enhanced visibility.`,
              },
              unit_amount: Math.round(Number(pkg.price) * 100), // always from DB — never trust client
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${frontendUrl}/business/boost-post/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/business/boost-post/confirm`,
        metadata: {
          type: "boost_purchase",
          packageId: packageId,
          postId: postId ? String(postId) : "",
          postType: postType || "",
          userId: userId ? String(userId) : "",
          durationDays: String(durationDays || 0),
          amount: String(Number(pkg.price)), // audit: actual DB price charged
        },
      });
    } catch (stripeErr) {
      logger.error(`Stripe session creation error: ${stripeErr.message}`);
      return sendResponse(res, 500, false, "Failed to create payment session. Please try again.");
    }

    logger.info(
      `Stripe Boost Checkout Session created: ${session.id} for package ${packageId}, post ${postId || "none"}`
    );

    return res
      .status(200)
      .json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    logger.error(`Stripe Boost Checkout Error: ${error.message}`);
    return sendResponse(res, 500, false, error.message);
  }
};
