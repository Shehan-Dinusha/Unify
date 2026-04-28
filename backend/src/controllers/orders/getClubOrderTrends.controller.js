import { Order } from "../../modules/index.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";

export const getClubOrderTrends = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);
    const days = parseInt(req.query.days, 10) || 30;

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Order.findAll({
      where: {
        sellerId: clubOwnerId,
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
