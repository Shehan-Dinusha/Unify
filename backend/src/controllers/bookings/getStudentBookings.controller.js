import { EventBooking, ClubEventPost, User } from "../../modules/index.js";
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
        b.event.coverImage = await resolveUrl(b.event.coverImage);
      }
    }));

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
