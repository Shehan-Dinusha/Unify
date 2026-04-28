import { Order } from "../../modules/index.js";
import { Op } from "sequelize";

export const getClubOrderStats = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const stats = await Order.findAll({
      where: { sellerId: clubOwnerId },
      attributes: ["status", [Order.sequelize.fn("COUNT", Order.sequelize.col("id")), "count"]],
      group: ["status"],
      raw: true,
    });

    const totalOrders = stats.reduce((acc, s) => acc + parseInt(s.count, 10), 0);
    const pendingOrders = stats
      .filter((s) => ["Order Placed", "Seller Confirmed", "Ready for Pickup", "PENDING", "IN PROGRESS"].includes(s.status))
      .reduce((acc, s) => acc + parseInt(s.count, 10), 0);
    const completedOrders = stats
      .filter((s) => ["Order Completed", "COMPLETED"].includes(s.status))
      .reduce((acc, s) => acc + parseInt(s.count, 10), 0);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        statusBreakdown: stats
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
