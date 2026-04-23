import express from "express";
import verificationRoutes from "./verification.routes.js";
import postRoutes from "./post.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/posts", postRoutes);

export default router;
