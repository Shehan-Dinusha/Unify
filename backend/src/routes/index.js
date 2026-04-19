import express from "express";
import verificationRoutes from "./verification.routes.js";
import reviewRoutes from "./review.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/reviews", reviewRoutes);

export default router;
