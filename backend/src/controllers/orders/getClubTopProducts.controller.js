import { Order, ClubProductPost, EventBooking, ClubEventPost } from "../../modules/index.js";
import sequelize from "../../config/database.js";
import { getFileUrl } from "../../services/s3.service.js";
import logger from "../../utils/logger.js";

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

export const getClubTopProducts = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // 1. Fetch Top Products
    const topProducts = await Order.findAll({
      where: { sellerId: clubOwnerId },
      attributes: [
        "itemId",
        [sequelize.fn("COUNT", sequelize.col("Order.id")), "salesCount"],
        [sequelize.fn("SUM", sequelize.col("total")), "totalRevenue"]
      ],
      include: [
        {
          model: ClubProductPost,
          as: "clubProduct",
          attributes: ["id", "name", "price", "images"],
        }
      ],
      group: ["itemId", "clubProduct.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("Order.id")), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    // 2. Fetch Top Events
    // To filter by clubOwnerId, we need to join with ClubEventPost
    const topEvents = await EventBooking.findAll({
      attributes: [
        "eventId",
        [sequelize.fn("COUNT", sequelize.col("EventBooking.id")), "salesCount"],
        [sequelize.fn("SUM", sequelize.col("total")), "totalRevenue"]
      ],
      include: [
        {
          model: ClubEventPost,
          as: "event",
          where: { authorId: clubOwnerId },
          attributes: ["id", "name", "price", "coverImage"],
        }
      ],
      group: ["eventId", "event.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("EventBooking.id")), "DESC"]],
      limit: 10,
      raw: true,
      nest: true,
    });

    // 3. Normalize and Resolve Images
    const normalizedProducts = await Promise.all(topProducts.map(async (p) => {
      const imgKey = p.clubProduct?.images?.[0];
      return {
        id: p.itemId,
        title: p.clubProduct?.name || "Unknown Product",
        salesCount: parseInt(p.salesCount),
        totalRevenue: parseFloat(p.totalRevenue),
        image: await resolveUrl(imgKey),
        postType: "club-product"
      };
    }));

    const normalizedEvents = await Promise.all(topEvents.map(async (e) => {
      const imgKey = e.event?.coverImage;
      return {
        id: e.eventId,
        title: e.event?.name || "Unknown Event",
        salesCount: parseInt(e.salesCount),
        totalRevenue: parseFloat(e.totalRevenue),
        image: await resolveUrl(imgKey),
        postType: "club-event"
      };
    }));

    // 4. Combine, Sort and Slice
    const combined = [...normalizedProducts, ...normalizedEvents]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: combined,
    });
  } catch (error) {
    logger.error("[getClubTopProducts] Error:", error);
    res.status(500).json({ error: error.message });
  }
};
