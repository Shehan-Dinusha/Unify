import express from "express";
import verificationRoutes from "./verification.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import testRbacRoutes from "./test_rbac.routes.js";
import reviewRoutes from "./review.routes.js";
import followerRoutes from "./follower.routes.js";
import reportRoutes from "./report.routes.js";
import boostRoutes from "./boost.routes.js";
import baseRoutes from "./base.routes.js";
import learningRoutes from "./learning.routes.js";
import uploadRoutes from "./upload.routes.js";
import educationRoutes from "./education.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/test-rbac", testRbacRoutes);
router.use("/verifications", verificationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/followers", followerRoutes);
router.use("/reports", reportRoutes);
router.use("/boosts", boostRoutes);
router.use("/base", baseRoutes);
router.use("/learning", learningRoutes);
router.use("/upload", uploadRoutes);
router.use("/education", educationRoutes);

export default router;
