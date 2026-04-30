import express from "express";
import { OrderController } from "../controllers/index.js";

const router = express.Router();

// Route to create a new order (e.g. buying a club product)
router.post("/", OrderController.createOrder);

// Routes for fetching orders
router.get("/student/:userId", OrderController.getStudentOrders);
router.get("/club/:userId", OrderController.getClubOrders);

// Analytics routes for club owners
router.get("/analytics/stats/:userId", OrderController.getClubOrderStats);
router.get("/analytics/trends/:userId", OrderController.getClubOrderTrends);
router.get(
  "/analytics/top-products/:userId",
  OrderController.getClubTopProducts,
);
router.get(
  "/analytics/demographics/:userId",
  OrderController.getClubBuyerDemographics,
);
router.get(
  "/analytics/revenue/:userId",
  OrderController.getClubRevenueBreakdown,
);

// Routes for bulk status update and specific product orders
router.patch("/bulk-status", OrderController.bulkUpdateOrderStatus);
router.get("/product/:productId", OrderController.getOrdersByProduct);

// Route for updating individual order status
router.patch("/:id/status", OrderController.updateOrderStatus);

// Club owner: get all their posts (products + events)
router.get("/club/:userId/posts", OrderController.getClubPosts);

// Club owner: toggle post visibility in feed
router.patch(
  "/posts/:type/:postId/visibility",
  OrderController.togglePostVisibility,
);

// Route for getting a single order details
router.get("/:id", OrderController.getOrderDetails);

export default router;
