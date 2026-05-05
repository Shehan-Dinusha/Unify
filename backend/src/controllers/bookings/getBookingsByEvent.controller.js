import { EventBooking, User, ClubEventPost } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

const resolveUrl = async (img) => {
  if (!img) return img;
  let imgPath = img;
  if (typeof img === 'object' && img !== null) {
    if (img.url) imgPath = img.url;
    else return imgPath;
  }
  if (typeof imgPath !== 'string') return imgPath;
  if (imgPath.includes("X-Amz-Signature")) return imgPath;
  const s3Match = imgPath.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3Match) {
    try { return await getFileUrl(s3Match[1]); } catch { return imgPath; }
  }
  if (!imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    try { return await getFileUrl(imgPath); } catch { return imgPath; }
  }
  return imgPath;
};

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
      event.coverImage = await resolveUrl(event.coverImage);
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

    res.status(200).json({ success: true, bookings: formattedBookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
