import express from "express";
import { OrderController } from "../controllers/index.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { 
  createOrderValidator, 
  updateOrderStatusValidator, 
  bulkUpdateOrderStatusValidator, 
  orderParamsValidator 
} from "../validators/order.validator.js";

const router = express.Router();

// Route to create a new order (e.g. buying a club product)
router.post("/", 
  protect, 
  authorize("Student"), 
  createOrderValidator,
  validate,
  OrderController.createOrder);

// Routes for fetching orders
router.get("/student/:userId",
  protect,
  authorize("Student"),
  OrderController.getStudentOrders);

// Analytics routes for club owners
router.get("/analytics/stats/:userId", protect, authorize("Club"), OrderController.getClubOrderStats);
router.get("/analytics/trends/:userId", protect, authorize("Club"), OrderController.getClubOrderTrends);
router.get("/analytics/top-products/:userId", protect, authorize("Club"), OrderController.getClubTopProducts);
router.get("/analytics/demographics/:userId", protect, authorize("Club"), OrderController.getClubBuyerDemographics);
router.get("/analytics/revenue/:userId", protect, authorize("Club"), OrderController.getClubRevenueBreakdown);

// Routes for bulk status update and specific product orders
router.patch("/bulk-status", 
  protect, 
  authorize("Club"), 
  bulkUpdateOrderStatusValidator,
  validate,
  OrderController.bulkUpdateOrderStatus);

router.get("/product/:productId", protect, authorize("Club"), OrderController.getOrdersByProduct);

// Route for updating individual order status
router.patch("/:id/status", 
  protect, 
  authorize("Club"), 
  orderParamsValidator,
  updateOrderStatusValidator,
  validate,
  OrderController.updateOrderStatus);

// Club owner: get all their posts (products + events)
// NOTE: must be BEFORE /club/:userId to avoid Express swallowing it
router.get("/club/:userId/posts", protect, authorize("Club"), OrderController.getClubPosts);

// Club owner: toggle post visibility in feed
router.patch(
  "/posts/:type/:postId/visibility",
  protect,
  authorize("Club"),
  OrderController.togglePostVisibility,
);

// Club owner: get all orders
router.get("/club/:userId", protect, authorize("Club"), OrderController.getClubOrders);

// Route for getting a single order details
router.get("/:id", protect, orderParamsValidator, validate, OrderController.getOrderDetails);

export default router;
