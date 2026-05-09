import Stripe from "stripe";
import { ClubProfile } from "../../modules/index.js";
import logger from "../../utils/logger.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createStripeAccount = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: "Payment service not configured." });
  }

  try {
    const userId = req.user.id;
    
    // Check if club profile exists
    let clubProfile = await ClubProfile.findOne({ where: { userId } });
    if (!clubProfile) {
      return res.status(404).json({ error: "Club profile not found." });
    }

    let stripeAccountId = clubProfile.stripeAccountId;

    // Check if account already exists and is fully setup to receive transfers
    if (stripeAccountId) {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      // Ensure details are submitted AND transfers capability is active
      if (account.details_submitted && account.capabilities?.transfers === "active") {
         return res.status(200).json({ success: true, alreadyConnected: true });
      }
    }

    if (!stripeAccountId) {
      // Create a new Express account
      const account = await stripe.accounts.create({
        type: "express",
        country: "AU", // Changed to AU as requested by user
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
           userId: userId.toString(),
           clubName: clubProfile.clubName
        }
      });

      stripeAccountId = account.id;
      
      // Save to database
      await clubProfile.update({ stripeAccountId });
    }

    // Generate onboarding link
    const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${frontendUrl}/club-owner/dashboard`, // Redirect back if they refresh
      return_url: `${frontendUrl}/club-owner/dashboard`, // Redirect back after success
      type: "account_onboarding",
    });

    res.status(200).json({ success: true, url: accountLink.url });
  } catch (error) {
    logger.error("Stripe Account Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};
