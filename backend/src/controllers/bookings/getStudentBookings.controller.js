import { EventBooking, ClubEventPost, User } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

export const getStudentBookings = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user ? req.user.id : null);
    const { status } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const where = { userId };
    if (status) {
      // Map frontend tabs to backend ENUM if necessary
      if (status.toUpperCase() === "IN PROGRESS") {
        where.status = "PENDING"; // Or whatever logic represents progress
      } else {
        where.status = status.toUpperCase();
      }
    }

    const bookings = await EventBooking.findAll({
      where,
      include: [
        {
          model: ClubEventPost,
          as: "event",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "name", "avatar"],
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      nest: true,
      raw: true,
    });
    
    // Resolve images
    await Promise.all(bookings.map(async (b) => {
      if (b.event && b.event.coverImage) {
        b.event.coverImage = await resolveAssetUrl(b.event.coverImage);
      }
    }));

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
