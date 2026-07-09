import { EventBooking, User, ClubEventPost } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

export const getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }

    // Verify the event exists
    let event = await ClubEventPost.findOne({
      where: { id: eventId },
      raw: true,
    });
    
    if (event && event.coverImage) {
      event.coverImage = await resolveAssetUrl(event.coverImage);
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found or you do not have permission to view its bookings." });
    }

    const bookings = await EventBooking.findAll({
      where: { eventId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "avatar"],
        }
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    const formattedBookings = bookings.map(b => ({
      ...b,
      clubEvent: event,
    }));

    res.status(200).json({ success: true, bookings: formattedBookings, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
