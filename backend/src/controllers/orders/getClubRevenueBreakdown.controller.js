import { Order, ClubProductPost } from "../../modules/index.js";
import sequelize from "../../config/database.js";

export const getClubRevenueBreakdown = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const breakdown = await Order.findAll({
      where: { sellerId: clubOwnerId },
      include: [
        {
          model: ClubProductPost,
          as: "clubProduct",
          attributes: ["category"],
        }
      ],
      attributes: [
        [sequelize.col("clubProduct.category"), "category"],
        [sequelize.fn("SUM", sequelize.col("total")), "revenue"]
      ],
      group: [sequelize.col("clubProduct.category")],
      raw: true,
    });

    const totalRevenue = breakdown.reduce((acc, b) => acc + parseFloat(b.revenue || 0), 0);
    const formattedBreakdown = breakdown.map(b => ({
      category: b.category || "Uncategorized",
      revenue: parseFloat(b.revenue || 0),
      percentage: totalRevenue > 0 ? ((parseFloat(b.revenue || 0) / totalRevenue) * 100).toFixed(1) : 0
    }));

    res.status(200).json({
      success: true,
      data: formattedBreakdown,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
