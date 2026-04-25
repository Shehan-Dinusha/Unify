import express from "express";
import verificationRoutes from "./verification.routes.js";
import reviewRoutes from "./review.routes.js";
import followerRoutes from "./follower.routes.js";
import reportRoutes from "./report.routes.js";
import boostRoutes from "./boost.routes.js";
import baseRoutes from "./base.routes.js";
import suspensionRoutes from "./suspension.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/followers", followerRoutes);
router.use("/reports", reportRoutes);
router.use("/boosts", boostRoutes);
router.use("/base", baseRoutes);
router.use("/admin/suspended-users", suspensionRoutes);

export default router;
