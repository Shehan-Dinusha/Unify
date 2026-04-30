import { Order, User, ClubProductPost } from "../../modules/index.js";

export const getOrdersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, error: "Product ID is required." });
    }

    // Fetch the product first so we can attach it to each order
    const product = await ClubProductPost.findOne({
      where: { id: productId },
      raw: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found." });
    }

    const orders = await Order.findAll({
      where: {
        itemId: productId,
        sellerId: product.authorId,   // authorId is the correct field in ClubProductPost
      },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "email", "phone", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    const formattedOrders = orders.map(o => ({
      ...o,
      clubProduct: product,
      timeline: typeof o.timeline === "string" ? JSON.parse(o.timeline) : o.timeline,
    }));

    res.status(200).json({ success: true, product, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
