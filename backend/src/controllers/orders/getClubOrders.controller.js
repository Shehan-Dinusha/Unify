import { Order, User, ClubProductPost } from "../../modules/index.js";
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

export const getClubOrders = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);
    
    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const orders = await Order.findAll({
      where: { sellerId: clubOwnerId },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "email", "phone", "avatar"],
        }
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    // Manually attach the club product to the orders since the association is mapped to MarketplaceItem by default
    const productIds = [...new Set(orders.map(o => o.itemId).filter(id => id))];
    const products = await ClubProductPost.findAll({
      where: { id: productIds },
    });

    const productMap = {};
    for (const p of products) {
      const plain = p.toJSON();
      if (Array.isArray(plain.images) && plain.images.length > 0) {
        plain.images = await Promise.all(plain.images.map(resolveUrl));
      }
      productMap[p.id] = plain;
    }

    const formattedOrders = orders.map(o => ({
      ...o,
      clubProduct: o.itemId ? productMap[o.itemId] : null,
      timeline: typeof o.timeline === 'string' ? JSON.parse(o.timeline) : o.timeline,
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
