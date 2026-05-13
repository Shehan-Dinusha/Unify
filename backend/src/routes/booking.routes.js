import express from "express";
import { 
  createEventBooking, 
  getStudentBookings, 
  getBookingDetails, 
  updateBookingStatus,
  getBookingsByEvent,
  bulkUpdateBookingStatus
} from "../controllers/bookings/index.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { 
  createBookingValidator, 
  updateBookingStatusValidator, 
  bulkUpdateBookingStatusValidator, 
  bookingParamsValidator 
} from "../validators/booking.validator.js";

const router = express.Router();

// Create a new event booking
router.post("/", protect, authorize("Student"), createBookingValidator, validate, createEventBooking);

// Get bookings for a specific student
router.get("/student/:userId?", protect, authorize("Student"), getStudentBookings);

// Get a single booking details
router.get("/:id", protect, bookingParamsValidator, validate, getBookingDetails);

// Update booking status
router.patch("/:id/status", 
  protect, 
  authorize("Club"), 
  bookingParamsValidator,
  updateBookingStatusValidator,
  validate,
  updateBookingStatus);

// Get bookings by event ID
router.get("/event/:eventId", protect, authorize("Club"), getBookingsByEvent);

// Bulk update booking status
router.patch("/bulk-status", 
  protect, 
  authorize("Club"), 
  bulkUpdateBookingStatusValidator,
  validate,
  bulkUpdateBookingStatus);

export default router;
