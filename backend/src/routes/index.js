import express from "express";
import verificationRoutes from "./verification.routes.js";
import reviewRoutes from "./review.routes.js";
import followerRoutes from "./follower.routes.js";
import reportRoutes from "./report.routes.js";
import boostRoutes from "./boost.routes.js";
import baseRoutes from "./base.routes.js";
import suspensionRoutes from "./suspension.routes.js";
import learningRoutes from "./learning.routes.js";
import studentManagementRoutes from "./studentManagement.routes.js";
import businessManagementRoutes from "./businessManagement.routes.js";
import adminToolsRoutes from "./adminTools.routes.js";
import lostAndFoundRoutes from "./lostAndFound.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/followers", followerRoutes);
router.use("/reports", reportRoutes);
router.use("/boosts", boostRoutes);
router.use("/base", baseRoutes);
router.use("/admin/suspended-users", suspensionRoutes);
router.use("/learning", learningRoutes);
router.use("/admin/students", studentManagementRoutes);
router.use("/admin/businesses", businessManagementRoutes);
router.use("/admin/tools", adminToolsRoutes);
router.use("/lost-and-found", lostAndFoundRoutes);

export default router;
