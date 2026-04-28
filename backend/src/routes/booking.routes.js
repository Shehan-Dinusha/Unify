import express from "express";
import { createEventBooking, getStudentBookings, getBookingDetails, updateBookingStatus } from "../controllers/bookings/index.js";

const router = express.Router();

// Create a new event booking
router.post("/", createEventBooking);

// Get bookings for a specific student
router.get("/student/:userId?", getStudentBookings);

// Get a single booking details
router.get("/:id", getBookingDetails);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

export default router;
