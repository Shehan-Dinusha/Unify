import express from "express";
import verificationRoutes from "./verification.routes.js";
import reportRoutes from "./report.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/reports", reportRoutes);

export default router;
