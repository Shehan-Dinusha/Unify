import { Op } from "sequelize";
import { ClubEventPost, User } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

const resolveImageUrl = async (img) => {
  if (!img) return img;
  if (img.includes("X-Amz-Signature")) return img;
  const s3UrlMatch = img.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3UrlMatch) {
    try { return await getFileUrl(s3UrlMatch[1]); } catch { return img; }
  }
  if (!img.startsWith("http") && !img.startsWith("/")) {
    try { return await getFileUrl(img); } catch { return img; }
  }
  return img;
};

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveImageUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveImageUrl(resolved.coverImage);
  }
  return resolved;
};

export const getEventsToday = async (req, res) => {
  try {
    // Get current date in YYYY-MM-DD format based on server local time
    const today = new Date();
    const todayString = today.toLocaleDateString("en-CA"); // Formats as YYYY-MM-DD

    const events = await ClubEventPost.findAll({
      where: {
        date: todayString,
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email", "avatar", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    // Add postType and resolve images
    const processedEvents = await Promise.all(
      events.map(async (event) => {
        const withType = { ...event, postType: "club-event" };
        return resolvePostImages(withType);
      })
    );

    res.status(200).json({ success: true, events: processedEvents });
  } catch (error) {
    console.error("Error fetching events today:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
