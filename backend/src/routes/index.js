import express from "express";
import verificationRoutes from "./verification.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import testRbacRoutes from "./test_rbac.routes.js";
import postRoutes from "./post.routes.js";
import orderRoutes from "./order.routes.js";
import bookingRoutes from "./booking.routes.js";
import paymentRoutes from "./payment.routes.js";
import reviewRoutes from "./review.routes.js";
import followerRoutes from "./follower.routes.js";
import reportRoutes from "./report.routes.js";
import boostRoutes from "./boost.routes.js";
import baseRoutes from "./base.routes.js";
import suspensionRoutes from "./suspension.routes.js";
import learningRoutes from "./learning.routes.js";
import educationRoutes from "./education.routes.js";
import studentManagementRoutes from "./studentManagement.routes.js";
import businessManagementRoutes from "./businessManagement.routes.js";
import adminToolsRoutes from "./adminTools.routes.js";
import lostAndFoundRoutes from "./lostAndFound.routes.js";
import newsfeedRoutes from "./newsfeed.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/test-rbac", testRbacRoutes);
router.use("/verifications", verificationRoutes);
router.use("/posts", postRoutes);
router.use("/orders", orderRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/followers", followerRoutes);
router.use("/reports", reportRoutes);
router.use("/boosts", boostRoutes);
router.use("/base", baseRoutes);
router.use("/admin/suspended-users", suspensionRoutes);
router.use("/learning", learningRoutes);
router.use("/education", educationRoutes);
router.use("/admin/students", studentManagementRoutes);
router.use("/admin/businesses", businessManagementRoutes);
router.use("/admin/tools", adminToolsRoutes);
router.use("/lost-and-found", lostAndFoundRoutes);
router.use("/newsfeed", newsfeedRoutes);

export default router;
