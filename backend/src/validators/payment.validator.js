import { body, oneOf } from "express-validator";

export const checkoutSessionValidator = [
  oneOf([
    body("orderId").notEmpty().withMessage("Order ID is required"),
    body("bookingId").notEmpty().withMessage("Booking ID is required")
  ], "Either orderId or bookingId must be provided"),
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number")
    .custom((value) => value > 0).withMessage("Amount must be greater than zero"),
  body("productName")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isString().withMessage("Product name must be a string"),
  body("successUrl")
    .optional()
    .isURL({ require_tld: false }).withMessage("Invalid success URL"),
  body("cancelUrl")
    .optional()
    .isURL({ require_tld: false }).withMessage("Invalid cancel URL"),
];
