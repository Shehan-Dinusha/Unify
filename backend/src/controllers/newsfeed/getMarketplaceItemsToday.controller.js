import { Op } from "sequelize";
import { ClubProductPost, User } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";
import { resolveAvatarUrl } from "../../utils/avatarUrl.util.js";
import logger from "../../utils/logger.js";

const resolveImageUrl = async (img) => {
  if (!img) return img;
  if (img.includes("X-Amz-Signature")) return img;
  const s3UrlMatch = img.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3UrlMatch) {
    try {
      return await getFileUrl(s3UrlMatch[1]);
    } catch {
      return img;
    }
  }
  if (!img.startsWith("http") && !img.startsWith("/")) {
    try {
      return await getFileUrl(img);
    } catch {
      return img;
    }
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
  // Resolve author avatar
  if (resolved.author?.avatar !== undefined) {
    resolved.author = {
      ...resolved.author,
      avatar: await resolveAvatarUrl(resolved.author.avatar, resolved.author.name),
    };
  }
  return resolved;
};

export const getMarketplaceItemsToday = async (req, res) => {
  try {
    // Get start and end of today based on server local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const items = await ClubProductPost.findAll({
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
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const withType = { ...item, postType: "club-product" };
        return resolvePostImages(withType);
      }),
    );

    res.status(200).json({ success: true, items: processedItems });
  } catch (error) {
    logger.error("Error fetching marketplace items today:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
