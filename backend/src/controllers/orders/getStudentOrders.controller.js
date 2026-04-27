import { Order, ClubProductPost } from "../../modules/index.js";

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

    // Manually join ClubProductPost data
    const productIds = [...new Set(orders.map((o) => o.itemId).filter((id) => id))];
    let productMap = {};
    if (productIds.length > 0) {
      const products = await ClubProductPost.findAll({
        where: { id: productIds },
        raw: true,
      });
      productMap = products.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});
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
