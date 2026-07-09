import { createEventBooking } from "./createEventBooking.controller.js";
import { getStudentBookings } from "./getStudentBookings.controller.js";
import { getBookingDetails } from "./getBookingDetails.controller.js";
import { updateBookingStatus } from "./updateBookingStatus.controller.js";

import { getBookingsByEvent } from "./getBookingsByEvent.controller.js";
import { bulkUpdateBookingStatus } from "./bulkUpdateBookingStatus.controller.js";

export { 
  createEventBooking, 
  getStudentBookings, 
  getBookingDetails, 
  updateBookingStatus,
  getBookingsByEvent,
  bulkUpdateBookingStatus
};
