import { body, param } from "express-validator";

// Allowed statuses for club owners
const CLUB_OWNER_STATUSES = ["Seller Confirmed", "Ready for Pickup", "Order Completed"];

export const createOrderValidator = [
  body("postId")
    .notEmpty().withMessage("Post ID is required")
    .isInt().withMessage("Post ID must be an integer"),
  body("qty")
    .optional()
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("paymentMethod")
    .notEmpty().withMessage("Payment method is required")
    .isIn(["STRIPE", "CASH_ON_PICKUP"]).withMessage("Invalid payment method"),
  body("color")
    .optional()
    .isString().withMessage("Color must be a string"),
  body("size")
    .optional()
    .isString().withMessage("Size must be a string"),
];

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isString().withMessage("Status must be a string"),
  body("note")
    .optional()
    .isString().withMessage("Note must be a string"),
];

export const bulkUpdateOrderStatusValidator = [
  body("orderIds")
    .notEmpty().withMessage("Order IDs are required")
    .isArray({ min: 1 }).withMessage("orderIds must be a non-empty array"),
  body("orderIds.*")
    .isInt().withMessage("Each Order ID must be an integer"),
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(CLUB_OWNER_STATUSES).withMessage(`Invalid status. Must be one of: ${CLUB_OWNER_STATUSES.join(", ")}`),
];

export const orderParamsValidator = [
  param("id")
    .notEmpty().withMessage("Order ID is required")
    .isInt().withMessage("Order ID must be an integer"),
];
