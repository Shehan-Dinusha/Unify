import express from "express";
import { 
  createEventBooking, 
  getStudentBookings, 
  getBookingDetails, 
  updateBookingStatus,
  getBookingsByEvent,
  bulkUpdateBookingStatus
} from "../controllers/bookings/index.js";

const router = express.Router();

// Create a new event booking
router.post("/", createEventBooking);

// Get bookings for a specific student
router.get("/student/:userId?", getStudentBookings);

// Get a single booking details
router.get("/:id", getBookingDetails);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

// Get bookings by event ID
router.get("/event/:eventId", getBookingsByEvent);

// Bulk update booking status
router.patch("/bulk-status", bulkUpdateBookingStatus);

export default router;
