import { Order, ClubProductPost, User, Transaction } from "../../modules/index.js";

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: ClubProductPost,
          as: "clubProduct", // From earlier associations
          attributes: ["id", "name", "description", "images", "price", "pickupNote"],
        },
        {
          model: User,
          as: "seller", // Association should be defined in modules/index.js
          attributes: ["id", "name", "email", "avatar"],
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "status", "amount", "createdAt"],
        }
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
