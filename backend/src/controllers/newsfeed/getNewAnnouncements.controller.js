import { Op } from "sequelize";
import { NormalPost, ClubEventPost, ClubProductPost, User } from "../../modules/index.js";
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

    const dateFilter = {
      createdAt: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    };

    const authorInclude = {
      model: User,
      as: "author",
      attributes: ["id", "name", "email", "avatar", "role"],
    };

    // Fetch all three post types created today in parallel
    const [normalPosts, eventPosts, productPosts] = await Promise.all([
      NormalPost.findAll({
        where: { ...dateFilter, category: "CLUB" },
        include: [authorInclude],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
      }),
      ClubEventPost.findAll({
        where: dateFilter,
        include: [authorInclude],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
      }),
      ClubProductPost.findAll({
        where: dateFilter,
        include: [authorInclude],
        order: [["createdAt", "DESC"]],
        raw: true,
        nest: true,
      }),
    ]);

    // Tag each group with its postType and resolve images
    const processedNormal = await Promise.all(
      normalPosts.map((post) => resolvePostImages({ ...post, postType: "normal" }))
    );

    const processedEvents = await Promise.all(
      eventPosts.map((post) => resolvePostImages({ ...post, postType: "club-event" }))
    );

    const processedProducts = await Promise.all(
      productPosts.map((post) => resolvePostImages({ ...post, postType: "club-product" }))
    );

    // Combine and sort all announcements by createdAt descending
    const announcements = [
      ...processedNormal,
      ...processedEvents,
      ...processedProducts,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res
      .status(200)
      .json({ success: true, announcements });
  } catch (error) {
    logger.error("Error fetching new announcements:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
