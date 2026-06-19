import { Order } from "../../modules/index.js";
import { Op } from "sequelize";
import moment from "moment";

export const getClubOrderStats = async (req, res) => {
  try {
    const clubOwnerId = req.params.userId || (req.user ? req.user.id : null);

    if (!clubOwnerId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // 1. Basic Stats (Status Breakdown)
    const stats = await Order.findAll({
      where: { sellerId: clubOwnerId },
      attributes: [
        "status",
        [Order.sequelize.fn("COUNT", Order.sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const totalOrders = stats.reduce(
      (acc, s) => acc + parseInt(s.count, 10),
      0,
    );
    const pendingOrders = stats
      .filter((s) =>
        [
          "Order Placed",
          "Seller Confirmed",
          "Ready for Pickup",
          "PENDING",
          "IN PROGRESS",
        ].includes(s.status),
      )
      .reduce((acc, s) => acc + parseInt(s.count, 10), 0);
    const completedOrders = stats
      .filter((s) => ["Order Completed", "COMPLETED"].includes(s.status))
      .reduce((acc, s) => acc + parseInt(s.count, 10), 0);
    const unconfirmedOrderCount = stats
      .filter((s) => s.status === "Order Placed")
      .reduce((acc, s) => acc + parseInt(s.count, 10), 0);

    // 2. Trend Calculation (Total Orders: This Week vs Last Week)
    const startOfThisWeek = moment().subtract(7, "days").startOf("day");
    const startOfLastWeek = moment().subtract(14, "days").startOf("day");

    const [thisWeekCount, lastWeekCount] = await Promise.all([
      Order.count({
        where: {
          sellerId: clubOwnerId,
          createdAt: { [Op.gte]: startOfThisWeek.toDate() },
        },
      }),
      Order.count({
        where: {
          sellerId: clubOwnerId,
          createdAt: {
            [Op.lt]: startOfThisWeek.toDate(),
            [Op.gte]: startOfLastWeek.toDate(),
          },
        },
      }),
    ]);

    let totalOrdersTrend = 0;
    if (lastWeekCount > 0) {
      totalOrdersTrend =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    } else if (thisWeekCount > 0) {
      totalOrdersTrend = 100;
    }

    // 3. Action Needed Today (Pending orders created today)
    const pendingActionCount = await Order.count({
      where: {
        sellerId: clubOwnerId,
        status: ["Order Placed", "Seller Confirmed", "PENDING", "IN PROGRESS"],
        createdAt: { [Op.gte]: moment().startOf("day").toDate() },
      },
    });

    // 4. Completion Rate
    const completionRate =
      totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        unconfirmedOrderCount,
        totalOrdersTrend: parseFloat(totalOrdersTrend.toFixed(1)),
        pendingActionCount,
        completionRate: parseFloat(completionRate.toFixed(1)),
        statusBreakdown: stats,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
