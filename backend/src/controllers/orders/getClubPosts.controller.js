import { ClubProductPost, ClubEventPost, Order } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";
import logger from "../../utils/logger.js";

export const getClubPosts = async (req, res) => {
  try {
    const authorId = parseInt(req.params.userId, 10);

    if (!authorId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // raw: false so Sequelize auto-parses JSON columns (images, coverImage, etc.)
    const [productPosts, eventPosts, unconfirmedOrders] = await Promise.all([
      ClubProductPost.findAll({
        where: { authorId },
        order: [["createdAt", "DESC"]],
      }),
      ClubEventPost.findAll({
        where: { authorId },
        order: [["createdAt", "DESC"]],
      }),
      Order.findAll({
        where: { sellerId: authorId, status: "Order Placed" },
        attributes: [
          "itemId",
          [Order.sequelize.fn("COUNT", Order.sequelize.col("id")), "count"],
        ],
        group: ["itemId"],
        raw: true,
      }),
    ]);

    const unconfirmedCountByProduct = new Map(
      unconfirmedOrders.map((order) => [
        Number(order.itemId),
        parseInt(order.count, 10),
      ]),
    );

    // Resolve product post images
    const resolvedProducts = await Promise.all(
      productPosts.map(async (post) => {
        const plain = post.toJSON();
        if (Array.isArray(plain.images) && plain.images.length > 0) {
          plain.images = await Promise.all(plain.images.map(resolveAssetUrl));
        }
        return {
          ...plain,
          postType: "club-product",
          unconfirmedOrderCount: unconfirmedCountByProduct.get(Number(plain.id)) || 0,
        };
      })
    );

    // Resolve event post cover images
    const resolvedEvents = await Promise.all(
      eventPosts.map(async (post) => {
        const plain = post.toJSON();
        if (plain.coverImage) {
          plain.coverImage = await resolveAssetUrl(plain.coverImage);
        }
        return { ...plain, postType: "club-event", unconfirmedOrderCount: 0 };
      })
    );

    // Merge and sort by newest first
    const posts = [...resolvedProducts, ...resolvedEvents].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, posts });
  } catch (error) {
    logger.error("[getClubPosts] Error:", error);
    res.status(500).json({ error: error.message });
  }
};
