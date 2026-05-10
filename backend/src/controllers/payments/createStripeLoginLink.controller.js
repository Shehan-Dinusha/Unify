import Stripe from "stripe";
import { ClubProfile } from "../../modules/index.js";
import logger from "../../utils/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createStripeLoginLink = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: "Payment service not configured." });
  }

  try {
    const userId = req.user.id;
    const clubProfile = await ClubProfile.findOne({ where: { userId } });
    
    if (!clubProfile?.stripeAccountId) {
      return res.status(400).json({ error: "Stripe account not found for this club. Please setup payments first." });
    }

    // Verify if account is actually fully created
    const account = await stripe.accounts.retrieve(clubProfile.stripeAccountId);
    if (!account.details_submitted) {
        // If not finished onboarding, return an error so the UI can redirect to onboarding instead
        return res.status(400).json({ error: "ONBOARDING_INCOMPLETE" });
    }

    const loginLink = await stripe.accounts.createLoginLink(clubProfile.stripeAccountId);

    res.status(200).json({ success: true, url: loginLink.url });
  } catch (error) {
    logger.error("Stripe Login Link Error:", error);
    res.status(500).json({ error: error.message });
  }
};
