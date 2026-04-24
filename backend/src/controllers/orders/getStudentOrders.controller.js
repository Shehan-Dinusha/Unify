import { Order, ClubProductPost } from "../../modules/index.js";

export const getStudentOrders = async (req, res) => {
  try {
    const studentId = req.params.userId || (req.user ? req.user.id : null);
    
    if (!studentId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const orders = await Order.findAll({
      where: { buyerId: studentId },
      include: [
        {
          // We are storing the ClubProductPost id in itemId but Order currently associates itemId to MarketplaceItem.
          // For now, since we haven't redefined the association for ClubProductPost directly, we'll fetch manually if needed, 
          // or rely on a custom join. Let's just fetch them and map them.
          model: ClubProductPost,
          as: "clubProduct",
          required: false,
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    // If the association 'clubProduct' doesn't exist, we can fallback to mapping
    if (error.name === "SequelizeEagerLoadingError") {
      try {
        const orders = await Order.findAll({
          where: { buyerId: studentId },
          order: [["createdAt", "DESC"]],
          raw: true,
        });

        // Manually fetch products (since Association doesn't strictly exist on Order yet)
        const productIds = [...new Set(orders.map(o => o.itemId).filter(id => id))];
        const products = await ClubProductPost.findAll({
          where: { id: productIds },
          raw: true,
        });

        const productMap = products.reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {});

        const formattedOrders = orders.map(o => ({
          ...o,
          clubProduct: o.itemId ? productMap[o.itemId] : null,
        }));

        return res.status(200).json({ success: true, orders: formattedOrders });
      } catch (fallbackError) {
        return res.status(500).json({ error: fallbackError.message });
      }
    }
    res.status(500).json({ error: error.message });
  }
};
