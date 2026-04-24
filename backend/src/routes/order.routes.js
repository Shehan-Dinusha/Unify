import express from "express";
import { OrderController } from "../controllers/index.js";

const router = express.Router();

// Route to create a new order (e.g. buying a club product)
router.post("/", OrderController.createOrder);

// Routes for fetching orders
router.get("/student/:userId", OrderController.getStudentOrders);
router.get("/club/:userId", OrderController.getClubOrders);

// Route for updating order status
router.patch("/:id/status", OrderController.updateOrderStatus);

export default router;
