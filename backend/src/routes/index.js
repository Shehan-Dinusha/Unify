import express from "express";
import verificationRoutes from "./verification.routes.js";
import postRoutes from "./post.routes.js";
import orderRoutes from "./order.routes.js";
import bookingRoutes from "./booking.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = express.Router();

// Routes will be registered here as development progresses.
router.use("/verifications", verificationRoutes);
router.use("/posts", postRoutes);
router.use("/orders", orderRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

export default router;
