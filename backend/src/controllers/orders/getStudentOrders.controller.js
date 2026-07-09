import { Order, User, ClubProductPost } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

export const getStudentOrders = async (req, res) => {
  try {
    const studentId = req.params.userId || (req.user ? req.user.id : null);

    if (!studentId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch orders without problematic association
    const orders = await Order.findAll({
      where: { buyerId: studentId },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Manually join ClubProductPost data with author
    const productIds = [...new Set(orders.map((o) => o.itemId).filter((id) => id))];
    let productMap = {};
    if (productIds.length > 0) {
      const products = await ClubProductPost.findAll({
        where: { id: productIds },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "avatar"],
          },
        ],
        // Note: Removing raw:true to allow nested include handling
      });
      
      // Resolve images and map products
      await Promise.all(products.map(async (pInstance) => {
        const p = pInstance.get({ plain: true });
        if (p.images && Array.isArray(p.images) && p.images.length > 0) {
          p.images = await Promise.all(p.images.map(resolveAssetUrl));
        }
        productMap[p.id] = p;
      }));
    }

    const formattedOrders = orders.map((o) => ({
      ...o,
      clubProduct: o.itemId ? productMap[o.itemId] || null : null,
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
