import { body, param } from "express-validator";

// Allowed statuses for booking updates by club owners
const CLUB_OWNER_BOOKING_STATUSES = ["ATTENDED", "CANCELLED"];

export const createBookingValidator = [
  body("eventId")
    .notEmpty().withMessage("Event ID is required")
    .isInt().withMessage("Event ID must be an integer"),
  body("tierId")
    .notEmpty().withMessage("Tier ID is required"),
  body("qty")
    .optional()
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const updateBookingStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isString().withMessage("Status must be a string"),
];

export const bulkUpdateBookingStatusValidator = [
  body("bookingIds")
    .notEmpty().withMessage("Booking IDs are required")
    .isArray({ min: 1 }).withMessage("bookingIds must be a non-empty array"),
  body("bookingIds.*")
    .isInt().withMessage("Each Booking ID must be an integer"),
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(CLUB_OWNER_BOOKING_STATUSES).withMessage(`Invalid status. Must be one of: ${CLUB_OWNER_BOOKING_STATUSES.join(", ")}`),
];

export const bookingParamsValidator = [
  param("id")
    .notEmpty().withMessage("Booking ID is required")
    .isInt().withMessage("Booking ID must be an integer"),
];
