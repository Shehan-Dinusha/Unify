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
router.get("/analytics/top-products/:userId", OrderController.getClubTopProducts);
router.get("/analytics/demographics/:userId", OrderController.getClubBuyerDemographics);
router.get("/analytics/revenue/:userId", OrderController.getClubRevenueBreakdown);

// Route for updating order status
router.patch("/:id/status", OrderController.updateOrderStatus);

// Route for getting a single order details
router.get("/:id", OrderController.getOrderDetails);


export default router;
