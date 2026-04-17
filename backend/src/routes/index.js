import express from "express";
import verificationRoutes from "./verification.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);

export default router;
