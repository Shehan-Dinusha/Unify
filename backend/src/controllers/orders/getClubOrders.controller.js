import { Order, User, ClubProductPost } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

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
        plain.images = await Promise.all(plain.images.map(resolveAssetUrl));
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
