import { EventBooking } from "../../modules/index.js";

// Statuses that a club owner can set for bookings (not PENDING which is system-set)
const CLUB_OWNER_BOOKING_STATUSES = ["ATTENDED", "CANCELLED"];

export const bulkUpdateBookingStatus = async (req, res) => {
  try {
    const { bookingIds, status } = req.body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({ success: false, error: "An array of bookingIds is required." });
    }

    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required." });
    }

    if (!CLUB_OWNER_BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Club owners can only set: ${CLUB_OWNER_BOOKING_STATUSES.join(", ")}.`
      });
    }

    const [updatedCount] = await EventBooking.update(
      { status },
      { where: { id: bookingIds } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} bookings to "${status}".`,
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

