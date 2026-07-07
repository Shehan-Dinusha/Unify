import { Op } from "sequelize";
import { NormalPost, User } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import logger from "../../utils/logger.js";

const resolvePostImages = async (post) => {
  const resolved = { ...post };
  if (Array.isArray(resolved.images) && resolved.images.length > 0) {
    resolved.images = await Promise.all(resolved.images.map(resolveAssetUrl));
  }
  if (resolved.coverImage) {
    resolved.coverImage = await resolveAssetUrl(resolved.coverImage);
  }
  // Resolve author avatar
  if (resolved.author?.avatar !== undefined) {
    resolved.author = {
      ...resolved.author,
      avatar: await resolveAvatarUrl(resolved.author.avatar, resolved.author.name),
    };
  }
  return resolved;
};

export const getNewAnnouncements = async (req, res) => {
  try {
    // Get start and end of today based on server local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const announcements = await NormalPost.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
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
    const processedAnnouncements = await Promise.all(
      announcements.map(async (announcement) => {
        // Find correct postType based on category if needed, or default to "normal"
        // In getFeed, "food-cafe" uses category "FOOD" and "services" uses "SELF_EMPLOYED"
        let postType = "normal";
        if (announcement.category === "FOOD") postType = "food-cafe";
        else if (announcement.category === "SELF_EMPLOYED")
          postType = "services";

        const withType = { ...announcement, postType };
        return resolvePostImages(withType);
      }),
    );

    res
      .status(200)
      .json({ success: true, announcements: processedAnnouncements });
  } catch (error) {
    logger.error("Error fetching new announcements:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
