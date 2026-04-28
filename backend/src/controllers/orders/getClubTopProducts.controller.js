import { Order, ClubProductPost } from "../../modules/index.js";
import sequelize from "../../config/database.js";

export const getClubTopProducts = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

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
          attributes: ["id", "title", "price", "images"],
        }
      ],
      group: ["itemId", "clubProduct.id"],
      order: [[sequelize.fn("COUNT", sequelize.col("Order.id")), "DESC"]],
      limit: 5,
      raw: true,
      nest: true,
    });

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
