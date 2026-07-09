import { Order, ClubProductPost, User, Transaction } from "../../modules/index.js";
import { resolveAssetUrl } from "../../utils/assetUrl.util.js";

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

    const plainOrder = order.toJSON();
    if (plainOrder.clubProduct && Array.isArray(plainOrder.clubProduct.images) && plainOrder.clubProduct.images.length > 0) {
      plainOrder.clubProduct.images = await Promise.all(plainOrder.clubProduct.images.map(resolveAssetUrl));
    }

    res.status(200).json({ success: true, order: plainOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
