import { EventBooking, ClubEventPost } from "../../modules/index.js";

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Get the seller (club owner) ID from auth or body
    const sellerId = req.user ? req.user.id : req.body.sellerId;

    const booking = await EventBooking.findByPk(id, {
      include: [{ model: ClubEventPost, as: "event" }]
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Ensure only the event author (club owner) can update the booking
    if (sellerId && booking.event?.authorId !== parseInt(sellerId, 10)) {
      return res.status(403).json({ error: "Unauthorized to update this booking." });
    }

    await booking.update({ status });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
